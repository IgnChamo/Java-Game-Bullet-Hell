class Player extends Objeto {
  constructor(x, y, juego) {
    super(x, y, 3, juego);
    this.velocidadMaximaOriginal = 2;
    this.juego = juego;
    this.grid = juego.grid;

    this.asesinatos = 0;
    this.puntaje = 0;
    this.balas = 6;
    this.recargando = false;
    this.tiempoRecarga = 1000;

    this.delayDisparo = false;
    this.delayEntreBalas = 500;

    this.cargarVariosSpritesAnimados(
      {
        idle: "./img/player_idle.png",
        correr: "./img/player_run.png",
        subir: "./img/player_up.png",
        bajar: "./img/player_down.png"
      },
      64,
      64,
      0.1,
      (e) => {
        this.listo = true;
        this.cambiarSprite("idle");
      }
    );
    // this.juego.app.stage.addChild(this.sprite);
  }

  disparar() {
    if (this.balas > 0 && !this.recargando && !this.delayDisparo ) {
      let angulo = Math.atan2(
        this.juego.mouse.x - this.app.stage.x - this.container.x,
        this.juego.mouse.y - this.app.stage.y - this.container.y
      );
      this.juego.balas.push(
        new Bala(
          this.container.x,
          this.container.y - 40,
          this.juego,
          Math.sin(angulo),
          Math.cos(angulo)
        )
      );

      this.velocidad.x = 0;
      this.velocidad.y = 0;
      this.balas -= 1;
      console.log("Menos 1 Bala");
      this.juego.hud.actualizarBalas();
      
      this.delayDisparo = true;
      setTimeout(() => {
        this.delayDisparo = false;
      }, this.delayEntreBalas);
    }
  }
  recargar() {
    console.log("Recargando Balas")
    this.recargando = true;
    setTimeout(() => {
      this.balas = 6;
      this.recargando = false;
      console.log("Completado");
      this.juego.hud.actualizarBalas();
    }, this.tiempoRecarga);
  }

  update() {
    if (!this.listo) return;
    this.vecinos = this.obtenerVecinos();

    if (this.juego.keyboard.a && this.container.x > 50) {
      this.velocidad.x = -1;
    } else if (this.juego.keyboard.d && this.container.x < this.juego.canvasWidth - 50) {
      this.velocidad.x = 1;
    } else {
      this.velocidad.x = 0;
    }

    if (this.juego.keyboard.w && this.container.y > 200) {
      this.velocidad.y = -1;
    } else if (this.juego.keyboard.s && this.container.y < this.juego.canvasHeight - 50) {
      this.velocidad.y = 1;
    } else {
      this.velocidad.y = 0;
    }

    let cantidadDeObjetosEnMiCelda = Object.keys(
      (this.miCeldaActual || {}).objetosAca || {}
    ).length;

    if (cantidadDeObjetosEnMiCelda > 3) {
      let cant = cantidadDeObjetosEnMiCelda - 3;
      this.velocidadMax = this.velocidadMaximaOriginal * (0.3 + 0.7 / cant);
    } else {
      this.velocidadMax = this.velocidadMaximaOriginal;
    }

    //cambio de animaciones

    if (this.velocidad.y < 0) {
      this.cambiarSprite("subir");
    } else if (this.velocidad.y > 0) {
      this.cambiarSprite("bajar");
    } else if (Math.abs(this.velocidad.x) > 0) {
      this.cambiarSprite("correr");
    } else {
      this.cambiarSprite("idle");
    }
    super.update();
  }

  atraccionAlMouse(mouse) {
    if (!mouse) return null;
    const vecMouse = new PIXI.Point(
      mouse.x - this.container.x,
      mouse.y - this.container.y
    );
    const distanciaCuadrada = distanciaAlCuadrado(
      this.container.x,
      this.container.y,
      mouse.x,
      mouse.y
    );

    if (distanciaCuadrada < 100 * 100) {
      vecMouse.x *= 0.2; // Intensidad de atracción al mouse
      vecMouse.y *= 0.2;
      return vecMouse;
    }

    return null;
  }
}
