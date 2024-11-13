// Clase base Objeto
class Objeto {
  static texturasCargadas = {};
  constructor(x, y, velocidadMax, juego) {
    this.id = generarID();
    this.grid = juego.grid;
    this.app = juego.app;
    this.juego = juego;
    this.container = new PIXI.Container();
    this.juego.app.stage.addChild(this.container);
    this.listo = false;
    this.container.x = x;
    this.container.y = y;

    this.velocidad = new PIXI.Point(0, 0);
    this.velocidadMax = velocidadMax;
    this.velocidadMaxCuadrada = velocidadMax * velocidadMax;

    // this.container.anchor.set(0.5,1); // Pivote en el centro

    this.spritesAnimados = {};


  }

  cambiarSprite(cual, numero, loop = true) {
    this.spriteActual = cual;
    let sprite = this.spritesAnimados[cual];
    if (!sprite) return null;
    if (numero != undefined) {
      sprite.gotoAndPlay(numero);
    }
    sprite.loop = loop;
    this.container.removeChildren();
    this.container.addChild(sprite);

    return sprite;
  }

  cargarVariosSpritesAnimados(inObj, w, h, velocidad, cb) {
    let ret = {};
    let keys = Object.keys(inObj);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      this.cargarSpriteAnimado(inObj[key], w, h, velocidad, (spriteAnimado) => {
        ret[key] = spriteAnimado;
        if (Object.keys(ret).length == keys.length) {
          //TERMINO
          this.spritesAnimados = { ...this.spritesAnimados, ...ret };
          if (cb instanceof Function) cb(this.spritesAnimados);
        }
      });
    }
  }

  limpiarCache(url){
    if (PIXI.utils.TextureCache[url]) {
      delete PIXI.utils.TextureCache[url]; // Elimina la textura de la caché
    }
    if (PIXI.utils.BaseTextureCache[url]) {
      delete PIXI.utils.BaseTextureCache[url]; // Elimina el baseTexture de la caché
    }
  }
  cargarSpriteAnimado(url, frameWidth, frameHeight, vel, cb) {
    this.limpiarCache(url);

    // Comprobar si la textura ya está cargada
    if (Objeto.texturasCargadas[url]) {
        const texture = Objeto.texturasCargadas[url];
        this.crearFrames(texture, frameWidth, frameHeight, vel, cb);
    } else {
        const loader = new PIXI.Loader();
        loader.add(url);
        loader.load((loader, resources) => {
            const texture = resources[url].texture;
            Objeto.texturasCargadas[url] = texture; // Almacenar textura en la propiedad estática

            this.crearFrames(texture, frameWidth, frameHeight, vel, cb);
        });
    }
}
  crearFrames(texture, frameWidth, frameHeight, vel, cb) {
    let width = texture.width;
    let height = texture.height;
    let cantFramesX = width / frameWidth;
    let cantFramesY = height / frameHeight;

    const frames = [];
    for (let i = 0; i < cantFramesX; i++) {
        for (let j = 0; j < cantFramesY; j++) {
            const rectangle = new PIXI.Rectangle(
                i * frameWidth,
                j * frameHeight,
                frameWidth,
                frameHeight
            );
            const frame = new PIXI.Texture(texture.baseTexture, rectangle);
            frames.push(frame);
        }
    }

    const animatedSprite = new PIXI.AnimatedSprite(frames);
    animatedSprite.animationSpeed = vel;
    animatedSprite.loop = true;
    animatedSprite.anchor.set(0.5);
    animatedSprite.play();

    if (cb) cb(animatedSprite);
}

  borrar() {
    this.juego.app.stage.removeChild(this.container);
    if (this instanceof Enemigo) {
      this.juego.enemigos = this.juego.enemigos.filter((k) => k != this);
    } else if (this instanceof Bala) {
      this.juego.balas = this.juego.balas.filter((k) => k != this);
    }

    this.grid.remove(this);
  }

  obtenerVecinos() {
    let vecinos = [];
    const cellSize = this.grid.cellSize;
    const xIndex = Math.floor(this.container.x / cellSize);
    const yIndex = Math.floor(this.container.y / cellSize);
    const margen = 1;
    // Revisar celdas adyacentes
    for (let i = -margen; i <= margen; i++) {
      for (let j = -margen; j <= margen; j++) {
        const cell = this.grid.getCell(xIndex + i, yIndex + j);

        if (cell) {
          vecinos = [
            ...vecinos,
            ...Object.values(cell.objetosAca).filter((k) => k != this),
          ];
        }
      }
    }
    return vecinos;
  }
  estoyEnLaMismaCeldaQue(fulano) {
    return (
      fulano.miCeldaActual &&
      this.miCeldaActual &&
      fulano.miCeldaActual == this.miCeldaActual
    );
  }
  normalizarVelocidad() {
    if (this.velocidad.x == 0 && this.velocidad.y == 0) {
      return;
    }

    let magnitud = calculoDeDistanciaRapido(
      0,
      0,
      this.velocidad.x,
      this.velocidad.y
    );

    if (magnitud == 0) return;

    this.velocidad.x /= magnitud;
    this.velocidad.y /= magnitud;

    this.velocidad.x *= this.velocidadMax;
    this.velocidad.y *= this.velocidadMax;
    if (isNaN(this.velocidad.x)) debugger;
  }

  update() {
    this.normalizarVelocidad();

    this.container.x += this.velocidad.x;
    this.container.y += this.velocidad.y;
    // this.actualizarRotacion(); //PARA JUEGOS VISTOS DE ARRIBA
    this.actualizarZIndex();
    this.actualizarLado();
    this.actualizarPosicionEnGrid();
  }
  actualizarPosicionEnGrid() {
    this.grid.update(this);
  }

  repelerObstaculos(vecinos) {
    const vecFuerza = new PIXI.Point(0, 0);
    let cant = 0;
    vecinos.forEach((obstaculo) => {
      if (obstaculo instanceof Obstaculos) {
        const distCuadrada = distanciaAlCuadrado(
          this.container.x,
          this.container.y,
          obstaculo.container.x,
          obstaculo.container.y,
          
        );
        console.log(distCuadrada);
        console.log(obstaculo.radio**2);
        if (distCuadrada < obstaculo.radio ** 2) {
          //SI ESTA A MENOS DE UNA CELDA DE DIST
          const dif = new PIXI.Point(
            this.container.x - obstaculo.container.x,
            this.container.y - obstaculo.container.y
          );
          dif.x /= distCuadrada;
          dif.y /= distCuadrada;
          vecFuerza.x += dif.x;
          vecFuerza.y += dif.y;
          cant++;
        }

      }
    });
    if (cant) {
      vecFuerza.x *= 40;
      vecFuerza.y *= 40;
      // vecFuerza.x += -this.velocidad.x;
      // vecFuerza.y += -this.velocidad.y;
    }
    console.log()
    return vecFuerza;
  }

  aplicarFuerza(fuerza) {
    if (!fuerza) return;
    this.velocidad.x += fuerza.x;
    this.velocidad.y += fuerza.y;

    // Limitar la velocidad máxima
    const velocidadCuadrada =
      this.velocidad.x * this.velocidad.x + this.velocidad.y * this.velocidad.y;
    if (velocidadCuadrada > this.velocidadMaxCuadrada) {
      const magnitud = Math.sqrt(velocidadCuadrada);
      this.velocidad.x = (this.velocidad.x / magnitud) * this.velocidadMax;
      this.velocidad.y = (this.velocidad.y / magnitud) * this.velocidadMax;
    }
  }
  actualizarLado() {
    if (this.velocidad.x > 0) {
      this.container.scale.x = 1;
    } else if (this.velocidad.x < 0) {
      this.container.scale.x = -1;
    } else if (this.velocidad.y == 0 && this instanceof Enemigo) {
      if (this.juego.player.container.x > this.container.x) {
        this.container.scale.x = 1;
      } else {
        this.container.scale.x = -1;
      }
    }
  }
  actualizarZIndex() {
    this.container.zIndex = this.container.y;
  }

  actualizarRotacion() {
    if (this.velocidad.x !== 0 || this.velocidad.y !== 0) {
      const angulo = Math.atan2(this.velocidad.y, this.velocidad.x);
      this.container.rotation = angulo;
    }
  }
}
