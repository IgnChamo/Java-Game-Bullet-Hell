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

    this.companions = [];

    this.nivel = 1;

    this.keyboard = {};

    this.app.stage.sortableChildren = true;

    this.ponerFondo();
    this.ponerProtagonista();
    this.ponerCompanion();
    this.ponerCompanion();
    this.ponerCompanion();
    this.ponerCompanion();
    this.ponerIndicador();
    this.ponerEnemigos(2);
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
      window.innerWidth / 2,
      window.innerHeight * 0.9,
      this
    );
  }

  ponerEnemigos(cant) {
    const distanciaMinima = 600; // Ajusta este valor según lo lejos que quieras que estén los enemigos del jugador
    const maxIntentos = 10; // Máximo número de intentos para evitar loops infinitos

    for (let i = 0; i < cant; i++) {
      let enemigo;
      let intentos = 0;
      let distanciaAlJugador = 0;

      do {
        // Generar una posición aleatoria
        const posX = 50 + Math.random() * (this.canvasWidth - 100);
        const posY = 200 + Math.random() * (this.canvasHeight - 250);

        // Calcular la distancia entre la posición aleatoria y la posición del jugador
        distanciaAlJugador = Math.hypot(
          posX - this.player.container.x,
          posY - this.player.container.y
        );

        // Si la distancia es suficiente, crea el enemigo en esa posición
        if (distanciaAlJugador >= distanciaMinima) {
          let velocidad = Math.random() * 0.2 + 0.5;
          enemigo = new Enemigo(posX, posY, velocidad, this);
          this.enemigos.push(enemigo);
          this.grid.add(enemigo);
          break;
        }

        intentos++;
      } while (intentos < maxIntentos);

      // Si no logró encontrar una posición adecuada en los intentos permitidos, ignora ese enemigo.
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
        this.player.recargar(); // Llama a la función que quieres ejecutar
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

    // //CADA 5 FRAMES ACTUALIZO LA GRILLA
    // if (this.contadorDeFrames % 5 == 0) {
    //   this.grid.actualizarCantidadSiLasCeldasSonPasablesONo();
    // }

    this.moverCamara();
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

    if (this.enemigos[0] != undefined) {
      const { x: playerX, y: playerY } = this.player.container;
      const { x: enemyX, y: enemyY } = this.enemigos[0].container; // Supongamos que solo tienes un enemigo

      // Calcula si el enemigo está dentro de la cámara
      const enemyInView =
        enemyX > -this.app.stage.position.x &&
        enemyX < -this.app.stage.position.x + this.app.screen.width &&
        enemyY > -this.app.stage.position.y &&
        enemyY < -this.app.stage.position.y + this.app.screen.height;

      if (enemyInView) {

        this.indicador.container.visible = false;
      } else {

        this.indicador.container.visible = true;

        const dx = enemyX - playerX;
        const dy = enemyY - playerY;
        const angle = Math.atan2(dy, dx);


        const edgeX = Math.cos(angle) * (this.app.screen.width / 2 - 20);
        const edgeY = Math.sin(angle) * (this.app.screen.height / 2 - 20);


        this.indicador.container.x = playerX + edgeX + this.app.stage.position.x;
        this.indicador.container.y = playerY + edgeY + this.app.stage.position.y;
        this.indicador.container.rotation = angle + Math.PI / 2;
      }
    }
  }
}


// Inicializar el juego
let juego = new Juego();
