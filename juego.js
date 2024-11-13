// Clase Juego
class Juego {
  constructor() {
    this.pausa = false;
    this.canvasWidth = window.innerWidth * 2;
    this.canvasHeight = window.innerHeight * 2;
    this.app = new PIXI.Application({
      width: this.canvasWidth,
      height: this.canvasHeight,
      resizeTo: window,
      backgroundColor: 0x1099bb,
    });
    document.body.appendChild(this.app.view);

    this.gameContainer = new PIXI.Container();
    this.hudContainer = new PIXI.Container();
    this.app.stage.addChild(this.gameContainer);
    this.app.stage.addChild(this.hudContainer);
    this.hud = new HUD(this);

    this.gridActualizacionIntervalo = 10; // Cada 10 frames
    this.contadorDeFrames = 0;
    this.grid = new Grid(50, this); // Tamaño de celda 50
    this.enemigos = [];
    this.balas = [];
    this.balasTotales = 6;

    this.balasEnemigos = [];

    this.companions = [];

    this.obstaculos = [];

    this.powerUps = [];
    this.start = true;
    this.nivel = 1;
    this.miniBossCreado = false;
    this.boss = false; // Se pondra en True cuando aparezca el boss, esto no dejara que se sigan creando enemigos en esa etapa.
    this.perdiste = false;


    this.keyboard = {};

    this.app.stage.sortableChildren = true;

    this.ponerFondo();
    this.ponerProtagonista();
    this.ponerIndicador();
    this.ponerObstaculos(1000);

    //this.iniciarEnemigos();
    this.ponerListeners();

    setTimeout(() => {
      this.app.ticker.add(this.actualizar.bind(this));
      window.__PIXI_APP__ = this.app;
    }, 100);
  }
  ponerFondo() {
    // Crear un patrón a partir de una imagen
    PIXI.Texture.fromURL("./img/bg.png").then((patternTexture) => {
      // Crear un sprite con la textura del patrón
      this.backgroundSprite = new PIXI.TilingSprite(patternTexture, 5000, 5000);
      // this.backgroundSprite.tileScale.set(0.5);

      // Añadir el sprite al stage
      this.gameContainer.addChildAt(this.backgroundSprite, 0);
    });
  }
  ponerProtagonista() {
    this.player = new Player(
      window.innerWidth / 2,
      window.innerHeight * 0.9,
      this
    );
    this.hud.actualizarHud();
  }
  ponerCompanion() {
    this.companions.push(new Companion(
      window.innerWidth / 2,
      window.innerHeight * 0.9,
      this,
      this.companions.length + 1
    ),
    );
  }
  ponerIndicador() {
    this.indicador = new Indicador(
      this.player.container.x,
      this.player.container.y,
      this
    );
  }
  iniciarEnemigos() {
    if (this.start) {
      this.start = false;
      this.ponerEnemigos(1);
      setTimeout(() => {
        this.ponerEnemigos(4);
      }, 3000);

    }

  }

  ponerObstaculos(cantidad){
    const distanciaMinima = 10; 
    const maxIntentos = 999;

    for(let i=0; i<cantidad; i++){
      let intentos = 0;
      let distanciaAlJugador = 0;

    }

    // Generar una posición aleatoria
    const posX = 50 + Math.random() * (this.canvasWidth - 300);
    const posY = 200 + Math.random() * (this.canvasHeight - 500);

    // Calcular la distancia entre la posición aleatoria y la posición del jugador
    let distanciaAlJugador = Math.hypot(
      posX - this.player.container.x,
      posY - this.player.container.y
    );
    if(distanciaMinima < distanciaAlJugador){
      let obstaculo = new Obstaculos(posX, posY,this);
      this.obstaculos.push(obstaculo);
      this.grid.add(obstaculo);
    }
  }

  ponerEnemigos(cant) {
    if (!this.boss) {
      console.log("Se crearon " + cant + " enemigos");
      const distanciaMinima = 600; // Ajusta este valor según lo lejos que quieras que estén los enemigos del jugador
      const maxIntentos = 999; // Máximo número de intentos para evitar loops infinitos


      for (let i = 0; i < cant; i++) {
        let enemigo;
        let intentos = 0;
        let distanciaAlJugador = 0;
        var tiposDeEnemigos = [];
        var asesinatos = this.player.asesinatos;
        if ((asesinatos == 3) && !this.miniBossCreado) {
          tiposDeEnemigos = ['tipo6'];
        }
        else if (asesinatos < 20) {
          tiposDeEnemigos = ['tipo1'];
        } else if (asesinatos == 20) {
          tiposDeEnemigos = ['tipo2'];
          cant = 1;
        } else if (asesinatos > 20 && asesinatos < 30) {
          tiposDeEnemigos = ['tipo1', 'tipo2'];
        } else if (asesinatos == 30) {
          tiposDeEnemigos = ['tipo3'];
          cant = 1;
        } else if (asesinatos > 30) {
          tiposDeEnemigos = ['tipo1', 'tipo2', 'tipo3'];
        }



        do {
          // Generar una posición aleatoria
          const posX = 50 + Math.random() * (this.canvasWidth - 300);
          const posY = 200 + Math.random() * (this.canvasHeight - 500);

          // Calcular la distancia entre la posición aleatoria y la posición del jugador
          distanciaAlJugador = Math.hypot(
            posX - this.player.container.x,
            posY - this.player.container.y
          );

          // Si la distancia es suficiente, crea el enemigo en esa posición
          if (distanciaAlJugador >= distanciaMinima) {
            const tipoAleatorio = tiposDeEnemigos[Math.floor(Math.random() * tiposDeEnemigos.length)];
            console.log(tipoAleatorio);

            switch(tipoAleatorio){
              case 'tipo4':
                enemigo = new MiniBossSprinter(posX, posY, 1, this, `enemigo_${i}`, tipoAleatorio);
                break;
              case 'tipo5':
                enemigo = new MiniBossShooter(posX, posY, 1, this, `enemigo_${i}`, tipoAleatorio);
                break;
              case 'tipo6':
                enemigo = new MiniBossShooterX(posX, posY, 1, this, `enemigo_${i}`, tipoAleatorio);
                break;
              default:
                enemigo = new Enemigo(posX, posY, 1, this, `enemigo_${i}`, tipoAleatorio);
                break;
            }
            if (tipoAleatorio === 'tipo4'|| tipoAleatorio === 'tipo5'|| tipoAleatorio === 'tipo6') {
              this.miniBossCreado = true;
            }
            //let velocidad = Math.random() * 0.2 + 0.5;
            this.enemigos.push(enemigo);
            this.grid.add(enemigo);
            break;
          }

          intentos++;
        } while (intentos < maxIntentos);


      }
    }
  }

  crearEnemigo(tipo,i){
    // Generar una posición aleatoria
    const posX = 50 + Math.random() * (this.canvasWidth - 300);
    const posY = 200 + Math.random() * (this.canvasHeight - 500);

    // Calcular la distancia entre la posición aleatoria y la posición del jugador
    distanciaAlJugador = Math.hypot(
      posX - this.player.container.x,
      posY - this.player.container.y
    );

    // Si la distancia es suficiente, crea el enemigo en esa posición
    if (distanciaAlJugador >= distanciaMinima) {
      //let velocidad = Math.random() * 0.2 + 0.5;
      enemigo = new Enemigo(posX, posY, 1, this, `enemigo_${i}`, tipo);
      this.enemigos.push(enemigo);
      this.grid.add(enemigo);
    }
  }
  mouseDownEvent() {
    this.companions.forEach((compa) => {
      compa.disparar();
    });
    this.player.disparar();

  }

  ponerListeners() {
    // Manejar eventos del mouse
    this.app.view.addEventListener("mousedown", () => {
      (this.mouse || {}).click = true;
      this.mouseDownEvent();
    });
    this.app.view.addEventListener("mouseup", () => {
      (this.mouse || {}).click = false;
    });
    window.addEventListener("keydown", (e) => {
      this.keyboard[e.key.toLowerCase()] = true;

      // Verifica si se presionó la tecla "r"
      if (e.key.toLowerCase() === 'r') {
        this.player.recarga.container.visible = true;
        this.player.recargar(); // Llama a la función que quieres ejecutar
      }
      if (e.key.toLowerCase() === 'enter') {
        this.iniciarEnemigos();
        this.hud.borrarDelHud(this.hud.pressStart);
      }
    });

    this.app.view.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.app.view.addEventListener("mouseleave", () => {
      this.mouse = null;
    });
    window.addEventListener("resize", () => {
      this.app.renderer.resize(window.innerWidth, window.innerHeight);
      this.moverHUD();
      this.hud.actualizarPosicion();

    });

    window.addEventListener("keydown", (e) => {
      this.keyboard[e.key.toLowerCase()] = true;
    });

    window.addEventListener("keyup", (e) => {
      delete this.keyboard[e.key.toLowerCase()];
    });
  }

  // Actualizar la posición del mouse
  onMouseMove(event) {
    this.mouse = { x: 0, y: 0 };
    const rect = this.app.view.getBoundingClientRect();
    this.mouse.x = event.clientX - rect.left;
    this.mouse.y = event.clientY - rect.top;
  }
  pausar() {
    this.pausa = !this.pausa;
  }

  actualizar() {
    if (!this.perdiste) {
      if (this.pausa) return;
      this.updateIndicator();
      this.contadorDeFrames++;

      this.player.update();
      this.companions.forEach((compa) => {
        compa.update();
      })

      this.enemigos.forEach((enemigo) => {
        enemigo.update();
      });

      this.balas.forEach((bala) => {
        bala.update();
      });
      this.balasEnemigos.forEach((bala) => {
        bala.update();
      })
      this.powerUps.forEach((powerUp) => {
        powerUp.update();
      })

      this.moverCamara();
    }
    this.moverHUD();
  }

  moverCamara() {
    let lerpFactor = 0.05;
    // Obtener la posición del protagonista
    const playerX = this.player.container.x;
    const playerY = this.player.container.y;

    // Calcular la posición objetivo del stage para centrar al protagonista
    const halfScreenWidth = this.app.screen.width / 2;
    const halfScreenHeight = this.app.screen.height / 2;

    const targetX = halfScreenWidth - playerX;
    const targetY = halfScreenHeight - playerY;

    // Aplicar el límite de 0,0 y canvasWidth, canvasHeight
    const clampedX = Math.min(
      Math.max(targetX, -(this.canvasWidth - this.app.screen.width)),
      0
    );
    const clampedY = Math.min(
      Math.max(targetY, -(this.canvasHeight - this.app.screen.height)),
      0
    );

    // Aplicar Lerp para suavizar el movimiento de la cámara
    this.app.stage.position.x = lerp(
      this.app.stage.position.x,
      clampedX,
      lerpFactor
    );
    this.app.stage.position.y = lerp(
      this.app.stage.position.y,
      clampedY,
      lerpFactor
    );
  }
  moverHUD() {
    this.hudContainer.position.set(-this.app.stage.position.x, -this.app.stage.position.y);
    //console.log('HUD Position:', this.hudContainer.position);
  }

  updateIndicator() {

    if (this.enemigos.length > 0) {

      const enemigoTipo4 = this.enemigos.find(enemigo => enemigo.tipo === 'tipo4' || enemigo.tipo === 'tipo5' || enemigo.tipo === 'tipo6');
      if (!enemigoTipo4) {
        this.indicador.container.visible = false;
        return;
      }

      const { x: playerX, y: playerY } = this.player.container;
      const { x: enemyX, y: enemyY } = enemigoTipo4.container;

      // Verifica si el enemigo está fuera de la vista de la cámara
      const enemyInView =
        enemyX > -this.app.stage.position.x &&
        enemyX < -this.app.stage.position.x + this.app.screen.width &&
        enemyY > -this.app.stage.position.y &&
        enemyY < -this.app.stage.position.y + this.app.screen.height;

      if (enemyInView) {
        this.indicador.container.visible = false;
      } else {
        this.indicador.container.visible = true;

        // Calcula el ángulo hacia el enemigo
        const dx = enemyX - playerX;
        const dy = enemyY - playerY;

        // Distancia total entre el jugador y el enemigo
        const distanciaTotal = Math.hypot(dx, dy);

        // Define la distancia deseada para el indicador
        const distanciaIndicador = 1; // Cambia este valor para ajustar la distancia

        // Calcula la posición del indicador
        const ratio = distanciaIndicador / distanciaTotal; // Proporción para la posición intermedia
        const indicadorX = playerX + dx * ratio;
        const indicadorY = playerY + dy * ratio;

        // Actualiza la posición del indicador
        this.indicador.container.x = indicadorX + this.app.stage.position.x;
        this.indicador.container.y = indicadorY + this.app.stage.position.y - 100;

        // Rotación del indicador
        const angle = Math.atan2(dy, dx);
        this.indicador.container.rotation = angle + Math.PI / 2;
      }
    }
  }
}


// Inicializar el juego
let juego = new Juego();