class Companion extends Objeto {
  constructor(x, y, juego, nro) {
    super(x, y, 3, juego);
    this.velocidadMaximaOriginal = 3;
    this.juego = juego;
    this.grid = juego.grid;
    this.juego.gameContainer.addChild(this.container);
    this.nro = nro;


    this.cargarVariosSpritesAnimados(
      {
        idle: "./img/companion_idle.png",
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
  disparar() {
    if (this.juego.player.balas > 0 && !this.juego.player.recargando && !this.juego.player.delayDisparo) {
      let angulo = Math.atan2(
        this.juego.mouse.x - this.app.stage.x - this.container.x,
        this.juego.mouse.y - this.app.stage.y - this.container.y
      );
      this.juego.balas.push(
        new Bala(
          this.container.x,
          this.container.y,
          this.juego,
          Math.sin(angulo),
          Math.cos(angulo)
        )
      );

      this.velocidad.x = 0;
      this.velocidad.y = 0;
    }
  }

  update() {
    if (!this.listo) return;
    //this.cambiarSprite("idle");
    this.companionBounce(this.juego.contadorDeFrames, { x: this.juego.player.container.x, y: this.juego.player.container.y });
    super.update();
  }

  companionBounce(frame, player) { //hace que el compañero gire al rededor del Player
    let frames = frame;
    let playerPos = player;
    const radius = 70; // Radio
    const speed = 0.01; //Velocidad
    var currentCompanions 
    var sequence 

    //cmabia el angulo de los compañeros dependiendo de su cantidad
    currentCompanions= this.juego.companions.length;
    sequence=270/currentCompanions*(this.nro);
    
    // Calcular la nueva posición usando trigonometría (gracias chatgpt)
    const angle = frames * speed;
    this.container.x = playerPos.x + Math.cos(angle + sequence) * radius;
    this.container.y = playerPos.y + Math.sin(angle + sequence) * radius;
  }
}
