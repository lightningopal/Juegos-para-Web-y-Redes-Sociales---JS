'use strict';
window.onload = function () {
    this.prueba = "prueba";
    // Mobile JS detector
    this.isMobile = false;
    this.userAgent = navigator.userAgent.toLowerCase();
    if (/windows phone/i.test(userAgent) || /android/i.test(userAgent) || (/iPad|iPhone|iPod/i.test(userAgent) && !window.MSStream)) {
        isMobile = true;
    }

    // Referencias de pantalla
    this.referenceWidth = 1920;
    this.referenceHeight = 1080;

    this.configDesktop = {
        type: Phaser.AUTO,
        backgroundColor: "#2a0678",
        width: window.screen.width / 1.3,//800, //1920
        height: window.screen.height / 1.3,//450, //1080
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: ((window.screen.height / 1.3) / referenceHeight) * 2200 },
                debug: true
            }
        },
        dom: {
            createContainer: true
        },
        parent: 'game', // Create the game inside the <div id="game">
        scene: [Scene_Boot,
            Scene_Test,
            Scene_Main_Menu,
            Scene_Options,
            Scene_Ranking,
            Scene_Credits,
            Scene_Select_Character,
            Scene_Account,
            Scene_SelectLogin
        ]
    };

    // Config test mobile
    this.configMobile = {
        type: Phaser.AUTO,
        backgroundColor: "#2a0678",
        width: window.screen.width,
        height: window.screen.height,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: ((window.screen.height) / referenceHeight) * 2200 },
                debug: true
            }
        },
        dom: {
            createContainer: true
        },
        parent: 'game', // Create the game inside the <div id="game">
        scene: [Scene_Boot,
            Scene_Test,
            Scene_Main_Menu,
            Scene_Options,
            Scene_Ranking,
            Scene_Credits,
            Scene_Select_Character,
            Scene_Account,
            Scene_SelectLogin
        ]
    };

    // Selección de configuración en función del dispositivo
    if (isMobile) {
        this.game = new Phaser.Game(configMobile);
    } else {
        this.game = new Phaser.Game(configDesktop);
    }
    window.focus();

    this.game.global = {
        DEVICE:         null,
        FPS:            60,
        DEBUG_MODE:     true,
        WS_CONNECTION:  false,
        socket:         null,
        IP:             "192.168.1.35",
        logInOption:    0
    }

    this.game.options = {
        musicVol:       1.0,
        SFXVol:         1.0,
        fullScreen:     false
    }

    

    /*
    this.game.server = {
        serverIP:       "192.168.1.35",
        playerID:       -1,
        isOnline:       false,
        ready:          false,
        characterSel:   -1,
        playerName:     "",
        playerPassword: ""
    };
    */

    this.game.mPlayer = {
        id:             -1,
        userName:       undefined, // String
        password:       undefined, // String
        currency:       0,
        availableChar:  [],
        availableSkins: [],
        ranking: {
            position:   0,
            wins:       0,
            loses:      0,
            score:      0
        },
        characterSel:   undefined, // String
        skillSel:       -1,
        difficultySel:  -1,
        isReady:        false
    };

    this.game.cursors1Keys = {
        jump:           Phaser.Input.Keyboard.KeyCodes.W,
        fall:           Phaser.Input.Keyboard.KeyCodes.S,
        left:           Phaser.Input.Keyboard.KeyCodes.A,
        right:          Phaser.Input.Keyboard.KeyCodes.D,
        basicAttack:    Phaser.Input.Keyboard.KeyCodes.O,
        specialAttack:  Phaser.Input.Keyboard.KeyCodes.P
    };

    if (this.isMobile) {
        game.global.DEVICE = "mobile";
    }
    else {
        game.global.DEVICE = "desktop";
    }

    // Responsive Functions
    // Escala
    this.scaleX = (game.config.width / referenceWidth);
    this.scaleY = (game.config.height / referenceHeight);
    // Funciones de escalado
    this.RelativeScale = function (v, axis) {
        var value = 1;

        if (axis == "x")
            value = scaleX * v;
        else
            value = scaleY * v;
        return value;
    }

    this.Unscale = function (v, axis) {
        var value = 1;

        if (axis == "x")
            value = v / scaleX;
        else
            value = v / scaleY;
        return value;
    }
}