import Constantes from '../constantes';

export default class Menu extends Phaser.Scene {
    private width: number;
    private height: number;
    

    constructor(){
        super(Constantes.ESCENAS.MENU);
    }

    init(){
        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;
    }

    create(){
        const logo = this.add.image(this.width /2, 70, 'logo1');

        const jugarTxt: Phaser.GameObjects.Text = this.add.text(50, this.height/2, Constantes.MENU.JUGAR, {fontSize:'32px', color:'#FFFFFF'})
        .setInteractive();

        this.cambiarEscena(jugarTxt, Constantes.ESCENAS.NIVEL1);

    }
    
    /**
     * Cuando se pulse sobre el texto nos va a lleva a la escena indicada
     * @param jugarTxt 
     * @param escena 
     */
    cambiarEscena(jugarTxt: Phaser.GameObjects.Text, escena: string) {
        jugarTxt.on('pointerdown', ()=>{
            this.scene.start(escena);
            this.scene.start(Constantes.ESCENAS.HUD);
            this.scene.bringToTop(Constantes.ESCENAS.HUD);
        });
    }

    

}
