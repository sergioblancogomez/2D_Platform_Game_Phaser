import Constantes from '../constantes';

export default class Nivel1 extends Phaser.Scene
{
    private width: number;
    private height: number;

    private vidas: number;
    private puntuacion: number;

    private mapaNivel : Phaser.Tilemaps.Tilemap;
    private conjuntoPatrones: Phaser.Tilemaps.Tileset;
    private capaMapaNivel : Phaser.Tilemaps.TilemapLayer;

    private imagenFondo: Phaser.GameObjects.TileSprite;

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

    }


    preload ()
    {
        
    }

    create ()
    {        
        const logo = this.add.image(400, 70, 'logo');
        
        const jugarTxt: Phaser.GameObjects.Text = this.add.text(50, this.height/2, 'NIVEL 1', {fontSize:'32px', color:'#FFFFFF'});
        
        const vidasTxt: Phaser.GameObjects.Text = this.add.text(this.width/2, this.height/2, 'VIDAS -', {fontSize:'32px', color:'#FFFFFF'}).setInteractive();

        vidasTxt.on('pointerdown', ()=>{
            this.vidas --;
            this.registry.set(Constantes.REGISTRO.VIDAS, this.vidas);
            this.events.emit(Constantes.EVENTOS.VIDAS);
        });

        const puntuacionTxt: Phaser.GameObjects.Text  = this.add.text(this.width/2  , this.height/2 + 100 , 'Puntuacion',  { fontSize: '32px', color: '#FFFFFF' })
                                                .setInteractive();         
                                                        
        puntuacionTxt.on('pointerdown', () => {                                                                    
            this.puntuacion++;
            this.registry.set(Constantes.REGISTRO.PUNTUACION, this.puntuacion);
            this.events.emit(Constantes.EVENTOS.PUNTUACION);
        });

        //Cargar Tilemap
        this.mapaNivel = this.make.tilemap({ key: Constantes.MAPAS.NIVEL1.
        TILEMAPJSON , tileWidth: 16, tileHeight: 16});

        this.conjuntoPatrones = this.mapaNivel.addTilesetImage
        (Constantes.MAPAS.TILESET);

        this.capaMapaNivel = this.mapaNivel.createLayer(Constantes.
        MAPAS.NIVEL1.CAPAPLATAFORMAS, this.conjuntoPatrones);

        //Cargar Fondo
        this.imagenFondo = this.add.tileSprite(0,0,this.mapaNivel.
        widthInPixels, this.mapaNivel.heightInPixels, Constantes.
        FONDOS.NIVEL1).setOrigin(0,0).setDepth(-1);

    }

    update(): void{
        //mover el fondo
        this.imagenFondo.tilePositionY -= 0.8;

        if (parseInt(this.registry.get(Constantes.REGISTRO.VIDAS)) === 0){
            this.scene.stop(Constantes.ESCENAS.NIVEL1);
            this.scene.stop(Constantes.ESCENAS.HUD);
            this.scene.start(Constantes.ESCENAS.MENU);
        }


    }
}