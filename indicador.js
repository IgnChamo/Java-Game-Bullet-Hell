class Indicador extends Objeto {
  constructor(x, y, juego) {
    super(x, y, 3, juego);
    this.velocidadMaximaOriginal = 3;
    this.juego = juego;
    this.grid = juego.grid;
    this.container.visible = false;
    this.app.stage.addChild(this.container);

    this.cargarVariosSpritesAnimados(
      {
        idle: "./img/indicador.png",
      },
      16,
      16,
      0.2,
      (e) => {
        this.listo = true;
        this.cambiarSprite("idle");
      }
    );
  }

}
