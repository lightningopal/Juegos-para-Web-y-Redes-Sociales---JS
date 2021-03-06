class Scene_Select_Map extends Phaser.Scene {

    constructor() {
        super({ key: "scene_select_map" });
    } // Fin constructor

    preload() {
        //Creación de imágenes
        this.background = this.add.image(0, 0, "main_menu_bg").setOrigin(0, 0);
        this.nebula = this.add.image(game.config.width / 2, game.config.height / 2, "main_menu_nebula");
        this.stars = this.add.image(game.config.width / 2, game.config.height / 2, "main_menu_stars");

        this.add.image(114.50, 112.0, "back_button_interface")
            .setDepth(5);
        this.backBtn = this.add.image(66.0, 78.5, "back_button")
            .setDepth(5);

        this.add.image(957.50, 153.16, "select_map_text");
        this.mapButton0 = this.add.image(467.5, 530.5, "map_button0");
        this.mapButton0.setFrame(1);
        this.mapButton1 = this.add.image(1415, 523, "map_button1");
        this.mapButton1.setFrame(0);

        this.enterText;

        // Opciones de selección
        game.mPlayer.difficultySel = -1;
        this.return = false;
        this.optionSelected = 0; // 0 -> Mapa 0 / 1 -> Mapa 1

        this.changeOptionSound = this.sound.add("change_button");
        this.pressOptionSound = this.sound.add("press_button");
        this.errorOptionSound = this.sound.add("error_button");

        // Waiting for queue
        this.waitingForQueue = false;

    } // Fin preload

    create() {
        // Set the scene
        var that = this;
        game.global.actualScene = "scene_select_map";

        // Idle timer
        that.time.addEvent({
            delay: 2000,
            callback: that.scene.get("scene_boot").IdleMessage,
            loop: true
        });

        this.input.on('pointerup', function () {
            that.return = false;
            that.backBtn.setFrame(0);
        });
        // Botón atrás
        this.backBtn.setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
            // that.backBtn.setFrame(1);
            that.return = true;
            that.CheckOption();
            if (game.global.DEBUG_MODE) {
                console.log("Back pulsado");
            }
        });
        this.backBtn.setInteractive().on('pointerup', function (pointer, localX, localY, event) {
            that.input.keyboard.removeAllKeys(true);
            that.pressOptionSound.play({ volume: game.options.SFXVol });
            that.backBtn.setFrame(0);
            that.scene.start("scene_select_character");
            if (game.global.DEBUG_MODE) {
                console.log("Back soltado");
            }
        });
        // Primer mapa
        this.mapButton0.setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
            if (that.waitingForQueue == false)
            {
                that.pressOptionSound.play({ volume: game.options.SFXVol });
                that.mapButton0.setFrame(1);
                that.mapButton1.setFrame(0);
                that.optionSelected = 0;
                game.mPlayer.difficultySel = 0;
            }
            if (game.global.DEBUG_MODE) {
                console.log("Mapa 1 pulsado");
            }
        });
        this.mapButton0.setInteractive().on('pointerup', function (pointer, localX, localY, event) {
            if (that.waitingForQueue == false)
            {
                that.input.keyboard.removeAllKeys(true);
                that.waitingForQueue = true;
                that.scene.start("scene_searching");
            }
            if (game.global.DEBUG_MODE) {
                console.log("Mapa 1 elegido");
            }
        });
        // Segundo mapa
        this.mapButton1.setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
            if (that.waitingForQueue == false)
            {
                that.pressOptionSound.play({ volume: game.options.SFXVol });
                that.mapButton0.setFrame(0);
                that.mapButton1.setFrame(1);
                that.optionSelected = 1;
                game.mPlayer.difficultySel = 1;
            }

            if (game.global.DEBUG_MODE) {
                console.log("Mapa 2 pulsado");
            }
        });
        this.mapButton1.setInteractive().on('pointerup', function (pointer, localX, localY, event) {
            if (that.waitingForQueue == false)
            {
                that.input.keyboard.removeAllKeys(true);
                that.waitingForQueue = true;
                that.scene.start("scene_searching");
            }
            if (game.global.DEBUG_MODE) {
                console.log("Mapa 2 soltado");
            }
        });

        // Mobile
        if (game.global.DEVICE === "mobile" || game.global.DEBUG_PHONE) {
            that.mapButton0.setFrame(0);
            
        // Desktop
        } else {
            this.add.image(62, 28.86, "escape_text")
                .setDepth(5);
            this.enterText = this.add.image(1350.0, 1000.0, "continue_text_desktop")
                .setDepth(1);
            this.backBtn.setFrame(0);
            game.mPlayer.difficultySel = 0;

            // Opciones de selección
            this.input.keyboard.on('keydown-' + 'A', function (event) {
                if (!that.return) {
                    that.changeOptionSound.play({ volume: game.options.SFXVol });
                    that.optionSelected = (that.optionSelected + 1) % 2;
                    that.CheckOption();
                    if (game.global.DEBUG_MODE) {
                        console.log(that.optionSelected);
                    }
                }
            });
            this.input.keyboard.on('keydown-' + 'LEFT', function (event) {
                if (!that.return) {
                    that.changeOptionSound.play({ volume: game.options.SFXVol });
                    that.optionSelected = (that.optionSelected + 1) % 2;
                    that.CheckOption();
                    if (game.global.DEBUG_MODE) {
                        console.log(that.optionSelected);
                    }
                }
            });

            this.input.keyboard.on('keydown-' + 'D', function (event) {
                if (!that.return) {
                    that.changeOptionSound.play({ volume: game.options.SFXVol });
                    that.optionSelected = (that.optionSelected + 1) % 2;
                    that.CheckOption();
                    if (game.global.DEBUG_MODE) {
                        console.log(that.optionSelected);
                    }
                }
            });
            this.input.keyboard.on('keydown-' + 'RIGHT', function (event) {
                if (!that.return) {
                    that.changeOptionSound.play({ volume: game.options.SFXVol });
                    that.optionSelected = (that.optionSelected + 1) % 2;
                    that.CheckOption();
                    if (game.global.DEBUG_MODE) {
                        console.log(that.optionSelected);
                    }
                }
            });

            this.input.keyboard.on('keydown-'+'W', function(event){
                that.changeOptionSound.play({ volume: game.options.SFXVol });
                that.return = !that.return;
                that.CheckOption();
            });
            this.input.keyboard.on('keydown-'+'UP', function(event){
                that.changeOptionSound.play({ volume: game.options.SFXVol });
                that.return = !that.return;
                that.CheckOption();
            });

            this.input.keyboard.on('keydown-'+'S', function(event){
                that.changeOptionSound.play({ volume: game.options.SFXVol });
                that.return = false;
                that.CheckOption();
            });
            this.input.keyboard.on('keydown-'+'DOWN', function(event){
                that.changeOptionSound.play({ volume: game.options.SFXVol });
                that.return = false;
                that.CheckOption();
            });

            this.input.keyboard.on('keydown-' + 'ESC', function (event) {
                that.pressOptionSound.play({ volume: game.options.SFXVol });
                    that.input.keyboard.removeAllKeys(true);
                    that.scene.start("scene_select_character");
            });

            this.input.keyboard.on('keydown-' + 'ENTER', function (event) {
                that.pressOptionSound.play({ volume: game.options.SFXVol });
                if (!that.return){
                        if (that.waitingForQueue == false)
                        {
                            that.input.keyboard.removeAllKeys(true);
                            that.waitingForQueue = true;
                            game.mPlayer.difficultySel = that.optionSelected;
                            that.scene.start("scene_searching");
                        }
                }else{
                    that.input.keyboard.removeAllKeys(true);
                    that.scene.start("scene_select_character");
                }
            });
            this.input.keyboard.on('keydown-' + 'O', function (event) {
                that.pressOptionSound.play({ volume: game.options.SFXVol });
                if (!that.return){
                    if (that.waitingForQueue == false)
                    {
                        that.input.keyboard.removeAllKeys(true);
                        that.waitingForQueue = true;
                        game.mPlayer.difficultySel = that.optionSelected;
                        that.scene.start("scene_searching");
                    }
                }else{
                    that.input.keyboard.removeAllKeys(true);
                    that.scene.start("scene_select_character");
                }
            });
        }

        var tween = this.tweens.add({
            targets: that.nebula,
            angle: 360,
            duration: 250000,
            repeat: -1
        });
        var tween = this.tweens.add({
            targets: that.stars,
            angle: 360,
            duration: 500000,
            repeat: -1
        });
    } // Fin create

    update() {

    } // Fin update

    CheckOption() {
        if (this.return){
            this.backBtn.setFrame(1);
        }else{
            this.backBtn.setFrame(0);
            if (this.optionSelected == 0) {
                this.mapButton0.setFrame(1);
                this.mapButton1.setFrame(0);
            } else {
                this.mapButton0.setFrame(0);
                this.mapButton1.setFrame(1);
            }
        }
    }

}// Fin Scene_Ranking