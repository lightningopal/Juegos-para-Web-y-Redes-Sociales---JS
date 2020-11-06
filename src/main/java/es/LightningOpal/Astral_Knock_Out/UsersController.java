package es.LightningOpal.Astral_Knock_Out;

/// Imports
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

// Clase UsersController, que se encarga de los usuarios
public class UsersController {
	/// Variables
	//// Writters
	// Writter para añadir usarios
	private static BufferedWriter userWritter = null;

	// Writter para añadir la información del login
	private static BufferedWriter loginWritter = null;

	//// Mapas
	// Mapa para guardar la información del login en la memoria del server
	public static Map<String, Integer> loginInfo = new ConcurrentHashMap<>();

	// Mapa para guardar la información de TODOS los usuarios en la memoria del
	// server
	public static Map<String, User> allUsers = new ConcurrentHashMap<>();

	// Mapa para guardar la información de los usuarios conectados en la memoria del
	// server
	private static Map<String, Integer> connectedUsers = new ConcurrentHashMap<>();

	/// Métodos
	// Método ConnectUser, que conecta un usuario al servidor
	public static User ConnectUser(String userName) {
		// Se obtiene el usuario del mapa de usuarios
		User thisUser = allUsers.get(userName);

		// Se añade el usuario al mapa de conectados
		connectedUsers.put(userName, thisUser.getUserId());

		// Intenta escribir en el archivo de log
		try {
			AKO_Server.logWriter = new BufferedWriter(new FileWriter(AKO_Server.logFile, true));
			String time = new SimpleDateFormat("HH:mm:ss").format(Calendar.getInstance().getTime());
			AKO_Server.logWriter.write(time + " - Player connected: " + userName + ".\n");
			AKO_Server.logWriter.close();
		} catch (Exception e) {
			// Si falla, muestra el error
			e.printStackTrace();
		}

		// Lo añade al mapa de usuarios conectados
		connectedUsers.put(userName, thisUser.getUserId());

		// Devuelve el usuario
		return thisUser;
	}

	// Método ConnectNewUser, que conecta un nuevo usuario al servidor
	public static void ConnectNewUser(User thisUser) {
		// Obtiene el nombre del usuario
		String userName = thisUser.getUser_name();

		// Se añade el usuario al mapa de usuarios
		allUsers.put(userName, thisUser);

		// Intenta escribir la información del nuevo usuario en el archivo de datos 'usersData.txt'
		try {
			String characters_available = "[0,1,2,3]";
			String skins_available = "[{0},{0},{0},{0}}]";

			userWritter = new BufferedWriter(new FileWriter(new File("src/main/resources/data/usersData.txt"), true));

			userWritter.write(thisUser.getUserId() + ":" + thisUser.getUser_name() + ":" + characters_available + ":"
					+ skins_available + ":" + thisUser.getElo() + ":" + thisUser.getWins() + ":" + thisUser.getLoses()
					+ ":" + thisUser.getCurrency() + "\n");

			userWritter.close();
		} catch (Exception e) {
			// Si falla, muestra el error
			e.printStackTrace();
		}

		// Lo añade al mapa de usuarios conectados
		connectedUsers.put(userName, allUsers.get(userName).getUserId());
	}

	// Método DisconnectUser, que desconecta a un jugador del servidor
	public static void DisconnectUser(String userName) {
		// Si está conectado, lo desconecta
		if (connectedUsers.containsKey(userName))
			connectedUsers.remove(userName);
	}

	// Método CheckUserConected, que comprueba si un usuario está conectado al
	// servidor
	public static boolean CheckUserConnected(String userName) {
		return connectedUsers.containsKey(userName);
	}

	// Método RegisterNewUser, que registra a un nuevo usuario
	public static User RegisterNewUser(String name, String password) {
		// Encripta la contraseña y añade la información de inicio de sesión al mapa de
		// login
		int hashedPassword = password.hashCode();
		loginInfo.put(name, hashedPassword);

		// Intenta escribir en el archivo de login
		try {
			loginWritter = new BufferedWriter(new FileWriter(new File("src/main/resources/data/usersLogin.txt"), true));
			loginWritter.write(name + ":" + hashedPassword + "\n");
			loginWritter.close();
		} catch (Exception e) {
			// Si falla, muestra el error
			e.printStackTrace();
		}

		// Intenta escribir en el archivo de log
		try {
			AKO_Server.logWriter = new BufferedWriter(new FileWriter(AKO_Server.logFile, true));
			String time = new SimpleDateFormat("HH:mm:ss").format(Calendar.getInstance().getTime());
			AKO_Server.logWriter.write(time + " - Player registered: " + name + ".\n");
			AKO_Server.logWriter.close();
		} catch (Exception e) {
			// Si falla, muestra el error
			e.printStackTrace();
		}

		// Crea el nuevo usuario y asigna su id y nombre
		User newUser = new User();
		newUser.setUserId(allUsers.size());
		newUser.setUser_name(name);

		// Devuelve el usuario
		return newUser;
	}
}
