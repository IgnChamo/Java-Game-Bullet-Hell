// Zombie.js

// Asegúrate de que el archivo utils.js esté incluido en tu index.html antes de este script

class Bala extends Objeto {
  constructor(x, y, juego, velX, velY,perforacion,maxPerforaciones) {
    super(x, y, 20, juego);
    this.velocidad.x = velX;
    this.velocidad.y = velY;

    this.juego = juego;
    this.grid = juego.grid; // Referencia a la grid
    this.vision = 2;
    // Cargar la textura del sprite desde el <img>
    this.cargarVariosSpritesAnimados(
      {
        idle: "./img/bala.png",
        explotar: "./img/balaExplosion.png"
      },
      10,
      10,
      0.1,
      (e) => {
        this.listo = true;
        this.cambiarSprite("idle");
      }
    );
    //this.container.addChild(this.sprite);


    this.perforacion = perforacion;
    this.perforados = 0;
    this.maxPerforaciones = maxPerforaciones;
    

    this.juego.gameContainer.addChild(this.container);
  }

  update() {
    super.update();

    if (
      this.container.x < 0 ||
      this.container.y > this.juego.canvasHeight ||
      this.container.y < 0 ||
      this.container.x > this.juego.canvasWidth 
    ) {
      this.borrar();
      this.juego.gameContainer.removeChild(this.container);
    }
      this.colision();
    
  } 
  colision(){
    let objs = Object.values(
      (this.miCeldaActual || {}).objetosAca || {}
    ).filter((k) => k instanceof Enemigo);
    if (objs.length > 0) {
      let elEnemigoMasCercano;
      let distMin = 99999;
      let cual = null;
      for (let i = 0; i < objs.length; i++) {
        let dist = calculoDeDistanciaRapido(
          this.container.x,
          this.container.y,
          objs[i].container.x,
          objs[i].container.y
        );
        if (dist < distMin) {
          distMin = dist;
          cual = i;
        }
      } //for

      if (cual != null) {
        objs[cual].recibirTiro();
        this.perforados ++;
        if(this.perforados > this.maxPerforaciones && this.perforacion){
          this.activarAnimacionExplotar();
        }else if(!this.perforacion){
          this.activarAnimacionExplotar();
        }
      }
    } 
  }
  activarAnimacionExplotar() {
    //this.cambiarSprite("explotar"); 
    //const duracionAnimacion = 500;
    this.velocidad.x = 0;
    this.velocidad.y = 0;
    this.borrar();
    this.juego.gameContainer.removeChild(this.container);
    //setTimeout(() => {
    //}, duracionAnimacion);
}
}


class BalaEnemigo extends Objeto {
  constructor(x, y, juego, velX, velY,perforacion,maxPerforaciones) {
    super(x, y, 20, juego);
    this.velocidad.x = velX;
    this.velocidad.y = velY;

    this.juego = juego;
    this.grid = juego.grid; // Referencia a la grid
    this.vision = 2;
    // Cargar la textura del sprite desde el <img>
    this.cargarVariosSpritesAnimados(
      {
        idle: "./img/bala.png"
      },
      10,
      10,
      0.1,
      (e) => {
        this.listo = true;
        this.cambiarSprite("idle");
      }
    );
    //this.container.addChild(this.sprite);


    this.perforacion = perforacion;
    this.perforados = 0;
    this.maxPerforaciones = maxPerforaciones;

    this.juego.gameContainer.addChild(this.container);
  }

  update() {
    super.update();

    if (
      this.container.x < 0 ||
      this.container.y > this.juego.canvasHeight ||
      this.container.y < 0 ||
      this.container.x > this.juego.canvasWidth 
    ) {
      this.borrar();
      this.juego.gameContainer.removeChild(this.container);
    }
      this.colision();
    
  } 
  colision(){
    let objs = Object.values(
      (this.miCeldaActual || {}).objetosAca || {}
    ).filter((k) => k instanceof Player);
    if (objs.length > 0) {
      let elEnemigoMasCercano;
      let distMin = 99999;
      let cual = null;
      for (let i = 0; i < objs.length; i++) {
        let dist = calculoDeDistanciaRapido(
          this.container.x,
          this.container.y,
          objs[i].container.x,
          objs[i].container.y
        );
        if (dist < distMin) {
          distMin = dist;
          cual = i;
        }
      } //for

      if (cual != null && this.juego.player.status != this.juego.player.invincible) {
        objs[cual].status.damage(1);
        this.juego.hud.actualizarHudVida();
        this.borrar();
        this.juego.gameContainer.removeChild(this.container);
      }
    } 
  }
}