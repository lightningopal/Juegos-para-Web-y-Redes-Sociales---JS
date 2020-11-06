// this.sys.game.device.os --> Muestra un array de bools que indica el dispositivo en el que se abre la página
// Debug
var x = 0;
var y = 0;

class Scene_Space_Gym extends Phaser.Scene {
    constructor() {
        super({ key: "scene_space_gym" });
    } // Fin constructor

    preload() {
        var that = this;
        
        this.add.image(0, 0, "level_1_bg").setOrigin(0,0).setScale(RelativeScale(1,"x"),RelativeScale(1,"y")).setDepth(-5);
        this.add.image(0, 0, "level_1_bg_details").setOrigin(0,0).setScale(RelativeScale(1,"x"),RelativeScale(1,"y")).setDepth(-3);
        this.bgMove = this.add.image(0, 0, "level_1_bg_move").setOrigin(0,0).setScale(RelativeScale(1,"x"),RelativeScale(1,"y")).setDepth(-2);
        this.tweens.add({
            targets: that.bgMove,
            y: (that.bgMove.y+3),
            ease: 'Sine.easeInOut',
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
        this.add.image(0, 0, "level_1_plats_floor").setOrigin(0,0).setScale(RelativeScale(1,"x"),RelativeScale(1,"y")).setDepth(-1);
        this.add.image(0, 0, "level_1_fg_details").setOrigin(0,0).setScale(RelativeScale(1,"x"),RelativeScale(1,"y")).setDepth(3);
        this.fgMove = this.add.image(0, 0, "level_1_fg_move").setOrigin(0,0).setScale(RelativeScale(1,"x"),RelativeScale(1,"y")).setDepth(4);
        this.tweens.add({
            targets: that.fgMove,
            y: (that.fgMove.y-4),
            ease: 'Sine.easeInOut',
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        this.cursors1 = this.input.keyboard.addKeys({
            'jump': game.cursors1Keys.jump,
            'fall': game.cursors1Keys.fall,
            'left': game.cursors1Keys.left,
            'right': game.cursors1Keys.right,
            'basicAttack': game.cursors1Keys.basicAttack,
            'specialAttack': game.cursors1Keys.specialAttack,
        });

        if (game.global.DEVICE == "mobile") {
            var url;
            url = './Assets/Plugins/rexvirtualjoystickplugin.min.js';
            this.load.plugin('rexvirtualjoystickplugin', url, true);
        }

        // Variables encargadas del control del personaje
        this.movingLeft;
        this.movingRight;
        this.falling;
        this.attacking;
        
    } // Fin preload

    create() {
        var that = this;
        
        // Create mobileKeys
        this.mobileKeys = {
            joyStick : null,
            jumpButton : null
        };

        // Si el dispositivo es movil, añadir un joystick y un boton
        if (game.global.DEVICE == "mobile" || game.global.DEBUG_PHONE) {
            this.mobileKeys.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
                x: RelativeScale(100, "x"),
                y: RelativeScale(630, "y"),
                radius: 15,
                base: this.add.circle(0, 0, RelativeScale(60, "x"), 0x888888).setAlpha(0.7).setScale(RelativeScale()).setDepth(1000),
                thumb: this.add.circle(0, 0, RelativeScale(45, "x"), 0xcccccc).setAlpha(0.7).setScale(RelativeScale()).setDepth(1001),
                // dir: '8dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
                // forceMin: 16,
                // enable: true
            }).on('update', this.dumpJoyStickState, this);

            this.text = this.add.text(0, 0);
            this.dumpJoyStickState();

            this.mobileKeys.jumpButton = this.add.circle(RelativeScale(1160, "x"), RelativeScale(630, "y"), 20, 0xdddddd).setAlpha(0.7).setScale(RelativeScale()).setDepth(1000).setInteractive();
            
            this.input.addPointer(2);
        }

        // Dummy de prácticas
        this.dummy = this.add.image(RelativeScale(1500, "x"), RelativeScale(940, "y"), "dummy")
        .setScale(RelativeScale(1, "x"), RelativeScale(1, "y"));
        this.dummyBar = new UserInterface(this, this.dummy, 100, 0);
        this.dummy.userInterface = this.dummyBar; 
        // Pool de habilidades
        /*Bardo*
        this.bardAttack1 = new BardSkill(this, 0, 0, 0,"projectile", this.dummy, 10, 2000, 800)
        .setScale(RelativeScale(1, "x"), RelativeScale(1, "y")).setDepth(6);
        this.bardAttack2 = new BardSkill(this, 0, 0, 0,"projectile", this.dummy, 10, 2000, 800)
        .setScale(RelativeScale(1, "x"), RelativeScale(1, "y")).setDepth(6);
        /**/
        /*Berserker*
        this.berserkerAttack1 = new BerserkerSkill(this, 0, 0, 0,"projectile", this.dummy, 10, 2000, 800)
        .setScale(RelativeScale(1, "x"), RelativeScale(1, "y")).setDepth(6);
        this.berserkerAttack2 = new Berserker(this, 0, 0, 0,"projectile", this.dummy, 10, 2000, 800)
        .setScale(RelativeScale(1, "x"), RelativeScale(1, "y")).setDepth(6);
        /**/
       /*Mago*
        this.wizardAttack1 = new WizardSkill(this, 0, 0, 0,"projectile", this.dummy, 10, 1500, 350)
        .setScale(RelativeScale(1, "x"), RelativeScale(1, "y")).setDepth(6);
        this.wizardAttack2 = new WizardSkill(this, 1, 0, 0,"projectile", this.dummy, 10, 1500, 350)
        .setScale(RelativeScale(1, "x"), RelativeScale(1, "y")).setDepth(6);
        this.wizardAttack3 = new WizardSkill(this, 2, 0, 0,"projectile", this.dummy, 10, 1500, 350)
        .setScale(RelativeScale(1, "x"), RelativeScale(1, "y")).setDepth(6);
        this.wizardAttack4 = new WizardSkill(this, 0, 0, 0,"projectile", this.dummy, 10, 1500, 350)
        .setScale(RelativeScale(1, "x"), RelativeScale(1, "y")).setDepth(6);
        this.wizardAttack5 = new WizardSkill(this, 1, 0, 0,"projectile", this.dummy, 10, 1500, 350)
        .setScale(RelativeScale(1, "x"), RelativeScale(1, "y")).setDepth(6);
        this.wizardAttack6 = new WizardSkill(this, 2, 0, 0,"projectile", this.dummy, 10, 1500, 350)
        .setScale(RelativeScale(1, "x"), RelativeScale(1, "y")).setDepth(6);
        /**/
        /*Pícaro*
        this.rogueAttack1 = new RogueSkill(this, 0, 0, 0,"projectile", this.dummy, 10, 2000, 350, 0)
        .setScale(RelativeScale(1, "x"), RelativeScale(1, "y")).setDepth(6);
        this.rogueAttack2 = new RogueSkill(this, 1, 0, 0,"projectile", this.dummy, 10, 2000, 350, 150)
        .setScale(RelativeScale(1, "x"), RelativeScale(1, "y")).setDepth(6);
        this.rogueAttack3 = new RogueSkill(this, 2, 0, 0,"projectile", this.dummy, 10, 2000, 350, 300)
        .setScale(RelativeScale(1, "x"), RelativeScale(1, "y")).setDepth(6);
        this.rogueAttack4 = new RogueSkill(this, 0, 0, 0,"projectile", this.dummy, 10, 2000, 350, 0)
        .setScale(RelativeScale(1, "x"), RelativeScale(1, "y")).setDepth(6);
        this.rogueAttack5 = new RogueSkill(this, 1, 0, 0,"projectile", this.dummy, 10, 2000, 350, 150)
        .setScale(RelativeScale(1, "x"), RelativeScale(1, "y")).setDepth(6);
        this.rogueAttack6 = new RogueSkill(this, 2, 0, 0,"projectile", this.dummy, 10, 2000, 350, 300)
        .setScale(RelativeScale(1, "x"), RelativeScale(1, "y")).setDepth(6);
        /**/
        /**
        // Se añade el pool a un array y se pasa al arma del personaje (que maneja el id del ataque a lanzar)
        this.bardBasicAttacks = [this.bardAttack1, this.bardAttack2];
        // var berserkerBasicAttacks = [this.berserkerAttack1, this.berserkerAttack2];
        // var wizardBasicAttacks = [this.wizardAttack1,this.wizardAttack2,this.wizardAttack3, 
            // this.wizardAttack4,this.wizardAttack5,this.wizardAttack6];
        // var rogueBasicAttacks = [this.rogueAttack1,this.rogueAttack2,this.rogueAttack3, 
        //     this.rogueAttack4,this.rogueAttack5,this.rogueAttack6];
        this.basicWeapon = new Weapon(this, 700, this.bardBasicAttacks, 1);
        /**/
        // Crear el personaje
        // this.myPlayer = new Character_Controller(this, 0, RelativeScale(250, "x"),
        // RelativeScale(850, "y"), "bard", RelativeScale(), this.cursors1, 
        // this.mobileKeys, RelativeScale(500, "x"), RelativeScale(1020, "y"), 100, this.basicWeapon, this.basicWeapon)
        // .setScale(RelativeScale(1, "x"), RelativeScale(1, "y"));
        this.movingLeft = false;
        this.movingRight = false;
        this.falling = false;
        this.attacking = false;
        switch(game.mPlayer.characterSel.type){
            case "berserker":
                game.mPlayer.image = this.add.sprite(RelativeScale(250, "x"), RelativeScale(850, "y"), "berserker")
                .setScale(RelativeScale(1,"x"),RelativeScale(1,"y"));
                game.mPlayer.image.anims.play("berserker_idle");
                break;
            case "wizard":
                game.mPlayer.image = this.add.sprite(RelativeScale(250, "x"), RelativeScale(850, "y"), "wizard")
                .setScale(RelativeScale(1,"x"),RelativeScale(1,"y"));
                game.mPlayer.image.anims.play("wizard_idle");
                break;
            case "bard":
                game.mPlayer.image = this.add.sprite(RelativeScale(250, "x"), RelativeScale(850, "y"), "bard")
                .setScale(RelativeScale(1,"x"),RelativeScale(1,"y"));
                game.mPlayer.image.anims.play("bard_idle");
                break;
            case "rogue":
                game.mPlayer.image = this.add.sprite(RelativeScale(250, "x"), RelativeScale(850, "y"), "rogue")
                .setScale(RelativeScale(1,"x"),RelativeScale(1,"y"));
                game.mPlayer.image.anims.play("rogue_idle");
                break;
            default:
                game.mPlayer.image = this.add.sprite(RelativeScale(250, "x"), RelativeScale(850, "y"), "bard")
                .setScale(RelativeScale(1,"x"),RelativeScale(1,"y"));
                game.mPlayer.image.anims.play("bard_idle");
                break;
        }

        if (game.global.DEVICE === "desktop"){
            this.cursors1.left.on("down", function(event){
                that.movingRight = false;
                that.movingLeft = true;
                game.mPlayer.image.flipX = true;
            });
            this.cursors1.left.on("up", function(event){
                that.movingLeft = false;
            });
    
            this.cursors1.right.on("down", function(event){
                that.movingRight = true;
                that.movingLeft = false;
                game.mPlayer.image.flipX = false;
            });
            this.cursors1.right.on("up", function(event){
                that.movingRight = false;
            });
    
            this.cursors1.basicAttack.on("down", function(event){
                if (!that.attacking){
                    that.attacking = true;
                    game.mPlayer.image.anims.play(game.mPlayer.characterSel.type+"_attack", true);
                }
            });
            this.cursors1.specialAttack.on("down", function(event){
                if (!that.attacking){
                    that.attacking = true;
                    game.mPlayer.image.anims.play(game.mPlayer.characterSel.type+"_attack", true);
                }
            });
        }// Fin DEVICE == desktop
        

        game.mPlayer.image.on("animationcomplete", function(anim){
            if (anim.key === game.mPlayer.characterSel.type+"_attack"){
                that.attacking = false;
            }
            if (game.global.DEBUG_MODE){
                console.log("Fin de animación: "+ anim.key);
            }
            
        }, this);

        //Plataformas
        this.transimage = this.physics.add.image(RelativeScale(522.50, "x"), RelativeScale(889.0, "y"), "level_1_trans").setScale(RelativeScale(1,"x"),RelativeScale(1,"y")).setDepth(2);
        
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(RelativeScale(960.0,"x"), RelativeScale(1038.0,"y"), "floor")
        .setScale(RelativeScale(1,"x"), RelativeScale(1,"y")).refreshBody().setDepth(-1)
        .body.setSize(RelativeScale(1920,"x"),RelativeScale(84,"y")).setOffset(0,RelativeScale(20,"y"));

        this.platforms.create(RelativeScale(1527.5,"x"), RelativeScale(747.50,"y"), "base_big_plat_2")
        .setScale(RelativeScale(1,"x"), RelativeScale(1,"y")).refreshBody()
        .body.setSize(RelativeScale(385,"x"),RelativeScale(75,"y")).setOffset(0,RelativeScale(-10,"y"));

        this.platforms.create(RelativeScale(947.0,"x"), RelativeScale(511.0,"y"), "base_t_plat")
        .setScale(RelativeScale(1,"x"), RelativeScale(1,"y")).refreshBody()
        // .body.setSize(RelativeScale(279,"x"),RelativeScale(34,"y")).setOffset(0,RelativeScale(12,"y"));

        this.platforms.create(RelativeScale(503.0,"x"), RelativeScale(717.50,"y"), "big_plat_1") // 502.5 x 707
        .setScale(RelativeScale(1,"x"), RelativeScale(1,"y")).refreshBody()
        .body.setSize(RelativeScale(328,"x"),RelativeScale(90,"y")).setOffset(0,RelativeScale(-10,"y"));

        this.platforms.create(RelativeScale(1763.0,"x"), RelativeScale(371.5,"y"), "big_plat_2") // 1764 x 362
        .setScale(RelativeScale(1,"x"), RelativeScale(1,"y")).refreshBody()
        // .body.setSize(RelativeScale(341,"x"),RelativeScale(165,"y")).setOffset(0,RelativeScale(12,"y"));

        this.platforms.create(RelativeScale(90.50,"x"), RelativeScale(441.0,"y"), "plat_1")
        .setScale(RelativeScale(1,"x"), RelativeScale(1,"y")).refreshBody()
        // .body.setSize(RelativeScale(181,"x"),RelativeScale(40,"y")).setOffset(0,RelativeScale(10,"y"));

        this.platforms.create(RelativeScale(517.50,"x"), RelativeScale(213.50,"y"), "plat_2")
        .setScale(RelativeScale(1,"x"), RelativeScale(1,"y")).refreshBody()
        // .body.setSize(RelativeScale(218,"x"),RelativeScale(40,"y")).setOffset(0,RelativeScale(10,"y"));

        this.platforms.create(RelativeScale(1230.50,"x"), RelativeScale(115.0,"y"), "plat_3")
        .setScale(RelativeScale(1,"x"), RelativeScale(1,"y")).refreshBody()
        // .body.setSize(RelativeScale(207,"x"),RelativeScale(40,"y")).setOffset(0,RelativeScale(10,"y"));

        this.platforms.create(RelativeScale(945.50,"x"), RelativeScale(371.50,"y"), "t_plat")
        .setScale(RelativeScale(1,"x"), RelativeScale(1,"y")).refreshBody()
        // .body.setSize(RelativeScale(56,"x"),RelativeScale(140,"y")).setOffset(0,RelativeScale(10,"y"));

        this.hidePlatforms = [this.transimage];
        this.hidePlatforms.forEach(platform => {
            platform.body.setCollideWorldBounds(true);
            platform.body.allowGravity = false;
        });

        //Colisiones
        //this.characters = [this.myPlayer, this.dummy/**, enemyPlayer/**/];
        //this.bullets = [];

        //this.physics.add.overlap(this.characters, this.bullets, this.BulletHit, player, bullet);
        //this.physics.add.collider(this.characters, this.platforms);
        //this.physics.add.overlap(this.characters, this.hidePlatforms);
    } // Fin create

    update() {
        if (this.movingLeft || this.movingRight){
            if (!this.attacking){
                game.mPlayer.image.anims.play(game.mPlayer.characterSel.type+"_walk", true);
            }
        }else{
            if (!this.attacking){
                game.mPlayer.image.anims.play(game.mPlayer.characterSel.type+"_idle",true);
            }
        }
        /*
        // Mostrar u ocultar las plataformas al pasar por encima
        this.hidePlatforms.forEach(platform => {
            if (platform.body.embedded) platform.body.touching.none = false;
            if (!platform.body.touching.none && platform.body.wasTouching.none){
                this.HidePlatform(platform);
            }else if (platform.body.touching.none && !platform.body.wasTouching.none){
                this.ShowPlatform(platform);
            }
        });

        if (this.dummy.body.touching.down){
            // this.dummy.body.velocity.y = RelativeScale(-800,"y");
        }
        */
        var debugText = document.getElementById("debugText");
        debugText.innerHTML = "Posición del ratón: {x: " + x + ", y: " + y + "} | FPS: " + Math.round(game.loop.actualFps);
    } // Fin update

    /** *
    BulletHit(player, bullet) {
        this.DamagePlayer(player, bullet);
        this.RemoveBullet(bullet);
    }

    RemoveBullet(bullet) {
        var index = bullet.bulletIndex;
        this.bullets[index].destroy();

        for (var i = index; i < (this.bullets.length - 1); i++) {
            this.bullets[i] = this.bullets[i + 1]
        }

        this.bullets[this.bullets.length].destroy();
    }

    DamagePlayer(player, attack) {
        player.actualHP -= attack.damage;

        if (player.actualHP <= 0)
            player.die();
    }
    /** */
    // Joystick movil
    DumpJoyStickState() {
        var cursorKeys = this.mobileKeys.joyStick.createCursorKeys();
        var s = 'Key down: ';
        for (var name in cursorKeys) {
            if (cursorKeys[name].isDown) {
                s += name + ' ';
            }
        }
        s += '\n';
        s += ('Force: ' + Math.floor(this.mobileKeys.joyStick.force * 100) / 100 + '\n');
        s += ('Angle: ' + Math.floor(this.mobileKeys.joyStick.angle * 100) / 100 + '\n');
        this.text.setText(s);
    }

    HidePlatform(platform){
        var tween = this.tweens.add({
            targets: platform,
            alpha: 0.3,
            ease: 'Sine.easeInOut',
            duration: 200,
        });
    }

    ShowPlatform(platform){
        var tween = this.tweens.add({
            targets: platform,
            alpha: 1.0,
            ease: 'Sine.easeInOut',
            duration: 200,
        });
    }

}

function showCoords(event) {
    x = Math.round(event.clientX * (game.config.width / 1920));
    y = Math.round(event.clientY * (game.config.height / 1080));
  }