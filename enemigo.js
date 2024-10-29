// Enemigo.js

// Asegúrate de que el archivo utils.js esté incluido en tu index.html antes de este script

class Enemigo extends Objeto {
  constructor(x, y, velocidad, juego) {
    super(x, y, velocidad, juego);
    this.equipoParaUpdate = Math.floor(Math.random() * 9) + 1;
    this.juego = juego;
    this.grid = juego.grid; // Referencia a la grid
    this.vision = 9999 + Math.floor(Math.random() * 150); //en pixels
    this.vida = 4;
    this.debug = 0;
    this.tiempoPostMorten = 3000;
    

    this.cargarVariosSpritesAnimados(
      {
        idle: "./img/isacc_idle.png",
        //ataque1: "./img/zombie_attack_1.png",
        //ataque2: "./img/zombie_attack_2.png",
        //ataque3: "./img/zombie_attack_3.png",
        morir: "./img/isacc_muerte.png",
        //recibeTiro: "./img/zombie_hurt.png",
      },
      32,
      32,
      velocidad * 0.5,
      (e) => {
        this.listo = true;
        this.cambiarSprite("idle");
      }
    );

    this.estados = { IDLE: 0, YENDO_AL_PLAYER: 1, ATACANDO: 2 };
    this.estado = this.estados.IDLE;
  }

  recibirTiro() {
    this.vida -= 1;
    if (this.vida <= 0) {
      this.juego.enemigos = this.juego.enemigos.filter((k) => k != this);
      //this.aumentarRangoEnemigos();
      //this.juego.hud.actualizarHud();
      this.grid.remove(this);
      let sprite = this.cambiarSprite("morir", 0, false);
      this.velocidad.x = 0;
      this.velocidad.y = 0;
      this.juego.player.asesinatos += 1;
      this.juego.player.puntaje += 2;
      this.juego.hud.actualizarHud();
      setTimeout(() => {
        this.desaparecer();
        }, this.tiempoPostMorten);
      // sprite.animationSpeed=0.001
    } else {
      //let sprite = this.cambiarSprite("recibeTiro", 0, false);
    }
  }

  mirarAlrededor() {
    this.vecinos = this.obtenerVecinos();
    this.celdasVecinas = this.miCeldaActual.obtenerCeldasVecinas();
    this.estoyViendoAlPlayer = this.evaluarSiEstoyViendoAlPlayer();
    this.tengoDeVecinoAlPlayer = false;
    this.estoyTocandoAlPlayer = false;

    if (this.estoyViendoAlPlayer) {
      this.tengoDeVecinoAlPlayer = this.vecinos.includes(this.juego.player);
    }

    if (this.tengoDeVecinoAlPlayer) {
      this.distanciaAlPlayer = calculoDeDistanciaRapido(
        this.container.x,
        this.container.y,
        this.juego.player.container.x,
        this.juego.player.container.y
      );
      if (this.distanciaAlPlayer < this.juego.grid.cellSize) {
        this.estoyTocandoAlPlayer = true;
      }
    } else {
      this.distanciaAlPlayer = null;
    }
  }

  hacerCosasSegunEstado() {
    let vecAtraccionAlPlayer,
      vecSeparacion,
      vecAlineacion,
      vecCohesion,
      bordes;

    let sumaDeVectores = new PIXI.Point(0, 0);

    bordes = this.ajustarPorBordes();

    if (this.estado == this.estados.YENDO_AL_PLAYER) {
      vecAtraccionAlPlayer = this.atraccionAlJugador();
      this.cambiarSprite("idle");
    } else if (this.estado == this.estados.IDLE) {
      vecAlineacion = this.alineacion(this.vecinos);
      vecCohesion = this.cohesion(this.vecinos);

      this.cambiarSprite("idle");
    }

    if (
      this.estado == this.estados.IDLE ||
      this.estado == this.estados.YENDO_AL_PLAYER
    ) {
      vecSeparacion = this.separacion(this.vecinos);

      sumaDeVectores.x += (vecSeparacion || {}).x || 0;
      sumaDeVectores.x += (vecAlineacion || {}).x || 0;
      sumaDeVectores.x += (vecCohesion || {}).x || 0;
      sumaDeVectores.x += (vecAtraccionAlPlayer || {}).x || 0;
      sumaDeVectores.x += (bordes || {}).x || 0;


      sumaDeVectores.y += (vecSeparacion || {}).y || 0;
      sumaDeVectores.y += (vecAlineacion || {}).y || 0;
      sumaDeVectores.y += (vecCohesion || {}).y || 0;
      sumaDeVectores.y += (vecAtraccionAlPlayer || {}).y || 0;
      sumaDeVectores.y += (bordes || {}).y || 0;


      this.aplicarFuerza(sumaDeVectores);
    }

    if (this.estado == this.estados.ATACANDO) {
      this.velocidad.x = 0;
      this.velocidad.y = 0;
      //this.juego.player.vidas -= 1;
      this.juego.player.status.damage(1);
      console.log("player vida" + this.juego.player.vidas);
      this.juego.hud.actualizarHudVida()
      vecAtraccionAlPlayer = this.repulsionAlJugador();
      setTimeout(() => {
        vecAtraccionAlPlayer = this.atraccionAlJugador()
      }, 4000);
      //this.atacar();
    }
  }
  
  update() {
    if (!this.listo) return;
    if (this.juego.contadorDeFrames % this.equipoParaUpdate == 0) {
      this.mirarAlrededor();
      this.segunDatosCambiarDeEstado();
      this.hacerCosasSegunEstado();
    }
    super.update();
  }

  segunDatosCambiarDeEstado() {
    if (this.estoyTocandoAlPlayer) {
      this.estado = this.estados.ATACANDO;
    } else if (this.estoyViendoAlPlayer) {
      this.estado = this.estados.YENDO_AL_PLAYER;
    } else {
      this.estado = this.estados.IDLE;
    }
  }

  atacar() {
    if (this.spriteActual.startsWith("ataque")) return;
    this.cambiarSprite(
      "ataque" + (Math.floor(Math.random() * 2) + 1).toString()
    );
  }

  desaparecer() {
    if (this.container && this.container.parent) {
      this.container.parent.removeChild(this.container);
    }
  }


  evaluarSiEstoyViendoAlPlayer() {
    const distanciaCuadrada = distanciaAlCuadrado(
      this.container.x,
      this.container.y,
      this.juego.player.container.x,
      this.juego.player.container.y
    );

    if (distanciaCuadrada < this.vision ** 2) {
      return true;
    }
    return false;
  }

  atraccionAlJugador() {
    const vecDistancia = new PIXI.Point(
      this.juego.player.container.x - this.container.x,
      this.juego.player.container.y - this.container.y
    );

    let vecNormalizado = normalizarVector(vecDistancia.x, vecDistancia.y);

    vecDistancia.x = vecNormalizado.x;
    vecDistancia.y = vecNormalizado.y;
    return vecDistancia;
  }
  repulsionAlJugador(){
    const vecDistancia = new PIXI.Point(
      this.juego.player.container.x - this.container.x,
      this.juego.player.container.y - this.container.y
    );

    let vecNormalizado = normalizarVector(vecDistancia.x, vecDistancia.y);

    vecDistancia.x = -vecNormalizado.x;
    vecDistancia.y = -vecNormalizado.y;
    return vecDistancia;
  }

  cohesion(vecinos) {
    const vecPromedio = new PIXI.Point(0, 0);
    let total = 0;

    vecinos.forEach((enemigo) => {
      vecPromedio.x += enemigo.container.x;
      vecPromedio.y += enemigo.container.y;
      total++;
    });

    if (total > 0) {
      vecPromedio.x /= total;
      vecPromedio.y /= total;

      vecPromedio.x = vecPromedio.x - this.container.x;
      vecPromedio.y = vecPromedio.y - this.container.y;

      vecPromedio.x *= 0.02;
      vecPromedio.y *= 0.02;
    }

    return vecPromedio;
  }

  separacion(vecinos) {
    const vecFuerza = new PIXI.Point(0, 0);

    vecinos.forEach((enemigo) => {
      const distancia = distanciaAlCuadrado(
        this.container.x,
        this.container.y,
        enemigo.container.x,
        enemigo.container.y
      );

      const dif = new PIXI.Point(
        this.container.x - enemigo.container.x,
        this.container.y - enemigo.container.y
      );
      dif.x /= distancia;
      dif.y /= distancia;
      vecFuerza.x += dif.x;
      vecFuerza.y += dif.y;
    });

    vecFuerza.x *= 10;
    vecFuerza.y *= 10;
    return vecFuerza;
  }

  alineacion(vecinos) {
    const vecPromedio = new PIXI.Point(0, 0);
    let total = 0;

    vecinos.forEach((enemigo) => {
      vecPromedio.x += enemigo.velocidad.x;
      vecPromedio.y += enemigo.velocidad.y;
      total++;
    });

    if (total > 0) {
      vecPromedio.x /= total;
      vecPromedio.y /= total;

      vecPromedio.x *= 0.2;
      vecPromedio.y *= 0.2;
    }

    return vecPromedio;
  }
  ajustarPorBordes() {
    let fuerza = new PIXI.Point(0, 0);

    if (this.container.x < 50) {
      this.container.x = 0;
      fuerza.x = 0;
    }
    if (this.container.x > this.juego.canvaswidth - 50) {
      this.container.x = this.juego.canvaswidth;
      fuerza.x = 0;
    }

    // Limita la posición del enemigo en el eje Y
    if (this.container.y < 200) {
      this.container.y = 0;
      fuerza.y = 0;
    }
    if (this.container.y > this.juego.canvasHeight - 50) {
      this.container.y = this.juego.canvasHeight;
      fuerza.y = 0;
    }

    return fuerza;
  }

  /*ajustarPorBordes() {
    let fuerza = new PIXI.Point(0, 0);

    if (this.container.x < 0) fuerza.x = -this.container.x;
    if (this.container.y < 0) fuerza.y = -this.container.y;
    if (this.container.x > this.juego.canvaswidth)
      fuerza.x = -(this.container.x - this.juego.canvaswidth);
    if (this.container.y > this.juego.canvasHeight)
      fuerza.y = -(this.container.y - this.juego.canvasHeight);

    // if(this.debug)console.log(fuerza)
    return fuerza;
  }*/

}
