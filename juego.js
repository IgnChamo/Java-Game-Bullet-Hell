

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
    this.gameContainer.sortableChildren =true;
    this.currentBackground = 0;
    this.backgroundTextures = [];

    this.gridActualizacionIntervalo = 10; // Cada 10 frames
    this.contadorDeFrames = 0;
    this.grid = new Grid(50, this); // Tamaño de celda 50
    this.enemigos = [];
    this.bosses = [];
    this.balas = [];
    this.balasTotales = 6;
    this.asesinatosPorNivel = 0;

    this.balasEnemigos = [];

    this.companions = [];

    this.obstaculos = [];

    this.powerUps = [];
    this.start = true;
    this.nivel = 1;
    this.miniBossCreado = false;
    this.miniBoss1Creado = false;
    this.miniBoss2Creado = false;
    this.miniBoss3Creado = false;
    this.boss = false; // Se pondra en True cuando aparezca el boss, esto no dejara que se sigan creando enemigos en esa etapa.
    this.perdiste = false;


    this.keyboard = {};

    this.app.stage.sortableChildren = true;
    this.cargarFondos();
    //this.ponerFondo();
    this.ponerProtagonista();
    this.ponerIndicador();
    this.ponerObstaculos(15);

    //this.iniciarEnemigos();
    this.ponerListeners();

    setTimeout(() => {
      this.app.ticker.add(this.actualizar.bind(this));
      window.__PIXI_APP__ = this.app;
    }, 100);
  }
  cargarFondos() {
    PIXI.Texture.fromURL("./img/bg2.png").then((texture1) => {
      this.backgroundTextures[0] = texture1;
      PIXI.Texture.fromURL("./img/bg.png").then((texture2) => {
        this.backgroundTextures[1] = texture2;
        this.ponerFondo(); // Inicia el fondo al cargar
      });
    });
    this.hud.cambiarColorFondoHud();
  }

  ponerFondo() {
    // Elimina el sprite de fondo anterior si existe
    if (this.backgroundSprite) {
      this.gameContainer.removeChild(this.backgroundSprite);
    }

    // Cambiar al siguiente fondo
    this.currentBackground = 1 - this.currentBackground; // Alterna entre 0 y 1

    // Crear un nuevo sprite con la textura del fondo actual
    this.backgroundSprite = new PIXI.TilingSprite(
      this.backgroundTextures[this.currentBackground],
      5000,
      5000
    );

    // Añadir el sprite al stage
    this.gameContainer.addChildAt(this.backgroundSprite, 0);
  }

  ponerProtagonista() {
    this.player = new Player(
      window.innerWidth / 2,
      window.innerHeight * 1,
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

  ponerObstaculos(cantidad) {
    const distanciaMinima = 10;
    const maxIntentos = 999;

    for (let i = 0; i < cantidad; i++) {
      let intentos = 0;



      // Generar una posición aleatoria
      const posX = 50 + Math.random() * (this.canvasWidth - 300);
      const posY = 200 + Math.random() * (this.canvasHeight - 500);

      // Calcular la distancia entre la posición aleatoria y la posición del jugador
      let distanciaAlJugador = Math.hypot(
        posX - this.player.container.x,
        posY - this.player.container.y
      );
      if (distanciaMinima < distanciaAlJugador) {
        let obstaculo = new Obstaculos(posX, posY, this);
        this.obstaculos.push(obstaculo);
        this.grid.add(obstaculo);
      }
    }
  }

  ponerEnemigos(cant) {
    if (!this.boss) {
      const distanciaMinima = 600; // Ajusta este valor según lo lejos que quieras que estén los enemigos del jugador
      const maxIntentos = 999; // Máximo número de intentos para evitar loops infinitos


      for (let i = 0; i < cant; i++) {
        let enemigo;
        let intentos = 0;
        let distanciaAlJugador = 0;
        var tiposDeEnemigos = [];
        var asesinatos = this.asesinatosPorNivel;//this.player.asesinatos;
        console.log("Asesinatos: " + asesinatos);
        if (asesinatos == 1) {
          tiposDeEnemigos = ['tipo2'];
          cant = 1;
        } else if (asesinatos == 2) {
          tiposDeEnemigos = ['tipo3'];
          cant = 1;
        }
        else if (asesinatos == 3) {
          tiposDeEnemigos = ['tipo3'];
          cant = 1;
        } else if ((asesinatos > 3) && !this.miniBoss1Creado) {
          console.log("creating miniboss1")
          tiposDeEnemigos = ['tipo4'];
        } else if ((asesinatos > 6) && !this.miniBoss2Creado) {
          tiposDeEnemigos = ['tipo5'];
        } else if ((asesinatos > 9) && !this.miniBoss3Creado) {
          tiposDeEnemigos = ['tipo6'];
        } else if ((asesinatos >12) && !this.boss) {
          tiposDeEnemigos = ['tipo7'];
          this.boss = true;
        }
        else if (asesinatos <= 20) {
          tiposDeEnemigos = ['tipo1'];
        } else if (asesinatos > 20 && asesinatos <= 30) {
          tiposDeEnemigos = ['tipo1', 'tipo2'];
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
            let flag = true
            switch (tipoAleatorio) {
              case 'tipo4':
                enemigo = new MiniBossSprinter(posX, posY, 1, this, `enemigo_${i}`, tipoAleatorio);
                this.miniBoss1Creado = true;
                flag = false;
                break;
              case 'tipo5':
                enemigo = new MiniBossShooter(posX, posY, 1, this, `enemigo_${i}`, tipoAleatorio);
                this.miniBoss2Creado = true;
                flag = false;
                break;
              case 'tipo6':
                enemigo = new MiniBossShooterX(posX, posY, 1, this, `enemigo_${i}`, tipoAleatorio);
                this.miniBoss3Creado = true;
                flag = false;
                break;
              case 'tipo7':
                enemigo = new Boss(posX, posY, 1, this, `enemigo_${i}`, tipoAleatorio);
                this.boss = true;
                flag = false;
                break;
              default:
                enemigo = new Enemigo(posX, posY, 1, this, `enemigo_${i}`, tipoAleatorio);
                break;
            }
            //let velocidad = Math.random() * 0.2 + 0.5;
            if (flag) {
              this.enemigos.push(enemigo);
            }
            else {
              this.bosses.push(enemigo);
              console.log("Added to bosses: " + enemigo);
            }

            this.grid.add(enemigo);
            break;
          }
          intentos++;
        } while (intentos < maxIntentos);
      }
    }
  }

  /*crearEnemigo(tipo, i) {
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
  }*/
  borrarEnemigos() {
    this.enemigos.forEach((enemigo) => {
      enemigo.borrar();
      const random = Math.floor(Math.random() * 3);
      if (random === 0) {
        this.ponerEnemigos(1);
        console.log("crea los bichos papa");
      }
    });
  }
  borrarEnemigosDerrota() {
    this.enemigos.forEach((enemigo) => {
      enemigo.borrar();
    });
    this.balas.forEach((balas) => {
      balas.borrar();
    });
    this.balasEnemigos.forEach((balas) => {
      balas.borrar();
    });
  }
  mouseDownEvent() {
    if(!this.perdiste){
    this.companions.forEach((compa) => {
      compa.disparar();
    });
    this.player.disparar();
  }
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
          if(!this.perdiste){
          this.player.recarga.container.visible = true;
          this.player.recargar(); 
          }
        }
        if (e.key.toLowerCase() === 'enter') {
          this.iniciarEnemigos();
          this.hud.apagarMenu();
        }
        if (e.key.toLowerCase() === 'q') {
          this.hud.apagarEstadisticas();
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
      this.bosses.forEach((boss) => {
        boss.update();
      }
      )
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

    if (this.bosses.length > 0) {

      const enemigo = this.bosses.find(enemigo => enemigo.tipo === 'tipo4' || enemigo.tipo === 'tipo5' || enemigo.tipo === 'tipo6' || enemigo.tipo === 'tipo7');
      if (!enemigo) {
        this.indicador.container.visible = false;
        return;
      }

      const { x: playerX, y: playerY } = this.player.container;
      const { x: enemyX, y: enemyY } = enemigo.container;

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


