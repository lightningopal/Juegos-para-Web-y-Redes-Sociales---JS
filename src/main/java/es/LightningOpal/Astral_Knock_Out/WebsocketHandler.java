package es.LightningOpal.Astral_Knock_Out;

/// Imports
//import java.util.concurrent.atomic.AtomicInteger;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

// Clase WebsocketHandler, que gestiona los mensajes websocket
public class WebsocketHandler extends TextWebSocketHandler {
	/// Variables
	private static final boolean DEBUG_MODE = true;
	private static final String USER_ATTRIBUTE = "USER";
	private ObjectMapper mapper = new ObjectMapper();

	/// Métodos
	// Método afterConnectionEstablished, que se ejecuta cuando se establece una
	/// conexión al servidor
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		// Se crea un usuario para esa sesión
		User user = new User();

		// Se establece su sesión y la del player
		user.setSession(session);
		user.getPlayer_selected().setSession(session);

		// Se añade el usuario al mapa de atributos
		session.getAttributes().put(USER_ATTRIBUTE, user);

		// ObjectNode 'msg', que guarda la información del mensaje a enviar
		ObjectNode msg = mapper.createObjectNode();

		// Se guarda en el ObjectNode 'msg' el evento y la id del usuario
		msg.put("event", "JOIN");
		msg.put("id", user.getUserId());

		// Se envía el mensaje al usuario
		synchronized (user.getSession()) {
			user.getSession().sendMessage(new TextMessage(msg.toString()));
		}

		if (DEBUG_MODE) {
			System.out.println("Connected user with session " + user.getSession().getId() + ".");
		}

		// Se intenta escribir la información en el log
		try {
			AKO_Server.logLock.lock();
			AKO_Server.logWriter = new BufferedWriter(new FileWriter(AKO_Server.logFile, true));
			String time = new SimpleDateFormat("HH:mm:ss").format(Calendar.getInstance().getTime());
			AKO_Server.logWriter.write(time + " - Conected user with session " + user.getSession().getId() + ".\n");
			AKO_Server.logWriter.close();
			AKO_Server.logLock.unlock();
		} catch (Exception e) {
			// Si falla, se muestra el error
			e.printStackTrace();
		}
	}

	// Método handleTextMessage, que controla los mensajes que le llegan al servidor
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		try {
			// Lee la información del mensaje en un JsonNode 'node'
			JsonNode node = mapper.readTree(message.getPayload());

			// Crea un ObjectNode 'msg' para almacenar el mensaje que será enviado
			// posteriormente
			ObjectNode msg = mapper.createObjectNode();

			// Obtiene el usuario que ha enviado el mensaje
			User user = (User) session.getAttributes().get(USER_ATTRIBUTE);

			// Variables que se utilizan en distintos casos.
			String name, password, playerType;
			int secondarySkill, room, level;
			Player thisPlayer;

			if (DEBUG_MODE) {
				// System.out.println(node.get("event").asText());
			}

			// Dependiendo del tipo de evento en el mensaje, ejecuta distintas funciones
			switch (node.get("event").asText()) {
				// Cuando un usuario se une al servidor
				case "JOIN":
					// Asignar evento e id de usuario en el ObjectNode 'msg'
					msg.put("event", "JOIN");
					msg.put("id", user.getUserId());

					// Enviar el mensaje
					synchronized (user.getSession()) {
						user.getSession().sendMessage(new TextMessage(msg.toString()));
					}
					break;
				// Cuando un usuario se logea en el servidor
				case "LOG_IN":
					// Obtener nombre y contraseña del usuario
					name = node.get("name").asText();
					password = node.get("password").asText();

					// Si existe el nombre en los datos, comprueba que coincidan
					if (UsersController.loginInfo.containsKey(name)) {
						// Si coinciden los datos, comprueba si el usuario está ya conectado
						if (UsersController.loginInfo.get(name).equals(password.hashCode())) {
							// Si el usuario ya está conectado
							if (UsersController.CheckUserConnected(name)) {
								// Asignar evento y mensaje a enviar en el ObjectNode 'msg'
								msg.put("event", "AUTHENTICATION_ERROR");
								msg.put("message", "User is already connected");

								// Enviar el mensaje
								synchronized (user.getSession()) {
									user.getSession().sendMessage(new TextMessage(msg.toString()));
								}

								if (DEBUG_MODE) {
									System.out.println("Usuario ya conectado");
								}
								// Si el usuario no está conectado, pasa el login
							} else {
								// Se conecta el usuario al servidor
								User thisUser = UsersController.ConnectUser(name);

								// Se establece la sesión en usuario y jugador
								thisUser.setSession(session);
								thisUser.getPlayer_selected().setSession(session);

								// Se añade el usuario al mapa de atributos
								session.getAttributes().put(USER_ATTRIBUTE, thisUser);

								// Asignar evento, nombre de usuario e id en el ObjectNode 'msg'
								msg.put("event", "AUTHENTICATION_SUCCESS");
								msg.put("user_name", name);
								msg.put("id", thisUser.getUserId());

								// Enviar el mensaje
								synchronized (user.getSession()) {
									user.getSession().sendMessage(new TextMessage(msg.toString()));
								}

								if (DEBUG_MODE) {
									System.out.println("Usuario conectado: " + name);
								}
							}
							// Si los datos no coinciden, la contraseña es incorrecta
						} else {
							// Asignar evento y mensaje a enviar en el ObjectNode 'msg'
							msg.put("event", "AUTHENTICATION_ERROR");
							msg.put("message", "Password is incorrect");

							// Enviar el mensaje
							synchronized (user.getSession()) {
								user.getSession().sendMessage(new TextMessage(msg.toString()));
							}

							if (DEBUG_MODE) {
								System.out.println("Contraseña incorrecta");
							}
						}
						// Si el usuario no existe
					} else {
						// Asignar evento y mensaje a enviar en el ObjectNode 'msg'
						msg.put("event", "AUTHENTICATION_ERROR");
						msg.put("message", "User doesn't exist");

						// Enviar el mensaje
						synchronized (user.getSession()) {
							user.getSession().sendMessage(new TextMessage(msg.toString()));
						}

						if (DEBUG_MODE) {
							System.out.println("El usuario no existe");
						}
					}
					break;
				// Cuando un usuario se registra en el servidor
				case "SIGN_UP":
					// Obtener nombre y contraseña del usuario
					name = node.get("name").asText();
					password = node.get("password").asText();

					// Comprobar si ya existe un usuario con ese nombre en el servidor
					boolean userAlreadyExists = false;

					for (String username : UsersController.loginInfo.keySet()) {
						if (name.equalsIgnoreCase(username)) {
							userAlreadyExists = true;
							break;
						}
					}

					// Si el usuario ya existe
					if (userAlreadyExists) {
						// Asignar evento y mensaje a enviar en el ObjectNode 'msg'
						msg.put("event", "AUTHENTICATION_ERROR");
						msg.put("message", "There is already an user with that name");

						// Enviar el mensaje
						synchronized (user.getSession()) {
							user.getSession().sendMessage(new TextMessage(msg.toString()));
						}

						if (DEBUG_MODE) {
							System.out.println("Ya existe un usuario con ese nombre");
						}
						// Si el usuario no existe, se crea
					} else {
						// Se registra al nuevo usuario
						User thisUser = UsersController.RegisterNewUser(name, password);

						// Se conecta el nuevo usuario
						UsersController.ConnectNewUser(thisUser);

						// Se establece la sesión en usuario y jugador
						thisUser.setSession(session);
						thisUser.getPlayer_selected().setSession(session);

						// Se añade el usuario al mapa de atributos
						session.getAttributes().put(USER_ATTRIBUTE, thisUser);

						// Asignar evento, nombre de usuario e id en el ObjectNode 'msg'
						msg.put("event", "AUTHENTICATION_SUCCESS");
						msg.put("user_name", name);
						msg.put("id", user.getUserId());

						// Enviar el mensaje
						synchronized (user.getSession()) {
							user.getSession().sendMessage(new TextMessage(msg.toString()));
						}

						if (DEBUG_MODE) {
							System.out.println("Nuevo usuario: " + name);
						}
					}
					break;
				// Cuando un usuario solicita el ranking
				case "REQUEST_RANKING":
					// Obtenemos los datos del ranking
					RankingUser[] ranking = UsersController.getRankingData(user);

					// Creamos un ArrayNode 'rankingNode' para guardar a los jugadores
					ArrayNode rankingNode = mapper.createArrayNode();

					// Asignamos los datos en el ArrayNode 'rankingNode'
					for (int i = 0; i < ranking.length; i++) {
						// Creamos un ObjectNode 'rankingPlayer' para cada jugador
						ObjectNode rankingPlayer = mapper.createObjectNode();

						// Asignamos los datos del ObjectNode 'rankingPlayer' para este jugador
						rankingPlayer.put("name", ranking[i].getUserName());
						rankingPlayer.put("wins", ranking[i].getWinsCount());
						rankingPlayer.put("loses", ranking[i].getLosesCount());
						rankingPlayer.put("points", ranking[i].getPoints());

						// Añadimos el ObjectNode 'rankingPlayer' al ArrayNode 'rankingNode'
						rankingNode.addPOJO(rankingPlayer);
					}

					// Asignar evento y datos en el ObjectNode 'msg'
					msg.put("event", "RANKING_RESULTS");
					msg.putPOJO("ranking", rankingNode);

					// Enviar el mensaje
					synchronized (user.getSession()) {
						user.getSession().sendMessage(new TextMessage(msg.toString()));
					}

					if (DEBUG_MODE) {
						System.out.println("Ranking solicitado: " + user.getUser_name());
					}
					break;
				// Cuando un usuario se conecta, para recibir sus datos
				case "REQUEST_OPTIONS_DATA":
					// Asignar evento y datos en el ObjectNode 'msg'
					msg.put("event", "OPTIONS_RESULTS");
					msg.put("musicVol", user.getMusicVol());
					msg.put("sfxVol", user.getSfxVol());
					msg.put("name", user.getUser_name());
					msg.put("currency", user.getCurrency());
					msg.put("points", Math.round(user.getElo()));

					// Enviar el mensaje
					synchronized (user.getSession()) {
						user.getSession().sendMessage(new TextMessage(msg.toString()));
					}

					if (DEBUG_MODE) {
						System.out.println("Datos de opciones solicitados: " + user.getUser_name());
					}
					break;
				case "UPDATE_VOL":
					// Esta vez no enviaremos mensaje de vuelta, ya que queremos
					// que se actualize directamente en el cliente

					// Obtenemos los datos del mensaje
					String volType = node.get("volType").asText();
					float value = (float) node.get("value").asDouble();

					// Actualizamos el valor
					if (volType.equals("musicVol")) {
						user.setMusicVol(value);
					} else if (volType.equals("sfxVol")) {
						user.setSfxVol(value);
					} else {
						if (DEBUG_MODE) {
							System.out.println("Tipo de volumen no reconocido: " + volType + " - " + user.getUser_name());
						}
					}

					if (DEBUG_MODE) {
						//System.out.println("Actualizado volumen: " + volType + " - " + user.getUser_name());
					}
					break;
				// Cuando se solicita la creación de una partida de "space gym"
				case "CREATE_SPACE_GYM":
					GamesManager.INSTANCE.spaceGymGamesLock.lock();
					// Si hay partidas disponibles
					if (GamesManager.INSTANCE.spaceGym_games.size() < GamesManager.INSTANCE.MAX_SPACEGYM_GAMES)
					{
						// Se obtienen los atributos elegidos
						playerType = node.get("playerType").asText();
						secondarySkill = node.get("skill").asInt();

						// Se asignan los atributos
						user.setPlayer_selected(new Player(user.getUserId(), user.getSession(), user.getUser_name(),
								playerType, Math.round(user.getElo()), user.getMMR(), secondarySkill, SpaceGym_Game.playerPosX, SpaceGym_Game.playerPosY));

						// Si el jugador no está ya en una
						if (!GamesManager.INSTANCE.spaceGym_games.containsKey(user.getPlayer_selected().getUserName()))
						{
							System.out.println("No está ya en partida: " + user.getUser_name());
							// Se crea la partida de space gym
							GamesManager.INSTANCE.startSpaceGym(user);

							GamesManager.INSTANCE.spaceGymGamesLock.unlock();

							// Asignar evento en el ObjectNode 'msg'
							msg.put("event", "CREATED_SPACE_GYM");

							// Enviar el mensaje
							synchronized (user.getSession()) {
								user.getSession().sendMessage(new TextMessage(msg.toString()));
							}

							if (DEBUG_MODE) {
								name = user.getUser_name();
								System.out.println("Space Gym: " + name);
							}
						}
						else
						{
							GamesManager.INSTANCE.spaceGymGamesLock.unlock();
						}
					}
					// Si no hay partidas disponibles
					else
					{
						GamesManager.INSTANCE.spaceGymGamesLock.unlock();
						// Asignar evento en el ObjectNode 'msg'
						msg.put("event", "GAMES_FULL");

						// Enviar el mensaje
						synchronized (user.getSession()) {
							user.getSession().sendMessage(new TextMessage(msg.toString()));
						}

						if (DEBUG_MODE) {
							name = user.getUser_name();
							System.out.println("No hay partidas de Space Gym disponibles: " + name);
						}
					}
					break;
				// Cuando se reciben los datos del usuario para actualizar el space gym
				case "UPDATE_CLIENT":
					// Se obtiene el jugador del usuario
					thisPlayer = user.getPlayer_selected();

					// Se obtiene la información de movimiento del nodo
					boolean movingLeft = node.get("movingLeft").asBoolean();
					boolean movingRight = node.get("movingRight").asBoolean();
					boolean falling = node.get("falling").asBoolean();

					// Se actualizan los valores de información de movimiento del jugador
					thisPlayer.updatePlayerValues(movingLeft, movingRight, falling);
					break;
				// Cuando un jugador busca partida
				case "SEARCHING_GAME":
					System.out.println("Busca partida: " + user.getUser_name() + ", Player: " + user.getPlayer_selected().toString());
					GamesManager.INSTANCE.tournamentGamesLock.lock();
					// Si hay partidas disponibles
					if (GamesManager.INSTANCE.tournament_games.size() < GamesManager.INSTANCE.MAX_TOURNAMENT_GAMES)
					{
						// Si el jugador ya está en partida, no haremos nada
						// Check if user was ingame
						Player ingamePlayer = user.getPlayer_selected();
						boolean currentlyInGame = false;
						if (GamesManager.INSTANCE.tournament_games.containsKey(ingamePlayer.getRoom())) {
							if (GamesManager.INSTANCE.tournament_games.get(ingamePlayer.getRoom()).getPlayers()
									.contains(ingamePlayer)) {
										currentlyInGame = true;
							}
						}

						if (!currentlyInGame)
						{
							// Se obtienen los atributos elegidos
							playerType = node.get("playerType").asText();
							secondarySkill = node.get("skill").asInt();
							level = node.get("level").asInt();

							// Se crea el jugador con los datos
							thisPlayer = new Player(user.getUserId(), user.getSession(), user.getUser_name(), playerType,
									Math.round(user.getElo()), user.getMMR(), secondarySkill, 0, 0);

							// Se asignan los atributos
							user.setPlayer_selected(thisPlayer);

							// Intenta escribir la información en el archivo de log
							try {
								AKO_Server.logLock.lock();
								AKO_Server.logWriter = new BufferedWriter(new FileWriter(AKO_Server.logFile, true));
								String time = new SimpleDateFormat("HH:mm:ss").format(Calendar.getInstance().getTime());
								AKO_Server.logWriter.write(time + " - Searching Tournament Game: " + thisPlayer.getUserName() + 
								" [PlayerType: " + playerType + ", SecondarySkill: " + secondarySkill + ", Skin: " + thisPlayer.getSkin() +
								", Level: " + level + ", Points: " + thisPlayer.getPoints() + "]" + ".\n");
								AKO_Server.logWriter.close();
								AKO_Server.logLock.unlock();
							} catch (Exception e) {
								// Si falla, se muestra el error
								e.printStackTrace();
							}

							// Si el jugador ya está en la cola, no haremos nada
							if (!GamesManager.INSTANCE.searching_players.get(level).contains(thisPlayer))
							{
								// Si hay jugadores en cola para ese nivel, se empareja contra el primero
								if (GamesManager.INSTANCE.searching_players.get(level).size() > 0) {
									// Obtenemos la información del rival
									Player rival = GamesManager.INSTANCE.searching_players.get(level).remove();
									System.out.println("Tamaño cola (after remove " + rival.getUserName() + ") nivel " + level + ": " + GamesManager.INSTANCE.searching_players.get(level).size());

									// Se crea la partida
									try
									{
										room = GamesManager.INSTANCE.createTournamentGame(thisPlayer, rival, level);

										// Intenta escribir la información en el archivo de log
										try {
											AKO_Server.logLock.lock();
											AKO_Server.logWriter = new BufferedWriter(new FileWriter(AKO_Server.logFile, true));
											String time = new SimpleDateFormat("HH:mm:ss").format(Calendar.getInstance().getTime());
											AKO_Server.logWriter.write(time + " - Create Tournament Game: " + thisPlayer.getUserName() +
											" - " + rival.getUserName() + " - Level: " + level + ", Room: " + room + ".\n");
											AKO_Server.logWriter.close();
											AKO_Server.logLock.unlock();
										} catch (Exception e) {
											// Si falla, se muestra el error
											e.printStackTrace();
										}

										// Creamos un ArrayNode 'players' para guardar la información de ambos jugadores
										ArrayNode players = mapper.createArrayNode();

										// Guardar la información del jugador A
										ObjectNode playerA = mapper.createObjectNode();

										playerA.put("playerId", thisPlayer.getPlayerId());
										playerA.put("userName", thisPlayer.getUserName());
										playerA.put("playerType", thisPlayer.getPlayerType());
										playerA.put("skin", thisPlayer.getSkin());
										playerA.put("skill", thisPlayer.getSkill());
										playerA.put("points", thisPlayer.getPoints());

										players.addPOJO(playerA);

										// Guardar la información del jugador B
										ObjectNode playerB = mapper.createObjectNode();

										playerB.put("playerId", rival.getPlayerId());
										playerB.put("userName", rival.getUserName());
										playerB.put("playerType", rival.getPlayerType());
										playerB.put("skin", rival.getSkin());
										playerB.put("skill", rival.getSkill());
										playerB.put("points", rival.getPoints());

										players.addPOJO(playerB);

										// Asignar evento, sala y jugadores en el ObjectNode 'msg'
										msg.put("event", "GAME_FOUND");
										msg.put("room", room);
										msg.putPOJO("players", players);

										// Enviar el mensaje a ambos usuarios
										synchronized (thisPlayer.getSession()) {
											thisPlayer.getSession().sendMessage(new TextMessage(msg.toString()));
										}
										synchronized (rival.getSession()) {
											rival.getSession().sendMessage(new TextMessage(msg.toString()));
										}

										if (DEBUG_MODE) {
											System.out.println(
													"Partida creada [" + room + "]: " + thisPlayer.getUserName() + " - " + rival.getUserName());
										}
									}
									catch (Exception e)
									{
										e.printStackTrace();
										System.out.println("NO SE HA PODIDO CREAR PARTIDA EN WSHandler");
									}
									finally
									{
										GamesManager.INSTANCE.tournamentGamesLock.unlock();
									}
								}
								// Si no, añadimos al jugador a la cola
								else {
									// Añade al jugador a la cola
									GamesManager.INSTANCE.searching_players.get(level).add(thisPlayer);
									System.out.println("Tamaño cola (after add " + thisPlayer.getUserName() + ") nivel " + level + ": " + GamesManager.INSTANCE.searching_players.get(level).size());
									GamesManager.INSTANCE.tournamentGamesLock.unlock();

									// Asignar evento, sala y jugadores en el ObjectNode 'msg'
									msg.put("event", "NUMBER_OF_USERS");
									msg.put("value", UsersController.getConnectedUsers());

									// Enviar el mensaje a ambos usuarios
									synchronized (thisPlayer.getSession()) {
										thisPlayer.getSession().sendMessage(new TextMessage(msg.toString()));
									}

									/*if (DEBUG_MODE) {
										name = user.getUser_name();
										System.out.println("Buscando partida: " + name);
									}*/
								}
							}
							else
							{
								GamesManager.INSTANCE.tournamentGamesLock.unlock();
							}
						}
						else
						{
							GamesManager.INSTANCE.tournamentGamesLock.unlock();
						}
					}
					// Si no hay partidas disponibles
					else
					{
						GamesManager.INSTANCE.tournamentGamesLock.unlock();
						// Asignar evento en el ObjectNode 'msg'
						msg.put("event", "GAMES_FULL");

						// Enviar el mensaje
						synchronized (user.getSession()) {
							user.getSession().sendMessage(new TextMessage(msg.toString()));
						}

						if (DEBUG_MODE) {
							name = user.getUser_name();
							System.out.println("No hay partidas de Tournament disponibles: " + name);
						}
					}
				break;
				case "GAME_START":
					// Obtenemos la sala del nodo
					room = node.get("room").asInt();

					// Avisamos de que el jugador ya está listo
					boolean gameStarted = GamesManager.INSTANCE.ready(room);

					// Si la partida ha empezado
					if (gameStarted) {
						// Asignar evento en el ObjectNode 'msg'
						msg.put("event", "GAME_STARTED");
						GamesManager.INSTANCE.tournament_games.get(room).setGameStarted(true);
						// Se le envía el mensaje a ambos jugadores
						GamesManager.INSTANCE.tournament_games.get(room).broadcast(msg.toString());

						if (DEBUG_MODE) {
							String debugString = "Comienza la partida: ";
	
							for (Player player : GamesManager.INSTANCE.tournament_games.get(room).getPlayers()) {
								debugString += player.getUserName() + " - ";
							}
	
							debugString = debugString.substring(0, debugString.length() - 3);
							debugString += ".";
	
							System.out.println(debugString);
						}
					}
					break;
				case "CANCEL_QUEUE":
					// Se obtienen los atributos elegidos
					level = node.get("level").asInt();

					// Se obtiene el jugador de los datos
					thisPlayer = user.getPlayer_selected();

					// Borra al jugador de la cola
					GamesManager.INSTANCE.tournamentGamesLock.lock();
					GamesManager.INSTANCE.searching_players.get(level).remove(thisPlayer);
					GamesManager.INSTANCE.tournamentGamesLock.unlock();

					// Asignar evento, sala y jugadores en el ObjectNode 'msg'
					msg.put("event", "CANCELED_QUEUE");

					// Enviar el mensaje al usuario
					synchronized (user.getSession()) {
						user.getSession().sendMessage(new TextMessage(msg.toString()));
					}

					if (DEBUG_MODE) {
						name = user.getUser_name();
						System.out.println("Deja de buscar partida: " + name);
					}
					break;
				case "LEAVE_GAME":
					room = node.get("room").asInt();
					if (room == -1) { // Space Gym
						GamesManager.INSTANCE.stopSpaceGym(user);
					} else { // Tournament
						Player disconnectedPlayer = user.getPlayer_selected();
						if (GamesManager.INSTANCE.tournament_games.containsKey(disconnectedPlayer.getRoom())) {
							if (GamesManager.INSTANCE.tournament_games.get(disconnectedPlayer.getRoom()).getPlayers()
									.contains(disconnectedPlayer)) {
								// Define the winner player
								Player winner = new Player();

								// Get winner and loser
								for (Player player : GamesManager.INSTANCE.tournament_games
										.get(disconnectedPlayer.getRoom()).getPlayers()) {
									if (player.getUserName() != disconnectedPlayer.getUserName()) {
										winner = player;
									}
								}
								// Stop the game
								GamesManager.INSTANCE.finishTournamentGame(room, winner, disconnectedPlayer, true);
							}
						}
					}
					break;
				case "ACTION":
					switch (node.get("type").asText()) {
						case "JUMP":
							user.getPlayer_selected().jump();
							break;

						case "FALL":
							user.getPlayer_selected().fall();
							break;

						case "BASIC_ATTACK":
							room = node.get("room").asInt();
							GamesManager.INSTANCE.tournamentGamesLock.lock();
							if (GamesManager.INSTANCE.tournament_games.containsKey(room))
							{
								GamesManager.INSTANCE.tournamentGamesLock.unlock();
								if (user.getPlayer_selected().getBasicWeapon().attack()) { // Si se realiza el ataque
									msg.put("event", "ACTION");
									msg.put("type", "BASIC_ATTACK");
									msg.put("player_name", user.getUser_name());
									if (room != -1){
										GamesManager.INSTANCE.tournament_games.get(room).broadcast(msg.toString());
									}
									// if (room == -1) {
									// 	synchronized (user.getSession()) {
									// 		user.getSession().sendMessage(new TextMessage(msg.toString()));
									// 	}
									// } else {
									// 	GamesManager.INSTANCE.tournament_games.get(room).broadcast(msg.toString());
									// }
									
								}
							}
							else
							{
								GamesManager.INSTANCE.tournamentGamesLock.unlock();
								// Comprobamos el Space Gym
								GamesManager.INSTANCE.spaceGymGamesLock.lock();
								if (GamesManager.INSTANCE.spaceGym_games.containsKey(user.getPlayer_selected().getUserName()))
								{
									if (user.getPlayer_selected().getBasicWeapon().attack()) { // Si se realiza el ataque
										msg.put("event", "ACTION");
										msg.put("type", "BASIC_ATTACK");
										msg.put("player_name", user.getUser_name());
										synchronized (user.getSession()) {
											user.getSession().sendMessage(new TextMessage(msg.toString()));
										}
									} 
									GamesManager.INSTANCE.spaceGymGamesLock.unlock();
								}else{
									GamesManager.INSTANCE.spaceGymGamesLock.unlock();
								}
							}
							break;

						case "SPECIAL_ATTACK":
							room = node.get("room").asInt();
							if (user.getPlayer_selected().getSpecialWeapon().attack()) { // Si se realiza el ataque
								msg.put("event", "ACTION");
								msg.put("type", "SPECIAL_ATTACK");
								msg.put("player_name", user.getUser_name());
								if (room == -1) {
									synchronized (user.getSession()) {
										user.getSession().sendMessage(new TextMessage(msg.toString()));
									}
								} else {
									GamesManager.INSTANCE.tournament_games.get(room).broadcast(msg.toString());
								}
							}
							break;

						default:
							break;
					}
					break;

				// En cualquier otro caso
				default:
					break;
			}
		} catch (Exception e) {
			// Si se produce un error, se imprime
			System.err.println("Exception processing message " + message.getPayload());
			e.printStackTrace(System.err);

			// Intenta escribir la información del error en el archivo de log
			try {
				AKO_Server.logLock.lock();
				AKO_Server.logWriter = new BufferedWriter(new FileWriter(AKO_Server.logFile, true));
				String time = new SimpleDateFormat("HH:mm:ss").format(Calendar.getInstance().getTime());
				AKO_Server.logWriter.write(time + " - SERVER ERROR ON HANDLE TEXT MESSAGE: " + e.getStackTrace() + ".\n");
				AKO_Server.logWriter.close();
				AKO_Server.logLock.unlock();
			} catch (Exception e2) {
				// Si falla, se muestra el error
				e2.printStackTrace();
			}
		}
	}

	// Método afterConnectionClosed, que se ejecuta tras el cierre de una conexión
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
		GamesManager.INSTANCE.tournamentGamesLock.lock();

		// Obtiene el usuario de los atributos de sesión
		User user = (User) session.getAttributes().get(USER_ATTRIBUTE);

		// Obtiene los datos del jugador
		Player disconnectedPlayer = user.getPlayer_selected();
		int room = disconnectedPlayer.getRoom();

		// Check if user was on queue
		for (ConcurrentLinkedQueue<Player> queue : GamesManager.INSTANCE.searching_players.values()) {
			if (queue.contains(disconnectedPlayer))
			{
				queue.remove(disconnectedPlayer);
				break;
			}
		}
		GamesManager.INSTANCE.tournamentGamesLock.unlock();

		// Check if user was ingame
		if (GamesManager.INSTANCE.tournament_games.containsKey(disconnectedPlayer.getRoom())) {
			if (GamesManager.INSTANCE.tournament_games.get(disconnectedPlayer.getRoom()).getPlayers()
					.contains(disconnectedPlayer)) {
				// Define the winner player
				Player winner = new Player();

				// Get winner and loser
				for (Player player : GamesManager.INSTANCE.tournament_games.get(disconnectedPlayer.getRoom())
						.getPlayers()) {
					if (player.getUserName() != disconnectedPlayer.getUserName()) {
						winner = player;
					}
				}

				// Stop the game
				GamesManager.INSTANCE.finishTournamentGame(room, winner, disconnectedPlayer, true);
			}
		}


		// Intenta escribir la información en el archivo de log
		try {
			AKO_Server.logLock.lock();
			AKO_Server.logWriter = new BufferedWriter(new FileWriter(AKO_Server.logFile, true));
			String time = new SimpleDateFormat("HH:mm:ss").format(Calendar.getInstance().getTime());
			if (user.getUser_name() != "") {
				AKO_Server.logWriter.write(time + " - Player disconnected: " + user.getUser_name() + ".\n");
			} else {
				AKO_Server.logWriter
						.write(time + " - Disconnected user with session " + user.getSession().getId() + ".\n");
			}
			AKO_Server.logWriter.close();
			AKO_Server.logLock.unlock();
		} catch (Exception e) {
			// Si falla, se muestra el error
			e.printStackTrace();
		}

		// Desconecta al usuario
		UsersController.DisconnectUser(user.getUser_name());

		if (DEBUG_MODE) {
			if (user.getUser_name() != "") {
				System.out.println("Usuario desconectado: " + user.getUser_name());
			} else {
				System.out.println("Disconnected user with session " + user.getSession().getId());
			}
		}
	}
}
