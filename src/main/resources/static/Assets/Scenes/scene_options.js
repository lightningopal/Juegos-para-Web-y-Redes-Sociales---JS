class Scene_Options extends Phaser.Scene {
    constructor() {
        super({ key: "scene_options" });
    } // Fin constructor

    preload() {
        var that = this;
        //Creación de imágenes
        this.background = this.add.image(0, 0, "main_menu_bg").setOrigin(0, 0)
            .setScale(RelativeScale(1, "x"), RelativeScale(1, "y"));
        this.nebula = this.add.image(game.config.width / 2, game.config.height / 2, "main_menu_nebula")
            .setScale(RelativeScale(1, "x"), RelativeScale(1, "y"));
        this.stars = this.add.image(game.config.width / 2, game.config.height / 2, "main_menu_stars")
            .setScale(RelativeScale(1, "x"), RelativeScale(1, "y"));
        this.add.image(0, 0, "options_interface").setOrigin(0, 0)
            .setScale(RelativeScale(1, "x"), RelativeScale(1, "y"));

        this.sfxBtn = this.add.image(RelativeScale((game.options.SFXVol * 671) + 962, "x"), RelativeScale(459.5, "y"), "volume_button")
            .setScale(RelativeScale(1, "x"), RelativeScale(1, "y"));
        this.musicBtn = this.add.image(RelativeScale((game.options.musicVol * 671) + 962, "x"), RelativeScale(338.5, "y"), "volume_button")
            .setScale(RelativeScale(1, "x"), RelativeScale(1, "y"));
        this.backBtn = this.add.image(RelativeScale(66.0, "x"), RelativeScale(63.5, "y"), "back_button")
            .setScale(RelativeScale(1, "x"), RelativeScale(1, "y"));
        this.musicBtn.setFrame(1);
        // Teclas
        this.cursors;
        // Opciones de selección
        this.optionSelected;
    }// Fin preload

    create() {
        var that = this;
        var tween = this.tweens.add({
            targets: that.nebula,
            angle: 360,
            duration: 500000,
            repeat: -1
        });
        var tween = this.tweens.add({
            targets: that.stars,
            angle: 360,
            duration: 500000,
            repeat: -1
        });

        this.optionSelected = 1;
        if (game.global.DEVICE === "mobile" || game.global.DEBUG_PHONE){

            this.input.on('pointerup', function () {
                that.optionSelected = -1;
                that.backBtn.setFrame(0);
                that.musicBtn.setFrame(0);
                that.sfxBtn.setFrame(0);
            });

            this.backBtn.setInteractive().on('pointerdown', function(pointer,localX,localY,event){
                that.optionSelected = 0;
                that.backBtn.setFrame(1);
                that.musicBtn.setFrame(0);
                that.sfxBtn.setFrame(0);
                if (game.global.DEBUG_MODE){ 
                    console.log("Back pulsado");
                }
            });
            this.backBtn.setInteractive().on('pointerup', function(pointer,localX,localY,event){
                if (that.optionSelected == 0){
                    that.backBtn.setFrame(0);
                that.scene.start("scene_main_menu");
                }
                if (game.global.DEBUG_MODE){ 
                    console.log("Back soltado");
                }
            });

            this.musicBtn.setInteractive({draggable: true}).on('pointerdown', function(pointer,localX,localY,event){
                that.optionSelected = 1;
                that.backBtn.setFrame(0);
                that.musicBtn.setFrame(1);
                that.sfxBtn.setFrame(0);
                if (game.global.DEBUG_MODE){ 
                    console.log("Music pulsado");
                }
            });
            this.musicBtn.setInteractive({draggable: true}).on('drag', function(pointer,dragX,dragY){
                if (dragX <= RelativeScale(1633,"x") && dragX >= RelativeScale(962,"x")){
                    that.musicBtn.x = dragX;
                    game.global.musicVol = (Unscale(dragX,"x")-962) / 671;
                }
                if (game.global.DEBUG_MODE){ 
                    console.log("Music: "+game.global.musicVol);
                }
            });
            this.musicBtn.setInteractive({draggable: true}).on('pointerup', function(pointer,localX,localY,event){
                that.musicBtn.setFrame(0);
                if (game.global.DEBUG_MODE){ 
                    console.log("Music soltado");
                }
            });

            this.sfxBtn.setInteractive({draggable: true}).on('pointerdown', function(pointer,localX,localY,event){
                that.optionSelected = 2;
                that.backBtn.setFrame(0);
                that.musicBtn.setFrame(0);
                that.sfxBtn.setFrame(1);
                if (game.global.DEBUG_MODE){ 
                    console.log("SFX pulsado");
                }
            });
            this.sfxBtn.setInteractive({draggable: true}).on('drag', function(pointer,dragX,dragY){
                if (dragX <= RelativeScale(1633,"x") && dragX >= RelativeScale(962,"x")){
                    that.sfxBtn.x = dragX;
                    game.global.SFXVol = (Unscale(dragX,"x")-962) / 671;
                }
                if (game.global.DEBUG_MODE){ 
                    console.log("SFX: "+game.global.SFXVol);
                }
            });
            this.sfxBtn.setInteractive({draggable: true}).on('pointerup', function(pointer,localX,localY,event){
                that.sfxBtn.setFrame(0);
                if (game.global.DEBUG_MODE){ 
                    console.log("SFX soltado");
                }
            });
        }else if (game.global.DEVICE === "desktop") { // Odenador
            // Teclas de selección
            this.cursors = this.input.keyboard.addKeys({
                'up': game.cursors1Keys.jump,
                'down': game.cursors1Keys.fall,
                'left': game.cursors1Keys.left,
                'right': game.cursors1Keys.right,
                'enter': Phaser.Input.Keyboard.KeyCodes.ENTER,
                'escape': Phaser.Input.Keyboard.KeyCodes.ESC
            });

            this.cursors.escape.on('down', function (event) {
                that.input.keyboard.removeAllKeys(true);
                that.scene.start("scene_main_menu");
            });
            this.cursors.enter.on('down', function (event) {
                if (that.optionSelected == 0) {
                    that.input.keyboard.removeAllKeys(true);
                    that.scene.start("scene_main_menu");
                }
            });

            this.cursors.up.on('down', function (event) {
                if (that.optionSelected == 0) {
                    that.optionSelected = 2;
                } else {
                    that.optionSelected = (that.optionSelected - 1) % 3;
                }
                if (game.global.DEBUG_MODE) {
                    console.log(that.optionSelected);
                }
                that.CheckOption();
            });
            this.cursors.down.on('down', function (event) {
                that.optionSelected = (that.optionSelected + 1) % 3;
                if (game.global.DEBUG_MODE) {
                    console.log(that.optionSelected);
                }
                that.CheckOption();
            });

            this.cursors.right.on('down', function (event) {
                if (that.optionSelected == 1) { // Música
                    game.options.musicVol = Phaser.Math.Clamp(game.options.musicVol + 0.1, 0, 1);
                    game.global.socket.send(JSON.stringify({ event: "UPDATE_VOL", volType: "musicVol", value: game.options.musicVol }));
                    that.musicBtn.x = RelativeScale((game.options.musicVol * 671) + 962, "x");
                    if (game.global.DEBUG_MODE) {
                        console.log(game.options.musicVol);
                    }
                } else if (that.optionSelected == 2) { // SFX
                    game.options.SFXVol = Phaser.Math.Clamp(game.options.SFXVol + 0.1, 0, 1);
                    game.global.socket.send(JSON.stringify({ event: "UPDATE_VOL", volType: "sfxVol", value: game.options.SFXVol }));
                    that.sfxBtn.x = RelativeScale((game.options.SFXVol * 671) + 962, "x");
                    if (game.global.DEBUG_MODE) {
                        console.log(game.options.SFXVol);
                    }
                }
            });
            this.cursors.left.on('down', function (event) {
                if (that.optionSelected == 1) { // Música
                    game.options.musicVol = Phaser.Math.Clamp(game.options.musicVol - 0.1, 0, 1);
                    game.global.socket.send(JSON.stringify({ event: "UPDATE_VOL", volType: "musicVol", value: game.options.musicVol }));
                    that.musicBtn.x = RelativeScale((game.options.musicVol * 671) + 962, "x");
                    if (game.global.DEBUG_MODE) {
                        console.log(game.options.musicVol);
                    }
                } else if (that.optionSelected == 2) { // SFX
                    game.options.SFXVol = Phaser.Math.Clamp(game.options.SFXVol - 0.1, 0, 1);
                    game.global.socket.send(JSON.stringify({ event: "UPDATE_VOL", volType: "sfxVol", value: game.options.SFXVol }));
                    that.sfxBtn.x = RelativeScale((game.options.SFXVol * 671) + 962, "x");
                    if (game.global.DEBUG_MODE) {
                        console.log(game.options.SFXVol);
                    }
                }
            });
        }// Fin if desktop

        // Datos del usuario
        var userNameText = this.add.text(RelativeScale(160, "x"), RelativeScale(900, "y"), game.mPlayer.userName)
        .setOrigin(0, 0.5).setFontSize(28); // Alineado a la izquierda
        var userCurrencyText = this.add.text(RelativeScale(836, "x"), RelativeScale(900, "y"), game.mPlayer.currency)
        .setOrigin(1, 0.5).setFontSize(28); // Alineado a la derecha
    }// Fin create

    update() {

    }// Fin update

    CheckOption() {
        if (this.optionSelected == 0) {// Back
            this.backBtn.setFrame(1);
            this.musicBtn.setFrame(0);
            this.sfxBtn.setFrame(0);
        } else if (this.optionSelected == 1) { // Música
            this.backBtn.setFrame(0);
            this.musicBtn.setFrame(1);
            this.sfxBtn.setFrame(0);
        } else if (this.optionSelected == 2) { // SFX
            this.backBtn.setFrame(0);
            this.musicBtn.setFrame(0);
            this.sfxBtn.setFrame(1);
        }
    }
}

// 1633
// 962