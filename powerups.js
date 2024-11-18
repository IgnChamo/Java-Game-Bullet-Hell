class BajarCadencia extends Objeto {
    constructor(x, y, juego) {
        super(x, y, 0, juego);
        
        this.juego = juego;
        this.equipoParaUpdate = Math.floor(Math.random() * 9) + 1;
        this.grid = juego.grid;
        this.sprite = new PIXI.Sprite();
        this.sprite.texture = PIXI.Texture.from("img/puCandencia.png");
        this.container.addChild(this.sprite);

        this.juego.app.stage.addChild(this.container);
    }

    update() {
        if (this.juego.contadorDeFrames % this.equipoParaUpdate == 0) {
            this.vecinos = this.obtenerVecinos();
            if (this.vecinos.includes(this.juego.player)) {
                this.juego.powerUps = this.juego.powerUps.filter((k) => k != this);
                this.borrar();
                playSFX(sfx.PICKUP, 5);
                this.juego.player.bajarCadencia();
            }
            this.hover(this.juego.contadorDeFrames)
        }

    }
    borrar() {
        this.juego.app.stage.removeChild(this.container);
        this.grid.remove(this);
    }

    hover(valor) {
        this.sprite.y += Math.sin(valor / 15) * 2;
    }
}
class AumentarBalas extends Objeto {
    constructor(x, y, juego) {
        super(x, y, 0, juego);
        
        this.juego = juego;
        this.equipoParaUpdate = Math.floor(Math.random() * 9) + 1;
        this.grid = juego.grid;
        this.sprite = new PIXI.Sprite();
        this.sprite.texture = PIXI.Texture.from("img/puBalas.png");
        this.container.addChild(this.sprite);

        this.juego.app.stage.addChild(this.container);
    }

    update() {
        if (this.juego.contadorDeFrames % this.equipoParaUpdate == 0) {
            this.vecinos = this.obtenerVecinos();
            if (this.vecinos.includes(this.juego.player)) {
                this.juego.powerUps = this.juego.powerUps.filter((k) => k != this);
                this.borrar();
                playSFX(sfx.PICKUP, 5);
                this.juego.hud.actualizarBalas()
            }
            this.hover(this.juego.contadorDeFrames)
        }

    }
    borrar() {
        this.juego.app.stage.removeChild(this.container);
        this.grid.remove(this);
    }

    hover(valor) {
        this.sprite.y += Math.sin(valor / 15) * 2;
    }
}
class Cura extends Objeto {
    constructor(x, y, juego) {
        super(x, y, 0, juego);
        
        this.juego = juego;
        this.equipoParaUpdate = Math.floor(Math.random() * 9) + 1;
        this.grid = juego.grid;
        this.sprite = new PIXI.Sprite();
        this.sprite.texture = PIXI.Texture.from("img/puCura.png");
        this.container.addChild(this.sprite);

        this.juego.app.stage.addChild(this.container);
    }

    update() {
        if (this.juego.contadorDeFrames % this.equipoParaUpdate == 0) {
            this.vecinos = this.obtenerVecinos();
            if (this.vecinos.includes(this.juego.player)) {
                this.juego.powerUps = this.juego.powerUps.filter((k) => k != this);
                this.borrar();
                playSFX(sfx.PICKUP, 5);
                this.juego.player.curar();
            }
            this.hover(this.juego.contadorDeFrames)
        }

    }
    borrar() {
        this.juego.app.stage.removeChild(this.container);
        this.grid.remove(this);
    }

    hover(valor) {
        this.sprite.y += Math.sin(valor / 15) * 2;
    }
}
class Perforacion extends Objeto {
    constructor(x, y, juego) {
        super(x, y, 0, juego);
        
        this.juego = juego;
        this.equipoParaUpdate = Math.floor(Math.random() * 9) + 1;
        this.grid = juego.grid;
        this.sprite = new PIXI.Sprite();
        this.sprite.texture = PIXI.Texture.from("img/puPerforacion.png");
        this.container.addChild(this.sprite);

        this.juego.app.stage.addChild(this.container);
    }

    update() {
        if (this.juego.contadorDeFrames % this.equipoParaUpdate == 0) {
            this.vecinos = this.obtenerVecinos();
            if (this.vecinos.includes(this.juego.player)) {
                this.juego.powerUps = this.juego.powerUps.filter((k) => k != this);
                this.borrar();
                playSFX(sfx.PICKUP, 5);
                this.juego.player.aumentarPerforacion();
            }
            this.hover(this.juego.contadorDeFrames)
        }

    }
    borrar() {
        this.juego.app.stage.removeChild(this.container);
        this.grid.remove(this);
    }

    hover(valor) {
        this.sprite.y += Math.sin(valor / 15) * 2;
    }
}
class BombaEnemigos extends Objeto {
    constructor(x, y, juego) {
        super(x, y, 0, juego);
        
        this.juego = juego;
        this.equipoParaUpdate = Math.floor(Math.random() * 9) + 1;
        this.grid = juego.grid;
        this.sprite = new PIXI.Sprite();
        this.sprite.texture = PIXI.Texture.from("img/puBomba.png");
        this.container.addChild(this.sprite);

        this.juego.app.stage.addChild(this.container);
    }

    update() {
        if (this.juego.contadorDeFrames % this.equipoParaUpdate == 0) {
            this.vecinos = this.obtenerVecinos();
            if (this.vecinos.includes(this.juego.player)) {
                this.juego.powerUps = this.juego.powerUps.filter((k) => k != this);
                this.borrar();
                playSFX(sfx.PICKUP, 5);
                this.juego.borrarEnemigos();
            }
            this.hover(this.juego.contadorDeFrames)
        }

    }
    borrar() {
        this.juego.app.stage.removeChild(this.container);
        this.grid.remove(this);
    }

    hover(valor) {
        this.sprite.y += Math.sin(valor / 15) * 2;
    }
}
class CapturedCompanion extends Objeto {
    constructor(x, y, juego) {
        super(x, y, 0, juego);
        this.juego = juego;
        this.equipoParaUpdate = Math.floor(Math.random() * 9) + 1;
        this.grid = juego.grid;
        this.sprite = new PIXI.Sprite();
        this.sprite.texture = PIXI.Texture.from("img/capturedCompanion.png");
        this.container.addChild(this.sprite);

        this.juego.app.stage.addChild(this.container);
    }

    update() {
        if (this.juego.contadorDeFrames % this.equipoParaUpdate == 0) {
            this.vecinos = this.obtenerVecinos();
            if (this.vecinos.includes(this.juego.player)) {
                this.juego.powerUps = this.juego.powerUps.filter((k) => k != this);
                this.borrar();
                playSFX(sfx.PICKUP, 5);
                this.juego.ponerCompanion();
            }
            this.hover(this.juego.contadorDeFrames)
        }

    }
    borrar() {
        this.juego.app.stage.removeChild(this.container);
        this.grid.remove(this);
    }

    hover(valor) {
        this.sprite.y += Math.sin(valor / 15) * 2;
    }
}
