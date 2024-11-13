//Setear enemigos nuevos una sola vez en instancias especificas para que precargue los datos.
const configuracionEnemigos = {
  tipo1: {
    vida: 1,
    velocidad: 0.7,
    velocidadSprite: 1,
    spriteX: 32,
    spriteY: 32,
    scale: (1, 1),
    sprites: {
      idle: "./img/isacc_idle.png",
      morir: "./img/isacc_muerte.png",
    },
    habilidad: {
      rango: 99999,
    },
  },
  tipo2: {
    vida: 1,
    velocidad: 2,
    velocidadSprite: 1,
    spriteX: 64,
    spriteY: 64,
    scale: (0.1, 0.8),
    sprites: {
      idle: "./img/perrito_run.png",
      morir: "./img/perrito_muerte.png",
    },
    habilidad: {
      rango: 99999,
    },
  },
  tipo3: {
    vida: 6,
    velocidad: 0.4,
    velocidadSprite: 1,
    spriteX: 64,
    spriteY: 64,
    scale: (1, 1),
    sprites: {
      idle: "./img/cabezon_run.png",
      morir: "./img/cabezon_muerte.png",
    },
    habilidad: {
      rango: 99999,
    },
  },
  tipo4: { // sprinter
    vida: 6,
    velocidad: 0.9,
    velocidadSprite: 0.7,
    spriteX: 64,
    spriteY: 112,
    scale: (1, 1),
    sprites: {
      idle: "./img/miniboss2_run.png",
      morir: "./img/miniboss2_habilidad.png",
    },
    habilidad: {
      duracion: 0,
      velocidadSprint: 0,
      rango: 600,
    },
  },
  tipo5: { // shooter
    vida: 5,
    velocidad: 1,
    velocidadSprite: 0.7,
    spriteX: 96,
    spriteY: 104,
    scale: (1, 1),
    sprites: {
      idle: "./img/miniboss1_run.png",
      morir: "./img/miniboss1_muerte.png",
    },
    habilidad: {
      cantidad: 8, // Número de balas a disparar
      rango: 400,  // Distancia máxima de disparo
      velocidad: 1  // Velocidad de las balas
    },
  },
  tipo6: { // shooter
    vida: 5,
    velocidad: 1,
    velocidadSprite: 0.7,
    spriteX: 48,
    spriteY: 64,
    scale: (1, 1),
    sprites: {
      idle: "./img/miniboss3_run.png",
      morir: "./img/miniboss3_muerte.png",
    },
    habilidad: {
      cantidad: 4, // Número de balas a disparar
      rango: 400,  // Distancia máxima de disparo
      velocidad: 1  // Velocidad de las balas
    },
  }
};

class Enemigo extends Objeto {
  constructor(x, y, velocidad, juego, id, tipo) {
    const config = configuracionEnemigos[tipo];
    super(x, y, config.velocidad, juego);
    this.equipoParaUpdate = Math.floor(Math.random() * 9) + 1;
    this.velocidadConfig = config.velocidad;
    this.juego = juego;
    this.grid = juego.grid;
    this.vision = 9999 + Math.floor(Math.random() * 150);
    this.vida = config.vida;
    this.debug = 0;
    this.tiempoPostMorten = 3000;
    this.nombre = id;
    this.tipo = tipo;
    this.container.scale.set(config.scale);
    //variables miniboss
    this.duracionPowerUp = 2; //FRAMES
    this.potenciaPowerUp = 2;
    this.timer = this.duracionPowerUp;
    this.habilidadActivo = false;

    //disparo
    this.timerDisparo = 0;
    this.duracionDisparo = 1750;



    this.cargarVariosSpritesAnimados(
      {
        idle: config.sprites.idle,
        morir: config.sprites.morir,
      },
      config.spriteX,
      config.spriteY,
      config.velocidadSprite * 0.1,

      (e) => {
        this.listo = true;
        this.cambiarSprite("idle");
      }

    );
    this.estados = { IDLE: 0, YENDO_AL_PLAYER: 1, ATACANDO: 2, SPRINTANDO: 3 };
    this.estado = this.estados.IDLE;

    this.juego.gameContainer.addChild(this.container);
  }


  habilitarHabilidad() {
    setTimeout(() => {
      this.habilidadActivo = false;
    }, 1000);
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
      console.log("el miniboss es " + this.juego.miniBossCreado)
      if (this.juego.miniBossCreado) {
        this.juego.ponerEnemigos(1);
      } else {
        this.juego.ponerEnemigos(Math.floor(Math.random() * 3) + 1);
      }
      if (this.tipo === 'tipo4' || this.tipo === 'tipo5' || this.tipo === 'tipo6') {
        this.juego.miniBossCreado = false;
      }
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

    const distanciaAlPlayer = calculoDeDistanciaRapido(
      this.container.x,
      this.container.y,
      this.juego.player.container.x,
      this.juego.player.container.y
    );

    const distanciaHabilidad = configuracionEnemigos[this.tipo].habilidad.rango;
    if (distanciaAlPlayer < distanciaHabilidad) {
      this.velocidadMax = this.velocidadConfig;
      this.habilidad();
    }



    if (this.estado == this.estados.YENDO_AL_PLAYER) {
      vecAtraccionAlPlayer = this.atraccionAlJugador();
      this.cambiarSprite("idle");
    } else if (this.estado == this.estados.IDLE) {
      vecAlineacion = this.alineacion(this.vecinos);
      vecCohesion = this.cohesion(this.vecinos);

      this.cambiarSprite("idle");
    } else if (this.estado === this.estados.SPRINTANDO) {
      this.velocidadMax = this.potenciaPowerUp;
      this.timer--;
      console.log(this.timer);
      // Si se acaba el timer, cambiamos el estado a NORMAL.
      if (this.timer == 0) {
        this.timer = this.duracionPowerUp;
        this.estado = this.estado.IDLE;
        this.velocidadMax = this.velocidadConfig;
        console.log("Se acabo power up!");
        return;
      }

    }
    if (
      this.estado == this.estados.IDLE ||
      this.estado == this.estados.YENDO_AL_PLAYER ||
      this.estado === this.estados.SPRINTANDO
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
      this.juego.hud.actualizarHudVida();
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

  habilidad() {
    //hacer que el enemigo base gruña con un sonido agregar despues
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
  repulsionAlJugador() {
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

  crearPowerUp(){
    this.juego.powerUps.push(
      new CapturedCompanion(
        this.container.x,
        this.container.y,
        this.juego
      )
    );
  }
}

class MiniBossSprinter extends Enemigo {
  constructor(x, y, velocidad, juego, id, tipo) {
    super(x, y, velocidad, juego, id, tipo);
    this.duracionPowerUp = 2; //FRAMES
    this.potenciaPowerUp = 2;
    this.timer = this.duracionPowerUp;
    this.habilidadActivo = false;
  }
  
  habilidad() {
    if (!this.habilidadActivo) {
      const config = configuracionEnemigos[this.tipo].habilidad;
      this.habilidadActivo = true;
      console.log("habilidadActiva " + this.habilidadActivo);
      this.velocidadSprint = config.velocidadSprint;
      this.estado = this.estados.SPRINTANDO;
      this.sprintStartTime = Date.now();
      setTimeout(() => {
        this.habilidadActivo = false;
        console.log("habilidadActiva " + this.habilidadActivo);
      }, 2000);
    }
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
      console.log("el miniboss es " + this.juego.miniBossCreado)
      if (this.juego.miniBossCreado) {
        this.juego.ponerEnemigos(1);
      } else {
        this.juego.ponerEnemigos(Math.floor(Math.random() * 3) + 1);
      }
      if (this.tipo === 'tipo4' || this.tipo === 'tipo5' || this.tipo === 'tipo6') {
        this.juego.miniBossCreado = false;
      }
      //this.juego.hud.actualizarBalas();
      setTimeout(() => {
        this.desaparecer();
      }, this.tiempoPostMorten);
    }
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
      console.log("el miniboss es " + this.juego.miniBossCreado)
      if (this.juego.miniBossCreado) {
        this.juego.ponerEnemigos(1);
      } else {
        this.juego.ponerEnemigos(Math.floor(Math.random() * 3) + 1);
      }
      if (this.tipo === 'tipo4' || this.tipo === 'tipo5' || this.tipo === 'tipo6') {
        this.juego.miniBossCreado = false;
      }
      //this.juego.hud.actualizarBalas();
      setTimeout(() => {
        this.desaparecer();
      }, this.tiempoPostMorten);

      //this.juego.player.ponerCompanion();

      this.crearPowerUp();
      // sprite.animationSpeed=0.001

    } else {
      //let sprite = this.cambiarSprite("recibeTiro", 0, false);
    }
  
  }

}

class MiniBossShooter extends Enemigo {
  constructor(x, y, velocidad, juego, id, tipo) {
    super(x, y, velocidad, juego, id, tipo);
    this.duracionPowerUp = 2; //FRAMES
    this.potenciaPowerUp = 2;
    this.timer = this.duracionPowerUp;
    this.habilidadActivo = false;

    //disparo
    this.timerDisparo = 0;
    this.duracionDisparo = 1750;
  }

  habilidad() {
    if (!this.habilidadActivo) {
      this.habilidadActivo = true;
      this.estado = this.estados.DISPARANDO;

      this.disparar();

      setTimeout(() => {
        this.habilitarHabilidad();
        this.estado = this.estados.IDLE;
        console.log("Habilidad de disparo desactivada");
      }, this.duracionDisparo);
    }
  }

  disparar() {
    const config = configuracionEnemigos[this.tipo].habilidad;
    const cantidad = config.cantidad;
    const rango = config.rango;
    const velocidad = config.velocidad;

    if (!this.juego) {
      console.error("Error: this.juego no está definido.");
      return;
    }

    // Disparar balas en 6 direcciones
    for (let i = 0; i < cantidad; i++) {
      const angulo = (Math.PI * 2 / cantidad) * i;
      //angulo + 40 = x , angulo sin sumar = +
      const velocidadX = Math.cos(angulo) * velocidad;
      const velocidadY = Math.sin(angulo) * velocidad;

      const bala = new BalaEnemigo(this.container.x, this.container.y, this.juego, velocidadX, velocidadY, rango);
      this.juego.balasEnemigos.push(bala);
    }
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
      console.log("el miniboss es " + this.juego.miniBossCreado)
      if (this.juego.miniBossCreado) {
        this.juego.ponerEnemigos(1);
      } else {
        this.juego.ponerEnemigos(Math.floor(Math.random() * 3) + 1);
      }
      if (this.tipo === 'tipo4' || this.tipo === 'tipo5' || this.tipo === 'tipo6') {
        this.juego.miniBossCreado = false;
      }
      //this.juego.hud.actualizarBalas();
      setTimeout(() => {
        this.desaparecer();
      }, this.tiempoPostMorten);

      //this.juego.player.ponerCompanion();

      this.crearPowerUp();
      // sprite.animationSpeed=0.001

    } else {
      //let sprite = this.cambiarSprite("recibeTiro", 0, false);
    }
    
  }
}
class MiniBossShooterX extends Enemigo {
  constructor(x, y, velocidad, juego, id, tipo) {
    super(x, y, velocidad, juego, id, tipo);
    this.duracionPowerUp = 2; //FRAMES
    this.potenciaPowerUp = 2;
    this.timer = this.duracionPowerUp;
    this.habilidadActivo = false;

    //disparo
    this.timerDisparo = 0;
    this.duracionDisparo = 1750;

  }

  habilidad() {
    if (!this.habilidadActivo) {
      this.habilidadActivo = true;
      this.estado = this.estados.DISPARANDO;

      this.disparar();

      setTimeout(() => {
        this.estado = this.estados.IDLE;
        console.log("Habilidad de disparo desactivada");
      }, this.duracionDisparo);
    }
  }

  disparar() {
    const config = configuracionEnemigos[this.tipo].habilidad;
    const cantidad = config.cantidad;
    const rango = config.rango;
    const velocidad = config.velocidad;

    if (!this.juego) {
      console.error("Error: this.juego no está definido.");
      return;
    }

    this.disparaBala(0, cantidad, rango, velocidad);
    setTimeout(() => {
      this.disparaBala(40, cantidad, rango, velocidad);
      this.habilitarHabilidad();
    }, 1000);
  }

  disparaBala(x, cantidad, rango, velocidad) {
    for (let i = 0; i < cantidad; i++) {
      const angulo = (Math.PI * 2 / cantidad) * i;
      //angulo + 40 = x , angulo sin sumar = +
      const velocidadX = Math.cos(angulo + x) * velocidad;
      const velocidadY = Math.sin(angulo + x) * velocidad;

      const bala = new BalaEnemigo(this.container.x, this.container.y, this.juego, velocidadX, velocidadY, rango);
      this.juego.balasEnemigos.push(bala);
    }
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
      console.log("el miniboss es " + this.juego.miniBossCreado)
      if (this.juego.miniBossCreado) {
        this.juego.ponerEnemigos(1);
      } else {
        this.juego.ponerEnemigos(Math.floor(Math.random() * 3) + 1);
      }
      if (this.tipo === 'tipo4' || this.tipo === 'tipo5' || this.tipo === 'tipo6') {
        this.juego.miniBossCreado = false;
      }
      //this.juego.hud.actualizarBalas();
      setTimeout(() => {
        this.desaparecer();
      }, this.tiempoPostMorten);

      this.crearPowerUp();
      // sprite.animationSpeed=0.001

    } else {
      //let sprite = this.cambiarSprite("recibeTiro", 0, false);
    }
    
  }
}
