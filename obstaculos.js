class Obstaculos extends Objeto{
    constructor(x,y,juego){
        super(x,y,0,juego);
        this.juego = juego;
        this.equipoParaUpdate = Math.floor(Math.random() * 9) + 1;
        this.grid = juego.grid;
        this.sprite = new PIXI.Sprite();
        this.sprite.texture = PIXI.Texture.from("img/rocks.png");
        this.container.addChild(this.sprite);
        this.radio = this.sprite.width * this.grid.cellSize * 1.2;
        this.sprite.anchor.set(0.5,0.50);

        this.juego.gameContainer.addChild(this.container);

       
    }
    
}