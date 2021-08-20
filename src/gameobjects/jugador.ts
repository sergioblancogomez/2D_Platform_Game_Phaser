import Constantes from "../constantes";

export default class Jugador extends Phaser.Physics.Arcade.Sprite{

    //Control de entrada
    private cursores: Phaser.Types.Input.Keyboard.CursorKeys;
    private teclasWASD: any;
    private teclaEspacio: Phaser.Input.Keyboard.Key;

    private escena: Phaser.Scene;

    constructor(config: any){
        super(config.escena, config.x, config.y, config.texture);

        this.escena = config.escena;
        this.escena.physics.world.enable(this);
        this.escena.add.existing(this);

        this.body.setSize(20,30);
        this.setCollideWorldBounds(true);

         //Control entrada
         this.cursores = this.escena.input.keyboard.createCursorKeys();
         this.teclasWASD = this.escena.input.keyboard.addKeys('W,A,S,D');
         this.teclaEspacio = this.escena.input.keyboard.addKey(Phaser.Input.
         Keyboard.KeyCodes.SPACE);

         this.play(Constantes.JUGADOR.ANIMACION.ESPERA);
    }

    update(): void{

        //Control de Movimiento
        if (this.teclasWASD.A.isDown || this.cursores.left.isDown){
            this.setVelocityX(-200);
            if (this.body.blocked.down)
                this.anims.play(Constantes.JUGADOR.ANIMACION.CORRER, true);
                this.flipX = true;
        }
        else if (this.teclasWASD.D.isDown || this.cursores.right.isDown){
            this.setVelocityX(200);
            if (this.body.blocked.down)
                this.anims.play(Constantes.JUGADOR.ANIMACION.CORRER, true);
                this.flipX = false;
        }
        else {
            this.setVelocityX(0);
            this.anims.play(Constantes.JUGADOR.ANIMACION.ESPERA, true)
        }

        if ((this.teclaEspacio.isDown || this.teclasWASD.W.isDown
        || this.cursores.up.isDown) && 
        this.body.blocked.down)
        {
            this.setVelocityY(-300);
            this.anims.stop();
            this.setTexture(Constantes.JUGADOR.ID, 
            Constantes.JUGADOR.ANIMACION.SALTO)
        }


    }
}