import Constantes from '../constantes';
import Jugador from '../gameobjects/jugador';
import Enemigos from '../gameobjects/enemigos';
import PlataformasMoviles from '../gameobjects/plataformasmoviles';

export default class Nivel1 extends Phaser.Scene
{
    private width: number;
    private height: number;

    public vidas: number;
    public puntuacion: number;

    public mapaNivel : Phaser.Tilemaps.Tilemap;
    private conjuntoPatrones: Phaser.Tilemaps.Tileset;
    private capaMapaNivel: Phaser.Tilemaps.TilemapLayer;  

    private imagenFondo: Phaser.GameObjects.TileSprite;

    private jugador: Jugador;

    //tiempo nivel
    private segundos: number;        
    private tiempoRestante: number; 
    private tiempoAgotado: boolean;

    //enemigos
    private bunnyGroup: Enemigos;
    private chickenGroup: Enemigos;

    //plataformas móviles
    private plataformasMovilesH: PlataformasMoviles;
    private plataformasMovilesV: PlataformasMoviles;





    constructor ()
    {
        super(Constantes.ESCENAS.NIVEL1);
    }

    init(){
        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;

        this.vidas = 3;
        this.puntuacion = 0;
        //Con el sistema de registro global de variables
        //inicializamos las del juego                
        this.registry.set(Constantes.REGISTRO.VIDAS, this.vidas);        
        this.registry.set(Constantes.REGISTRO.PUNTUACION, this.puntuacion);        

        this.segundos = 1;
        this.tiempoRestante = 300;
        this.tiempoAgotado = false;

    }


    preload ()
    {
        
    }

    create ()
    {        
        //const logo = this.add.image(400, 70, 'logo1');
        
        const jugarTxt: Phaser.GameObjects.Text = this.add.text(50, this.height/2, 'NIVEL 1', {fontSize:'32px', color:'#FFFFFF'});
        

        const puntuacionTxt: Phaser.GameObjects.Text  = this.add.text(this.width/2  , this.height/2 + 100 , 'Puntuacion',  { fontSize: '32px', color: '#FFFFFF' })
                                                .setInteractive();         
                                                        
        puntuacionTxt.on('pointerdown', () => {                                                                    
            this.puntuacion++;
            this.registry.set(Constantes.REGISTRO.PUNTUACION, this.puntuacion);
            this.events.emit(Constantes.EVENTOS.PUNTUACION);
        });

        
        /*Cargar Tilemap*/
        this.mapaNivel = this.make.tilemap({ key: Constantes.MAPAS.NIVEL1.TILEMAPJSON , tileWidth: 16, tileHeight: 16 });
        this.physics.world.bounds.setTo(0, 0, this.mapaNivel.widthInPixels, this.mapaNivel.heightInPixels);

        //jugador
        this.mapaNivel.findObject(Constantes.JUGADOR.ID, (d: any) => {           
            this.jugador = new Jugador({
                escena: this, 
                x:d.x,
                y:d.y, 
                textura: Constantes.JUGADOR.ID
            });            
        });        

        //las cámaras siguen al jugador
        this.cameras.main.setBounds(0, 0, this.mapaNivel.widthInPixels, this.mapaNivel.heightInPixels);
        this.cameras.main.startFollow(this.jugador);
        
        this.conjuntoPatrones = this.mapaNivel.addTilesetImage(Constantes.MAPAS.TILESET);
        
        this.capaMapaNivel = this.mapaNivel.createLayer(Constantes.MAPAS.NIVEL1.CAPAPLATAFORMAS, this.conjuntoPatrones);
        this.capaMapaNivel.setCollisionByExclusion([-1]);
        
        //Fondo
        this.imagenFondo = this.add.tileSprite(0,0,this.mapaNivel.widthInPixels, this.mapaNivel.heightInPixels, Constantes.FONDOS.NIVEL1).setOrigin(0,0).setDepth(-1);

        //Animaciones
        this.anims.create({
            key: Constantes.JUGADOR.ANIMACION.ESPERA,
            frames:this.anims.generateFrameNames (Constantes.JUGADOR.ID,{prefix: Constantes.JUGADOR.ANIMACION.ESPERA + '-',
            end:11}),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: Constantes.JUGADOR.ANIMACION.CORRER, 
            frames: this.anims.generateFrameNames(Constantes.JUGADOR.ID,{
                prefix:Constantes.JUGADOR.ANIMACION.CORRER + '-',
                end:11 
            }), 
            frameRate:20, 
            repeat: -1
        });

        //crea la animacion de explosion        
        this.anims.create({
            key: Constantes.ENEMIGOS.EXPLOSION.ANIM,
            frames: Constantes.ENEMIGOS.EXPLOSION.ID,
            frameRate: 15,
            repeat: 0
        });



        
        this.physics.add.collider(this.jugador, this.capaMapaNivel); 


        //Crea sprite con posición final 
        let objetofinal: any = this.mapaNivel.createFromObjects(Constantes.MAPAS.POSICIONFINAL, {name: Constantes.MAPAS.POSICIONFINAL})[0];                
        this.physics.world.enable(objetofinal);
        objetofinal.body.setAllowGravity(false);
        objetofinal.setTexture(Constantes.OBJETOS.FINAL);
        objetofinal.body.setSize(40,50);
        objetofinal.body.setOffset(10,15);        
        
        //collisión para final del nivel
        this.physics.add.collider(this.jugador, objetofinal, () => {            
            this.scene.stop(Constantes.ESCENAS.NIVEL1);
            this.scene.stop(Constantes.ESCENAS.HUD);
            this.scene.start(Constantes.ESCENAS.MENU);
        });

        //Añade los enemigos obteniendolos de la capa de objetos del mapa
        this.bunnyGroup  = new Enemigos(this,Constantes.MAPAS.ENEMIGOS, Constantes.ENEMIGOS.BUNNY.ID, Constantes.ENEMIGOS.BUNNY.ANIM,Constantes.ENEMIGOS.BUNNY.VELOCIDAD, {size:{x:30,y:30}, offset:{x:0,y:10}});

        this.physics.add.collider(this.bunnyGroup, this.capaMapaNivel); 

        this.physics.add.overlap(this.jugador, this.bunnyGroup, this.jugador.enemigoToca, null, this);
        
        //Chicken Group
        this.chickenGroup  = new Enemigos(this,Constantes.MAPAS.ENEMIGOS, Constantes.ENEMIGOS.CHICKEN.ID, Constantes.ENEMIGOS.CHICKEN.ANIM,Constantes.ENEMIGOS.CHICKEN.VELOCIDAD, {size:{x:30,y:30}, offset:{x:0,y:0}});

        this.physics.add.collider(this.chickenGroup, this.capaMapaNivel);    
        this.physics.add.overlap(this.jugador, this.chickenGroup, this.jugador.enemigoToca, null, this);

        //Plataformas móviles
        this.plataformasMovilesH = new PlataformasMoviles(this, Constantes.MAPAS.PLATAFORMASMOVILES, Constantes.OBJETOS.PLATAFORMAMOVIL.ID, Constantes.OBJETOS.PLATAFORMAMOVIL.VELOCIDAD, true);

        this.plataformasMovilesV = new PlataformasMoviles(this, Constantes.MAPAS.PLATAFORMASMOVILES, Constantes.OBJETOS.PLATAFORMAMOVIL.ID, Constantes.OBJETOS.PLATAFORMAMOVIL.VELOCIDAD, false);

        this.physics.add.collider(this.jugador, [this.plataformasMovilesH,this.plataformasMovilesV] );
        
        this.physics.add.collider(this.capaMapaNivel, [this.plataformasMovilesH,this.plataformasMovilesV]);    



    }

    update(time): void{
        //mover el fondo
        this.imagenFondo.tilePositionY -= 0.4;

        if (parseInt(this.registry.get(Constantes.REGISTRO.VIDAS)) === 0){
            this.scene.stop(Constantes.ESCENAS.NIVEL1);
            this.scene.stop(Constantes.ESCENAS.HUD);
            this.scene.start(Constantes.ESCENAS.MENU);
        }

        this.jugador.update();
        this.bunnyGroup.update();
        this.chickenGroup.update();
        this.plataformasMovilesH.update();
        this.plataformasMovilesV.update();



        //Gestión del Tiempo
        if ((this.segundos != Math.floor(Math.abs(time / 1000)) ) && !this.tiempoAgotado ) {
            this.segundos = Math.floor(Math.abs(time / 1000));
            this.tiempoRestante--;  

            let minutos: number = Math.floor(this.tiempoRestante / 60);                
            let segundos: number = Math.floor(this.tiempoRestante - (minutos * 60));

            let textoReloj: string = Phaser.Utils.String.Pad(minutos,2,'0',1) + ":" + Phaser.Utils.String.Pad(segundos,2,'0',1);
            //Registro
            this.registry.set(Constantes.REGISTRO.RELOJ, textoReloj);
            //envío al HUD
            this.events.emit(Constantes.EVENTOS.RELOJ);

            //Cuando el tiempo termine GAME OVER
            if (this.tiempoRestante == 0){ 
                this.tiempoAgotado = true;
                this.scene.stop(Constantes.ESCENAS.NIVEL1);
                this.scene.stop(Constantes.ESCENAS.HUD);
                this.scene.start(Constantes.ESCENAS.MENU);                    
            } 


        }





    }
}