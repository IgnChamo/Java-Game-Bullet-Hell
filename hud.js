class HUD {
    constructor(juego) {
        this.juego = juego;
        this.container = new PIXI.Container()
        this.container.visible = true;
        this.container.zIndex = 99999;

        //vida
        this.asesinato = PIXI.Texture.from('./img/Asesinatos.png');

        this.vidas5 = PIXI.Texture.from('./img/Life05.png');
        this.vidas4 = PIXI.Texture.from('./img/Life04.png');
        this.vidas3 = PIXI.Texture.from('./img/Life03.png');
        this.vidas2 = PIXI.Texture.from('./img/Life02.png');
        this.vidas1 = PIXI.Texture.from('./img/Life01.png');

        //balas
        this.balaCargadaTexture = PIXI.Texture.from('./img/BalaCargada.png');
        this.balaDescargadaTexture = PIXI.Texture.from('./img/BalaDescargada.png');

        //this.juego.hudContainer.addChild(this.container);
        this.juego.hudContainer.addChild(this.container);

        this.balasSprites = [];
        this.balasTotales = 6;

        this.puntaje = new PIXI.Text("", { fontFamily: 'fuente', fontSize: 50,padding: 20, fill: 0x000000 });
        this.puntaje.position.set(this.juego.app.screen.width * 0.92, 88)
        this.container.addChild(this.puntaje);

        this.punt = PIXI.Sprite.from('./img/Puntaje.png');
        this.punt.position.set(this.juego.app.screen.width * 0.88, 85);
        this.container.addChild(this.punt);

        this.asesinatos = new PIXI.Text("", { fontFamily: 'fuente', fontSize: 50 ,padding: 20 , fill: 0x000000 });
        this.asesinatos.position.set(this.juego.app.screen.width * 0.92, 25);
        this.container.addChild(this.asesinatos);

        this.asesinato = PIXI.Sprite.from('./img/Asesinatos.png');
        this.asesinato.position.set(this.juego.app.screen.width * 0.88, 10);
        this.container.addChild(this.asesinato);

        this.nivel = new PIXI.Text("Nivel", { fontFamily: 'fuente', fontSize: 20, fill: 0x000000 });
        this.nivel.position.set(this.juego.app.screen.width * 0.5, 25);
        this.container.addChild(this.nivel);

        this.vida = new PIXI.Sprite(this.vidas5);
        this.vida.position.set(this.juego.app.screen.width * 0.05, 25);
        this.container.addChild(this.vida);

        this.crearBalas();
        this.pistolaTexture = PIXI.Sprite.from('./img/Pistola.png');
        this.pistolaTexture.position.set(this.juego.app.screen.width * 0.05, 100);
        this.container.addChild(this.pistolaTexture);

        console.log("Se creo el hud");

    }


    actualizarHud() {
        this.puntaje.text = this.juego.player.puntaje;
        this.nivel.text = "Nivel " + this.juego.nivel;
        this.asesinatos.text = this.juego.player.asesinatos;
    }

    actualizarHudVida() {
        switch (this.juego.player.vidas) {
            case 5:
                this.vida.texture = this.vidas5;
                break;
            case 4:
                this.vida.texture = this.vidas4;
                break;
            case 3:
                this.vida.texture = this.vidas3;
                break;
            case 2:
                this.vida.texture = this.vidas2;
                break;
            case 1:
                this.vida.texture = this.vidas1;
                break;
        }
    }

    actualizarPosicion() {
        this.puntaje.position.set(this.juego.app.screen.width * 0.92, 88);
        this.punt.position.set(this.juego.app.screen.width * 0.88, 85);
        this.asesinatos.position.set(this.juego.app.screen.width * 0.92, 25);
        this.asesinato.position.set(this.juego.app.screen.width * 0.88, 10);
        this.nivel.position.set(this.juego.app.screen.width * 0.5, 25);
        this.vida.position.set(this.juego.app.screen.width * 0.05, 25);
        this.pistolaTexture.position.set(this.juego.app.screen.width * 0.05, 100);

        let xPos = this.juego.app.screen.width * 0.11;
        const yPos = 88;

        for (let i = 0; i < this.balasSprites.length; i++) {
            this.balasSprites[i].position.set(xPos, yPos);
            xPos += 40;
        }
    }

    crearBalas() {
        // Posicion inicial para las balas
        let xPos = this.juego.app.screen.width * 0.11;
        let yPos = 88;

        // Crear los sprites de las balas en estado cargado
        for (let i = 0; i < this.balasTotales; i++) {
            const bala = new PIXI.Sprite(this.balaCargadaTexture);
            bala.position.set(xPos, yPos);
            xPos += 40; // Ajusta la separación entre las balas
            this.container.addChild(bala);
            this.balasSprites.push(bala);
        }
    }

    disparar() {
        // Encuentra la primera bala cargada y cámbiala a descargada
        for (let i = this.balasSprites.length - 1; i >= 0; i--) {
            if (this.balasSprites[i].texture === this.balaCargadaTexture) {
                this.balasSprites[i].texture = this.balaDescargadaTexture;
                break;
            }
        }
    }

    recargar() {
        // Recargar todas las balas
        for (let i = 0; i < this.balasSprites.length; i++) {
            this.balasSprites[i].texture = this.balaCargadaTexture;
        }
    }

    actualizarBalasTotales(nuevasBalasTotales) {
        this.balasTotales = nuevasBalasTotales;
        this.crearBalas();
    }

    //this.juego.hud.actualizarBalasTotales(this.juego.balasTotales += 1);  linea para agregar donde se creen mas balas(PowerUp o lo que sea)

}