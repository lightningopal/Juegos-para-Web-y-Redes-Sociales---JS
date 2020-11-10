class Scene_Ranking extends Phaser.Scene {

    constructor() {
        super({ key: "scene_ranking" });
    } // Fin constructor

    preload() {
        //Creación de imágenes
        this.background = this.add.image(0, 0, "simple_bg").setOrigin(0,0)
        .setScale(RelativeScale(1, "x"), RelativeScale(1, "y"));
        this.stars = this.add.tileSprite(0, 0, RelativeScale(1920,"x"),RelativeScale(1080,"y"), "stars")
        .setOrigin(0,0);

        this.add.image(0, 0, "ranking_interface").setOrigin(0, 0)
            .setScale(RelativeScale(1, "x"), RelativeScale(1, "y"));

        this.backBtn = this.add.image(RelativeScale(66.0, "x"), RelativeScale(63.5, "y"), "back_button")
            .setScale(RelativeScale(1, "x"), RelativeScale(1, "y"));

        // Teclas
        this.cursors;

        // Textos
        // Propio Ranking
        var rankingNameTexts = [];
        var rankingWinsLosesTexts = [];
        var rankingPointsTexts = [];

        for (var i = 0; i < game.global.ranking.length - 1; i++)
        {
            if (game.global.ranking[i].userName != "")
            {
                var winsLosesString = game.global.ranking[i].winsCount + " / " + game.global.ranking[i].losesCount;

                rankingNameTexts[i] = this.add.text(RelativeScale(240, "x"), RelativeScale(398 + (67 * i), "y"), game.global.ranking[i].userName);
                rankingWinsLosesTexts[i] = this.add.text(RelativeScale(660, "x"), RelativeScale(398 + (67 * i), "y"), winsLosesString).setOrigin(0.5, 0);
                rankingPointsTexts[i] = this.add.text(RelativeScale(940, "x"), RelativeScale(398 + (67 * i), "y"), game.global.ranking[i].points).setOrigin(0.5, 0);
            }
            else
            {
                break;
            }
        }

        // Usuario
        var winsLosesString = game.global.ranking[10].winsCount + " / " + game.global.ranking[10].losesCount;

        rankingNameTexts[10] = this.add.text(RelativeScale(1580, "x"), RelativeScale(680, "y"), game.global.ranking[10].userName);
        rankingWinsLosesTexts[10] = this.add.text(RelativeScale(1580, "x"), RelativeScale(795, "y"), winsLosesString);
        rankingPointsTexts[10] = this.add.text(RelativeScale(1580, "x"), RelativeScale(900, "y"), game.global.ranking[10].points);

    } // Fin preload

    create() {
        // Set the scene
        var that = this;
        game.global.actualScene = "scene_ranking";

        if (game.global.DEVICE === "mobile" || game.global.DEBUG_PHONE) {
            this.input.on('pointerup', function () {
                that.backBtn.setFrame(0);
            });
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
        } else {
            this.backBtn.setFrame(1);
            // Opciones de selección
            this.cursors = this.input.keyboard.addKeys({
                'escape': Phaser.Input.Keyboard.KeyCodes.ESC,
                'enter': Phaser.Input.Keyboard.KeyCodes.ENTER,
            });

            this.cursors.escape.on('down', function (event) {
                that.input.keyboard.removeAllKeys(true);
                that.scene.start("scene_main_menu");
            });
            this.cursors.enter.on('down', function (event) {
                that.input.keyboard.removeAllKeys(true);
                that.scene.start("scene_main_menu");
            });
        }
    } // Fin create

    update() {
        this.stars.tilePositionX += RelativeScale(0.2, "x");
        this.stars.tilePositionY += RelativeScale(0.4, "y");
    } // Fin update

}// Fin Scene_Ranking