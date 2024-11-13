class CapturedCompanion extends Objeto{
    constructor(x,y,juego){
        super(x,y,0,juego);
        this.juego = juego;
        this.equipoParaUpdate = Math.floor(Math.random() * 9) + 1;
        this.grid = juego.grid;
        this.sprite = new PIXI.Sprite();
        this.sprite.texture = PIXI.Texture.from("img/capturedCompanion.png");
        this.container.addChild(this.sprite);

        this.juego.app.stage.addChild(this.container);
    }

    update(){
        if (this.juego.contadorDeFrames % this.equipoParaUpdate == 0){
            this.vecinos = this.obtenerVecinos();
            if(this.vecinos.includes(this.juego.player)){
                this.juego.powerUps = this.juego.powerUps.filter((k) => k != this);
                this.borrar();
                this.juego.ponerCompanion();
            }
        }
    }
    borrar(){
        this.juego.app.stage.removeChild(this.container);
        this.grid.remove(this);
    }
    


    
}
