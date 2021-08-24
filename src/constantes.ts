const Constantes = {
    EVENTOS:{
        VIDAS: 'cambiaVidas',
        PUNTUACION: 'cambiaPuntuacion',
        RELOJ: 'reloj'
    },
    MENU:{
        JUGAR: 'JUGAR'
    },
    HUD:{
        VIDAS: 'Vidas:'
    },    
    ESCENAS:{
        CARGA: 'Carga',
        MENU: 'Menu',
        NIVEL1: 'Nivel1',
        HUD: 'HUD'
    },
    REGISTRO:{
        VIDAS: 'vidas',
        PUNTUACION: 'puntuacion',
        RELOJ: 'reloj'
    },
    MAPAS: {
        NIVEL1:{
            TILEMAPJSON: 'mapaNivel1',
            CAPAPLATAFORMAS: 'Plataformas'
        },
        TILESET: 'nivelestileset',
        POSICIONFINAL: 'posicionfinal',
        ENEMIGOS: 'enemigos',
        PLATAFORMASMOVILES: 'plataformasmoviles',
        PLATAFORMAVERTICAL: 'vertical',
        PLATAFORMAHORIZONTAL: 'horizontal'
    },
    FONDOS:{
        NIVEL1: 'Brown'
    },
    FUENTES:{
        JSON: 'fuenteJSON',
        IMAGEN: 'imagenFuente',
        BITMAP: 'fuentePixel'
    },
    JUGADOR:{
        ID: 'jugador',
        ANIMACION: {
            ESPERA: 'idle',
            CORRER: 'run',
            SALTO: 'jump-0'
        }
    },
    OBJETOS:{
        FINAL: 'final',
        PLATAFORMAMOVIL:{
            ID: 'plataformamovil',
            VELOCIDAD: 60
        }
    },
    ENEMIGOS: {
        BUNNY:{
            ID: 'bunny',
            ANIM: 'bunnyCorre',
            VELOCIDAD: 75
        },
        CHICKEN:{
            ID: 'chicken',
            ANIM: 'chickenCorre',
            VELOCIDAD: 100
        },
        MUSHROOM:{
            ID: 'mushroom',
            ANIM: 'mushroomCorre',
            VELOCIDAD: 100
        },
        RADISH:{
            ID: 'radish',
            ANIM: 'radishCorre',
            VELOCIDAD: 75
        }, 
        EXPLOSION: {
            ID: 'explosion',
            ANIM: 'explota'
        }
    }
};
export default Constantes;