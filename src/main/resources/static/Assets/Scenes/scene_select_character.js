class Scene_Select_Character extends Phaser.Scene {

    constructor() {
        super({ key: "scene_select_character" });
    }// Fin constructor

    preload() {
        // Creación de imágenes
        this.background = this.add.image(0, 0, "main_menu_bg").setOrigin(0, 0)
            .setScale(RelativeScale(1, "x"), RelativeScale(1, "y"));
        this.nebula = this.add.image(game.config.width / 2, game.config.height / 2, "main_menu_nebula")
            .setScale(RelativeScale(1, "x"), RelativeScale(1, "y"));
        this.stars = this.add.image(game.config.width / 2, game.config.height / 2, "main_menu_stars")
            .setScale(RelativeScale(1, "x"), RelativeScale(1, "y"));
        this.add.image(0, 0, "select_character_interface").setOrigin(0, 0)
            .setScale(RelativeScale(1, "x"), RelativeScale(1, "y")).setDepth(1);
        this.texts = this.add.image(RelativeScale(1459.02, "x"), RelativeScale(410.0, "x"), "description_text")
            .setScale(RelativeScale(1, "x"), RelativeScale(1, "y")).setDepth(1);
        this.skinsSkills = this.add.image(RelativeScale(1476.17, "x"), RelativeScale(777.88, "x"), "skins_skills")
            .setScale(RelativeScale(1, "x"), RelativeScale(1, "y")).setDepth(1);
        this.leftArrowBtn = this.add.image(RelativeScale(1238.75, "x"), RelativeScale(744.07, "x"), "left_arrow_button")
            .setScale(RelativeScale(1, "x"), RelativeScale(1, "y")).setDepth(1);
        this.rightArrowBtn = this.add.image(RelativeScale(1580.07, "x"), RelativeScale(867.88, "x"), "right_arrow_button")
            .setScale(RelativeScale(1, "x"), RelativeScale(1, "y")).setDepth(1);
        this.enterBtn = this.add.image(RelativeScale(1810.0, "x"), RelativeScale(1000.0, "x"), "enter_button")
            .setScale(RelativeScale(1, "x"), RelativeScale(1, "y")).setDepth(2);
        this.enterText;

        // Personajes
        this.availableChars = [[{ char: "berserker", purchased: false, available: true }, { char: "wizard", purchased: false, available: true },
        { char: "bard", purchased: false, available: true }],
        [{ char: "rogue", purchased: false, available: true }, { char: "character", purchased: false, available: false }]];

        for (var i = 0; i < game.mPlayer.availableChar.length; i++) {
            if (game.mPlayer.availableChar[i] == 0) { // Si tiene disponible el berserker
                this.berserkerBtn = this.add.image(RelativeScale(60.50, "x"), RelativeScale(420.0, "y"), "berserker_button")
                    .setScale(RelativeScale(1, "x"), RelativeScale(1, "y"));
                this.availableChars[0][0].purchased = true;
                this.berserkerBtn.setAlpha(0.7);
                break;
            } else if (i == game.mPlayer.availableChar.length - 1) { // Si no
                this.berserkerBtn = this.add.image(RelativeScale(67.50, "x"), RelativeScale(420.0, "y"), "purchase_button")
                    .setScale(RelativeScale(1, "x"), RelativeScale(1, "y"));
                this.berserkerBtn.setAlpha(0.7);
            }
        }

        for (var i = 0; i < game.mPlayer.availableChar.length; i++) {
            if (game.mPlayer.availableChar[i] == 1) { // Si tiene disponible el mago
                this.wizardBtn = this.add.image(RelativeScale(441.0, "x"), RelativeScale(557.0, "y"), "wizard_button")
                    .setScale(RelativeScale(1, "x"), RelativeScale(1, "y"));
                this.availableChars[0][1].purchased = true;
                this.wizardBtn.setAlpha(0.7);
                break;
            } else if (i == game.mPlayer.availableChar.length - 1) { // Si no
                this.wizardBtn = this.add.image(RelativeScale(441.0, "x"), RelativeScale(557.0, "y"), "purchase_button")
                    .setScale(RelativeScale(1, "x"), RelativeScale(1, "y"));
                this.wizardBtn.setAlpha(0.7);
            }
        }

        for (var i = 0; i < game.mPlayer.availableChar.length; i++) {
            if (game.mPlayer.availableChar[i] == 2) { // Si tiene disponible el bardo
                this.bardBtn = this.add.image(RelativeScale(825.50, "x"), RelativeScale(694.0, "y"), "bard_button")
                    .setScale(RelativeScale(1, "x"), RelativeScale(1, "y"));
                this.availableChars[0][2].purchased = true;
                this.bardBtn.setAlpha(0.7);
                break;
            } else if (i == game.mPlayer.availableChar.length - 1) { // Si no
                this.bardBtn = this.add.image(RelativeScale(825.50, "x"), RelativeScale(694.0, "y"), "purchase_button")
                    .setScale(RelativeScale(1, "x"), RelativeScale(1, "y"));
                this.bardBtn.setAlpha(0.7);
            }
        }

        for (var i = 0; i < game.mPlayer.availableChar.length; i++) {
            if (game.mPlayer.availableChar[i] == 3) { // Si tiene disponible el bardo
                this.rogueBtn = this.add.image(RelativeScale(59.0, "x"), RelativeScale(694.0, "y"), "rogue_button")
                    .setScale(RelativeScale(1, "x"), RelativeScale(1, "y"));
                this.availableChars[1][0].purchased = true;
                this.rogueBtn.setAlpha(0.7);
                break;
            } else if (i == game.mPlayer.availableChar.length - 1) { // Si no
                this.rogueBtn = this.add.image(RelativeScale(59.0, "x"), RelativeScale(694.0, "y"), "purchase_button")
                    .setScale(RelativeScale(1, "x"), RelativeScale(1, "y"));
                this.rogueBtn.setAlpha(0.7);
            }
        }

        // Personaje bloqueado
        this.blockedBtn = this.add.image(RelativeScale(445.0, "x"), RelativeScale(898.50, "y"), "blocked_button")
            .setScale(RelativeScale(1, "x"), RelativeScale(1, "y"));
        this.blockedBtn.setAlpha(0.7);

        // Skins


        this.backBtn = this.add.image(RelativeScale(66.0, "x"), RelativeScale(63.5, "y"), "back_button")
            .setScale(RelativeScale(1, "x"), RelativeScale(1, "y")).setDepth(1);

        // Teclas
        this.cursors;
        // Selectores
        this.characterSelectedRow;
        this.characterSelectedCol;
        this.skinSelectedRow;
        this.skinSelectedCol;
        this.confirmSkin;

        this.selectingCharacter;
        this.selectingSkin;
        this.confirmingSkin;
        this.selectingSkill;
        this.selectingMap;
    }// Fin preload

    create() {
        var that = this;
        // Movimiento del fondo
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

        // Selectores
        this.selectingCharacter = true;
        this.selectingSkin = false;
        this.confirmingSkin = false;
        this.selectingSkill = false;
        this.selectingMap = false;

        this.characterSelectedRow = 0;
        this.characterSelectedCol = 0;
        this.skinSelectedRow = 0;
        this.skinSelectedCol = 0;
        this.confirmSkin = true;

        if (game.global.DEVICE === "mobile" || game.global.DEBUG_PHONE) {
            this.enterText = this.add.image(RelativeScale(1650.0, "x"), RelativeScale(910.0, "x"), "continue_text_mobile")
                .setScale(RelativeScale(1, "x"), RelativeScale(1, "y")).setDepth(1);
            this.texts.setAlpha(0);
            this.skinsSkills.setFrame(4);
            this.leftArrowBtn.setFrame(1);
            this.rightArrowBtn.setFrame(1);
            this.input.on('pointerup', function () {
                that.backBtn.setFrame(0);
            });

            // Botón de volver
            this.backBtn.setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
                that.backBtn.setFrame(1);
                if (game.global.DEBUG_MODE) {
                    console.log("Back pulsado");
                }
            });
            this.backBtn.setInteractive().on('pointerup', function (pointer, localX, localY, event) {
                that.backBtn.setFrame(0);
                that.scene.start("scene_main_menu");
                if (game.global.DEBUG_MODE) {
                    console.log("Back soltado");
                }
            });

            this.berserkerBtn.setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
                that.characterSelectedRow = 0;
                that.characterSelectedCol = 0;
                that.CheckCharacter();
                that.SelectCharacter();
                if (game.global.DEBUG_MODE) {
                    console.log("Berserker pulsado");
                }
            });
            this.berserkerBtn.input.hitArea.setTo(185, 255.0, 375, 150);

            this.wizardBtn.setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
                that.characterSelectedRow = 0;
                that.characterSelectedCol = 1;
                that.CheckCharacter();
                that.SelectCharacter();
                if (game.global.DEBUG_MODE) {
                    console.log("Wizard pulsado");
                }
            });
            this.wizardBtn.input.hitArea.setTo(185, 255.0, 375, 150);

            this.bardBtn.setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
                that.characterSelectedRow = 0;
                that.characterSelectedCol = 2;
                that.CheckCharacter();
                that.SelectCharacter();
                if (game.global.DEBUG_MODE) {
                    console.log("Bard pulsado");
                }
            });
            this.bardBtn.input.hitArea.setTo(185, 255.0, 375, 150);

            this.rogueBtn.setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
                that.characterSelectedRow = 1;
                that.characterSelectedCol = 0;
                that.CheckCharacter();
                that.SelectCharacter();
                if (game.global.DEBUG_MODE) {
                    console.log("Rogue pulsado");
                }
            });
            this.rogueBtn.input.hitArea.setTo(185, 255.0, 375, 150);

            this.blockedBtn.setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
                that.characterSelectedRow = 1;
                that.characterSelectedCol = 1;
                game.mPlayer.characterSel.id = -1;
                game.mPlayer.characterSel.type = undefined;
                that.CheckCharacter();
                that.SelectCharacter();
                if (game.global.DEBUG_MODE) {
                    console.log("Blocked pulsado");
                }
            });
            this.blockedBtn.input.hitArea.setTo(178, 140, 375, 150);

            this.rightArrowBtn.setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
                if (game.mPlayer.characterSel.id != -1) {
                    that.skinSelectedCol = (that.skinSelectedCol + 1) % game.skins[game.mPlayer.characterSel.id];
                    that.CheckSkin();
                    if (game.global.DEBUG_MODE) {
                        console.log("columna: " + that.skinSelectedCol);
                    }
                    if (game.mPlayer.availableSkins[game.mPlayer.characterSel.id].includes(that.skinSelectedCol)) {
                        game.mPlayer.skinSel = that.skinSelectedCol;
                        that.selectingSkin = false;
                        that.confirmingSkin = true;
                        if (game.global.DEBUG_MODE) {
                            console.log("Skin seleccionada: " + game.mPlayer.skinSel);
                        }
                    } else {
                        // Hay que comprar la skin
                        if (game.global.DEBUG_MODE) {
                            console.log("Debes comprar la skin");
                        }
                    }
                }

            });
            this.leftArrowBtn.setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
                if (game.mPlayer.characterSel.id != -1) {
                    if (that.skinSelectedCol == 0) {
                        that.skinSelectedCol = game.skins[game.mPlayer.characterSel.id] - 1;
                    } else {
                        that.skinSelectedCol = (that.skinSelectedCol - 1) % game.skins[game.mPlayer.characterSel.id];
                    }
                    that.CheckSkin();
                    if (game.global.DEBUG_MODE) {
                        console.log("columna: " + that.skinSelectedCol);
                    }
                    if (game.mPlayer.availableSkins[game.mPlayer.characterSel.id].includes(that.skinSelectedCol)) {
                        game.mPlayer.skinSel = that.skinSelectedCol;
                        that.selectingSkin = false;
                        that.confirmingSkin = true;
                        if (game.global.DEBUG_MODE) {
                            console.log("Skin seleccionada: " + game.mPlayer.skinSel);
                        }
                    } else {
                        // Hay que comprar la skin
                        if (game.global.DEBUG_MODE) {
                            console.log("Debes comprar la skin");
                        }
                    }
                }
            });

            this.enterBtn.setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
                if (game.mPlayer.characterSel.id != -1){
                    if (game.mPlayer.isVersus){
                        // Selección de Skill/Mapa
                    }else{
                        // Selección de Skill -> SpaceGym
                    }
                }
            });

        } else if (game.global.DEVICE === "desktop") {
            this.enterText = this.add.image(RelativeScale(1350.0, "x"), RelativeScale(1000.0, "x"), "continue_text_desktop")
                .setScale(RelativeScale(1, "x"), RelativeScale(1, "y")).setDepth(1);
            this.enterText.setAlpha(0);
            this.rightArrowBtn.setAlpha(0);
            this.leftArrowBtn.setAlpha(0);
            this.enterBtn.setAlpha(0);
            this.berserkerBtn.setFrame(1);
            this.berserkerBtn.setAlpha(1);
            this.skinsSkills.setAlpha(0.7);
            // Opciones de selección
            this.cursors = this.input.keyboard.addKeys({
                'left': game.cursors1Keys.left,
                'right': game.cursors1Keys.right,
                'up': game.cursors1Keys.jump,
                'down': game.cursors1Keys.fall,
                'enter': Phaser.Input.Keyboard.KeyCodes.ENTER,
                'escape': Phaser.Input.Keyboard.KeyCodes.ESC,
            });

            this.cursors.escape.on("down", function (event) {
                if (that.selectingCharacter) { // Seleccionando personaje
                    that.input.keyboard.removeAllKeys(true);
                    that.scene.start("scene_main_menu");
                } else if (that.selectingSkin) { // Seleccionando skin
                    that.selectingSkin = false;
                    that.skinsSkills.setAlpha(0.7);
                    that.leftArrowBtn.setAlpha(0);
                    that.rightArrowBtn.setAlpha(0);
                    that.skinSelectedRow = 0;
                    that.skinSelectedCol = 0;
                    game.mPlayer.characterSel.type = undefined;
                    game.mPlayer.characterSel.id = -1;
                    that.selectingCharacter = true;
                } else if (that.confirmingSkin) {
                    game.mPlayer.selectedSkin = -1;
                    that.skinsSkills.setAlpha(1);
                    that.leftArrowBtn.setAlpha(1);
                    that.rightArrowBtn.setAlpha(1);
                    that.enterBtn.setAlpha(0);
                    that.enterText.setAlpha(0);
                    that.confirmingSkin = false;
                    that.confirmSkin = true;
                    that.selectingSkin = true;
                }
            });

            this.cursors.down.on("down", function (event) {
                if (that.selectingCharacter) { // Seleccionando personaje
                    that.characterSelectedRow = (that.characterSelectedRow + 1) % 2;
                    that.CheckCharacter();
                    if (game.global.DEBUG_MODE) {
                        console.log("fila: " + that.characterSelectedRow);
                    }
                } else if (that.selectingSkin) { // Seleccionando skin
                    if (that.skinSelectedRow == -1) {
                        that.skinSelectedRow = 0;
                        that.CheckSkin();
                        if (game.global.DEBUG_MODE) {
                            console.log("fila: " + that.skinSelectedRow);
                        }
                    }
                } else if (that.confirmingSkin) {
                    that.confirmSkin = !that.confirmSkin;
                    if (that.confirmSkin) {
                        that.backBtn.setFrame(0);
                    } else {
                        that.backBtn.setFrame(1);
                    }
                }
            });
            this.cursors.up.on("down", function (event) {
                if (that.selectingCharacter) { // Seleccionando personaje
                    if (that.characterSelectedRow == -1) {
                        that.characterSelectedRow = 1;
                    } else {
                        that.characterSelectedRow = (that.characterSelectedRow - 1) % 2
                    }
                    that.CheckCharacter();
                    if (game.global.DEBUG_MODE) {
                        console.log("fila: " + that.characterSelectedRow);
                    }
                } else if (that.selectingSkin) { // Seleccionando skin
                    if (that.skinSelectedRow == -1) {
                        that.skinSelectedRow = 0;
                    } else {
                        that.skinSelectedRow -= 1;
                    }
                    that.CheckSkin();
                    if (game.global.DEBUG_MODE) {
                        console.log("fila: " + that.skinSelectedRow);
                    }
                } else if (that.confirmingSkin) {
                    that.confirmSkin = !that.confirmSkin;
                    if (that.confirmSkin) {
                        that.backBtn.setFrame(0);
                    } else {
                        that.backBtn.setFrame(1);
                    }
                }
            });

            this.cursors.right.on("down", function (event) {
                if (that.selectingCharacter) { // Seleccionando personaje
                    if (that.characterSelectedRow != -1) {
                        that.characterSelectedCol = (that.characterSelectedCol + 1) % 3;
                        that.CheckCharacter();
                        if (game.global.DEBUG_MODE) {
                            console.log("columna: " + that.characterSelectedCol);
                        }
                    }
                } else if (that.selectingSkin) { // Seleccionando skin
                    if (that.skinSelectedRow == 0) {
                        that.skinSelectedCol = (that.skinSelectedCol + 1) % game.skins[game.mPlayer.characterSel.id];
                        that.CheckSkin();
                        if (game.global.DEBUG_MODE) {
                            console.log("columna: " + that.skinSelectedCol);
                        }
                    }
                }
            });
            this.cursors.left.on("down", function (event) {
                if (that.selectingCharacter) { // Seleccionando personaje
                    if (that.characterSelectedRow != -1) {
                        if (that.characterSelectedCol === 0) {
                            that.characterSelectedCol = 2;
                        } else {
                            that.characterSelectedCol = (that.characterSelectedCol - 1) % 3
                        }
                        that.CheckCharacter();
                        if (game.global.DEBUG_MODE) {
                            console.log("columna: " + that.characterSelectedCol);
                        }
                    }
                } else if (that.selectingSkin) { // Seleccionando skin
                    if (that.skinSelectedRow == 0) {
                        if (that.skinSelectedCol == 0) {
                            that.skinSelectedCol = game.skins[game.mPlayer.characterSel.id] - 1;
                        } else {
                            that.skinSelectedCol = (that.skinSelectedCol - 1) % game.skins[game.mPlayer.characterSel.id];
                        }
                        that.CheckSkin();
                        if (game.global.DEBUG_MODE) {
                            console.log("columna: " + that.skinSelectedCol);
                        }
                    }
                }
            });

            this.cursors.enter.on("down", function (event) {
                if (that.selectingCharacter) { // Seleccionando personaje
                    that.SelectCharacter();
                } else if (that.selectingSkin) { // Seleccionando skin
                    that.SelectSkin();
                } else if (that.confirmingSkin) {
                    if (that.confirmSkin) {

                    } else {
                        game.mPlayer.selectedSkin = -1;
                        that.skinsSkills.setAlpha(1);
                        that.leftArrowBtn.setAlpha(1);
                        that.rightArrowBtn.setAlpha(1);
                        that.enterBtn.setAlpha(0);
                        that.enterText.setAlpha(0);
                        that.confirmingSkin = false;
                        that.confirmSkin = true;
                        that.selectingSkin = true;
                    }
                }
            });
        }// Fin mobile/desktop

    }// Fin create

    upload() {

    }// Fin upload

    // Mostrar los sprites adecuados de los personajes
    CheckCharacter() {
        switch (this.characterSelectedRow) {
            case -1:
                this.skinsSkills.setFrame(4);
                this.texts.setAlpha(0);
                this.backBtn.setFrame(1);
                this.berserkerBtn.setFrame(0);
                this.wizardBtn.setFrame(0);
                this.bardBtn.setFrame(0);
                this.rogueBtn.setFrame(0);
                this.blockedBtn.setFrame(0);
                this.tweens.add({
                    targets: [this.berserkerBtn, this.wizardBtn, this.bardBtn, this.rogueBtn, this.blockedBtn],
                    alpha: 0.7,
                    duration: 250,
                });
                break;
            case 0:
                switch (this.characterSelectedCol) {
                    case 0:
                        // Berserker
                        this.skinsSkills.setFrame(0);
                        this.texts.setAlpha(1);
                        this.texts.setFrame(0);
                        this.backBtn.setFrame(0);
                        this.berserkerBtn.setFrame(1);
                        this.wizardBtn.setFrame(0);
                        this.bardBtn.setFrame(0);
                        this.rogueBtn.setFrame(0);
                        this.blockedBtn.setFrame(0);
                        this.tweens.add({
                            targets: [this.wizardBtn, this.bardBtn, this.rogueBtn, this.blockedBtn],
                            alpha: 0.7,
                            duration: 250,
                        });
                        this.tweens.add({
                            targets: [this.berserkerBtn],
                            alpha: 1,
                            duration: 250,
                        });
                        break;
                    case 1:
                        // Wizard
                        this.skinsSkills.setFrame(1);
                        this.texts.setAlpha(1);
                        this.texts.setFrame(1);
                        this.backBtn.setFrame(0);
                        this.berserkerBtn.setFrame(0);
                        this.wizardBtn.setFrame(1);
                        this.bardBtn.setFrame(0);
                        this.rogueBtn.setFrame(0);
                        this.blockedBtn.setFrame(0);
                        this.tweens.add({
                            targets: [this.berserkerBtn, this.bardBtn, this.rogueBtn, this.blockedBtn],
                            alpha: 0.7,
                            duration: 250,
                        });
                        this.tweens.add({
                            targets: [this.wizardBtn],
                            alpha: 1,
                            duration: 250,
                        });
                        break;
                    case 2:
                        // Bard
                        this.skinsSkills.setFrame(2);
                        this.texts.setAlpha(1);
                        this.texts.setFrame(2);
                        this.backBtn.setFrame(0);
                        this.berserkerBtn.setFrame(0);
                        this.wizardBtn.setFrame(0);
                        this.bardBtn.setFrame(1);
                        this.rogueBtn.setFrame(0);
                        this.blockedBtn.setFrame(0);
                        this.tweens.add({
                            targets: [this.berserkerBtn, this.wizardBtn, this.rogueBtn, this.blockedBtn],
                            alpha: 0.7,
                            duration: 250,
                        });
                        this.tweens.add({
                            targets: [this.bardBtn],
                            alpha: 1,
                            duration: 250,
                        });
                        break;
                }// Fin switch(col)
                break;
            case 1:
                switch (this.characterSelectedCol) {
                    case 0:
                        // Rogue
                        this.skinsSkills.setFrame(3);
                        this.texts.setAlpha(1);
                        this.texts.setFrame(3);
                        this.backBtn.setFrame(0);
                        this.berserkerBtn.setFrame(0);
                        this.wizardBtn.setFrame(0);
                        this.bardBtn.setFrame(0);
                        this.rogueBtn.setFrame(1);
                        this.blockedBtn.setFrame(0);
                        this.tweens.add({
                            targets: [this.berserkerBtn, this.wizardBtn, this.bardBtn, this.blockedBtn],
                            alpha: 0.7,
                            duration: 250,
                        });
                        this.tweens.add({
                            targets: [this.rogueBtn],
                            alpha: 1,
                            duration: 250,
                        });
                        break;
                    case 1:
                        // Blocked
                        this.skinsSkills.setFrame(4);
                        this.texts.setAlpha(1);
                        this.texts.setFrame(4);
                        this.backBtn.setFrame(0);
                        this.berserkerBtn.setFrame(0);
                        this.wizardBtn.setFrame(0);
                        this.bardBtn.setFrame(0);
                        this.rogueBtn.setFrame(0);
                        this.blockedBtn.setFrame(1);
                        this.tweens.add({
                            targets: [this.berserkerBtn, this.wizardBtn, this.bardBtn, this.rogueBtn],
                            alpha: 0.7,
                            duration: 250,
                        });
                        this.tweens.add({
                            targets: [this.blockedBtn],
                            alpha: 1,
                            duration: 250,
                        });
                        break;
                    case 2:
                        // Blocked
                        this.skinsSkills.setFrame(4);
                        this.texts.setAlpha(1);
                        this.texts.setFrame(4);
                        this.backBtn.setFrame(0);
                        this.berserkerBtn.setFrame(0);
                        this.wizardBtn.setFrame(0);
                        this.bardBtn.setFrame(0);
                        this.rogueBtn.setFrame(0);
                        this.blockedBtn.setFrame(1);
                        this.characterSelectedCol = 1;
                        this.tweens.add({
                            targets: [this.berserkerBtn, this.wizardBtn, this.bardBtn, this.rogueBtn],
                            alpha: 0.7,
                            duration: 250,
                        });
                        this.tweens.add({
                            targets: [this.blockedBtn],
                            alpha: 1,
                            duration: 250,
                        });
                        break;
                }// Fin switch(col)
                break;
        }// Fin switch(row)
    }// Fin CheckCharacter

    // Selecciona el personaje si está disponible
    SelectCharacter() {
        if (this.characterSelectedRow == -1) {
            this.input.keyboard.removeAllKeys(true);
            this.scene.start("scene_main_menu");
        } else if (this.availableChars[this.characterSelectedRow][this.characterSelectedCol].available) { // Si está disponible
            if (this.availableChars[this.characterSelectedRow][this.characterSelectedCol].purchased) { // Si lo tiene comprado
                game.mPlayer.characterSel.type = this.availableChars[this.characterSelectedRow][this.characterSelectedCol].char;
                game.mPlayer.characterSel.id = this.characterSelectedCol + (this.characterSelectedRow * 3);
                this.selectingCharacter = false;
                this.skinsSkills.setAlpha(1);
                this.leftArrowBtn.setAlpha(1);
                this.rightArrowBtn.setAlpha(1);
                this.selectingSkin = true;
                if (game.global.DEBUG_MODE) {
                    console.log("Personaje seleccionado: " + game.mPlayer.characterSel.type);
                }
            } else {
                if (game.global.DEBUG_MODE) {
                    console.log("Debes comprar el personaje");
                }
            }
        } else {
            if (game.global.DEBUG_MODE) {
                console.log("Personaje no disponible");
            }
        }
    }// Fin SelectCharacter

    CheckSkin() {
        if (this.skinSelectedRow == -1) {
            this.backBtn.setFrame(1);
        } else {
            this.backBtn.setFrame(0);
            // Comprobar si el usuario tiene la skin this.skinSelectedCol 
            if (game.mPlayer.availableSkins[game.mPlayer.characterSel.id].includes(this.skinSelectedCol)) {
                // Guay
            } else {
                // No tiene la skin --> ponerlo en gris o algo
            }
        }
    }// Fin CheckSkin

    SelectSkin() {
        if (this.skinSelectedRow == -1) {
            this.selectingSkin = false;
            this.skinsSkills.setAlpha(0.7);
            this.leftArrowBtn.setAlpha(0);
            this.rightArrowBtn.setAlpha(0);
            this.skinSelectedRow = 0;
            this.skinSelectedCol = 0;
            game.mPlayer.characterSel.type = undefined;
            game.mPlayer.characterSel.id = -1;
            this.selectingCharacter = true;
        } else {
            if (game.mPlayer.availableSkins[game.mPlayer.characterSel.id].includes(this.skinSelectedCol)) {
                // Se puede seleccionar
                game.mPlayer.skinSel = this.skinSelectedCol;
                this.selectingSkin = false;
                this.leftArrowBtn.setAlpha(0);
                this.rightArrowBtn.setAlpha(0);
                this.enterBtn.setAlpha(1);
                this.enterText.setAlpha(1);
                this.confirmingSkin = true;
                if (game.global.DEBUG_MODE) {
                    console.log("Skin seleccionada: " + game.mPlayer.skinSel);
                }
            } else {
                // Hay que comprar la skin
                if (game.global.DEBUG_MODE) {
                    console.log("Debes comprar la skin");
                }
            }
        }
    }// Fin SelectSkin

}// Fin Scene_Select_Character