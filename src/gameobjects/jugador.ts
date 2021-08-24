import Constantes from "../constantes";
import Nivel1 from "../escenas/nivel1";

export default class Jugador extends Phaser.Physics.Arcade.Sprite{

    //Control de entrada
    private cursores: Phaser.Types.Input.Keyboard.CursorKeys;
    private teclasWASD: any;
    private teclaEspacio: Phaser.Input.Keyboard.Key;

    private escena: Nivel1;

    private tiempoEsperaColisionActivo: boolean;  

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

    /**
     * Método que maneja la colisión entre el jugador y un objeto enemigo
     * Se quita vida al jugador si enemigo toca al jugador
     * Si jugador toca al enemigo desde arriba elimina enemigo e incrementa puntos
     * El contexto this es desde dónde se llama por eso hay que usar jugador en lugar de this
     * @param jugador 
     * @param enemigo 
     */
     public enemigoToca(jugador: Jugador, enemigo: Phaser.Physics.Arcade.Sprite): void{

        //Hace desaparecer al enemigo si salta sobre él
        if (jugador.body.velocity.y>100 && 
            enemigo.body.touching.up && jugador.body.touching.down ){                                                             
            if (!jugador.tiempoEsperaColisionActivo){                                                                     
                let posX = enemigo.x;
                let posY = enemigo.y;
                enemigo.destroy();
                
                //incrementa marcador 100puntos
                jugador.escena.puntuacion += 100;
                jugador.escena.registry.set(Constantes.REGISTRO.PUNTUACION,
                jugador.escena.puntuacion);
                jugador.escena.events.emit(Constantes.EVENTOS.PUNTUACION);
    
                //añade efecto explosion con una animación que cuando se completa desaparece
                let explosion: Phaser.GameObjects.Sprite = jugador.
                escena.add.sprite(posX, posY , 
                Constantes.ENEMIGOS.EXPLOSION.ID);                                          
                explosion.play(Constantes.ENEMIGOS.EXPLOSION.ANIM);                            
                explosion.once('animationcomplete', () => {                                
                    explosion.destroy();                            
                });
            }
        }else if (!jugador.tiempoEsperaColisionActivo){            
            //quita vidas y actualiza HUD
            jugador.escena.vidas--;            
            jugador.escena.registry.set(Constantes.REGISTRO.VIDAS, 
            jugador.escena.vidas);
            jugador.escena.events.emit(Constantes.EVENTOS.VIDAS);
            
            //activa tiempoEspera ya que al ser un overlap está colisionando constantemente
            jugador.tiempoEsperaColisionActivo = true;
            //lo tiñe de rojo al jugador
            jugador.tint = 0xff0000; 

            //añade evento de espera para volver a la normalidad
            jugador.escena.time.addEvent({
                delay: 600,
                callback: () => {
                    jugador.tiempoEsperaColisionActivo = false;
                    jugador.tint = 0xffffff; 
                }
            });
        }

    }


}