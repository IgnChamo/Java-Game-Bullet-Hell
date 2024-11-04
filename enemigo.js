
const configuracionEnemigos = {
  tipo1: {
    vida: 4,
    velocidad: 0.7,
    velocidadSprite: 1,
    spriteX: 32,
    spriteY: 32,
    scale: (1,1),
    sprites: {
      idle: "./img/isacc_idle.png",
      morir: "./img/isacc_muerte.png",
    },
  },
  tipo2: {
    vida: 2,
    velocidad: 2,
    velocidadSprite: 1,
    spriteX: 64,
    spriteY: 64,
    scale: (0.1,0.8),
    sprites: {
      idle: "./img/perrito_run.png",
      morir: "./img/perrito_muerte.png",
    },
  },
  tipo3: {
    vida: 6,
    velocidad: 0.4,
    velocidadSprite: 1,
    spriteX: 64,
    spriteY: 64,
    scale: (1,1),
    sprites: {
      idle: "./img/cabezon_run.png",
      morir: "./img/cabezon_muerte.png",
    },
  },
};

 class Enemigo extends Objeto {
    constructor(x, y, velocidad, juego, id, tipo) {
      const config = configuracionEnemigos[tipo];
      console.log(config);
      super(x, y, config.velocidad, juego);
      this.equipoParaUpdate = Math.floor(Math.random() * 9) + 1;
      this.juego = juego;
      this.grid = juego.grid;
      this.vision = 9999 + Math.floor(Math.random() * 150);
      this.vida = config.vida;
      this.debug = 0;
      this.tiempoPostMorten = 3000;
      this.nombre = id;
      this.tipo = tipo;
      this.container.scale.set(config.scale); 

      console.log('Velocidad inicial:', config.velocidad);
      this.cargarVariosSpritesAnimados(
        {
          idle: config.sprites.idle,
          morir: config.sprites.morir,
        },
        config.spriteX,
        config.spriteY,
        config.velocidadSprite * 0.1,

        (e) => {
          console.log("Sprites cargados para", this.nombre);
          this.listo = true;
          this.cambiarSprite("idle");
        }
        
      );   
      this.estados = { IDLE: 0, YENDO_AL_PLAYER: 1, ATACANDO: 2 };
      this.estado = this.estados.IDLE;
  
      this.juego.gameContainer.addChild(this.container);
    }

  recibirTiro() {
    this.vida -= 1;
    if (this.vida <= 0) {
      this.juego.enemigos = this.juego.enemigos.filter((k) => k != this);
      //this.juego.hud.actualizarHud();
      this.grid.remove(this);
      let sprite = this.cambiarSprite("morir", 0, false);
      this.velocidad.x = 0;
      this.velocidad.y = 0;
      this.juego.player.asesinatos += 1;
      this.juego.player.puntaje += 2;
      this.juego.hud.actualizarHud();

      this.juego.ponerEnemigos(Math.floor(Math.random() * 10) + 1);
      
      //this.juego.hud.actualizarBalas();
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
      sumaDeVectores.x += (bordes || {}).x || 0;
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
    const margen = 50;

   
    if (this.container.x < margen) {
        this.container.x = margen;
        fuerza.x = 1;
    }
    if (this.container.x > this.juego.canvaswidth - margen) {
        this.container.x = this.juego.canvaswidth - margen;
        fuerza.x = -1;
    }

    if (this.container.y < margen) {
        this.container.y = margen;
        fuerza.y = 1;
    }
    if (this.container.y > this.juego.canvasHeight - margen) {
        this.container.y = this.juego.canvasHeight - margen; 
        fuerza.y = -1; 
    }

    return fuerza;
  }
}
