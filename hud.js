class HUD {
    constructor(juego) {
        this.juego = juego;
        this.container = new PIXI.Container()
        this.container.visible = true;
        this.container.zIndex = 99999;

        this.esVisible = true;
        this.original = true;

        //vida

        this.asesinato = PIXI.Texture.from('./img/Asesinatos.png');

        this.vidas5 = PIXI.Texture.from('./img/Life05.png');
        this.vidas4 = PIXI.Texture.from('./img/Life04.png');
        this.vidas3 = PIXI.Texture.from('./img/Life03.png');
        this.vidas2 = PIXI.Texture.from('./img/Life02.png');
        this.vidas1 = PIXI.Texture.from('./img/Life01.png');
        this.vidas0 = PIXI.Texture.from('./img/Life00.png');

        //balas
        this.balaCargadaTexture = PIXI.Texture.from('./img/BalaCargada.png');
        this.balaDescargadaTexture = PIXI.Texture.from('./img/BalaDescargada.png');

        //this.juego.hudContainer.addChild(this.container);
        this.juego.hudContainer.addChild(this.container);

        this.balasSprites = [];
        this.balasTotales = 6;

        this.puntaje = new PIXI.Text("", { fontFamily: 'Press Start 2P', fontSize: 50, padding: 20, fill: 0x000000, stroke: 0xffffff, strokeThickness: 8 });
        this.puntaje.position.set(this.juego.app.screen.width * 0.841, 95)
        this.puntaje.scale.set(0.5, 0.5);
        this.container.addChild(this.puntaje);

        /*this.punt = PIXI.Sprite.from('./img/Puntaje.png');
        this.punt.position.set(this.juego.app.screen.width * 0.892, 85);
        this.punt.scale.set(0.7,0.7);
        this.container.addChild(this.punt);*/

        this.asesinatos = new PIXI.Text("", { fontFamily: 'Press Start 2P', fontSize: 50, padding: 20, fill: 0x000000, stroke: 0xffffff, strokeThickness: 8 });
        this.asesinatos.position.set(this.juego.app.screen.width * 0.92, 26);
        this.asesinatos.scale.set(0.5, 0.5);
        this.container.addChild(this.asesinatos);

        this.asesinato = PIXI.Sprite.from('./img/Asesinatos.png');
        this.asesinato.position.set(this.juego.app.screen.width * 0.892, 10);
        this.asesinato.scale.set(0.8, 0.8);
        this.container.addChild(this.asesinato);

        this.nivel = new PIXI.Text("Level ", { fontFamily: 'Press Start 2P', fontSize: 20, fill: 0x000000, stroke: 0xffffff, strokeThickness: 8 });
        this.nivel.position.set(this.juego.app.screen.width * 0.46, 26);
        this.container.addChild(this.nivel);

        this.vida = new PIXI.Sprite(this.vidas5);
        this.vida.position.set(this.juego.app.screen.width * 0.05, 25);
        this.vida.scale.set(0.7, 0.7);
        this.container.addChild(this.vida);

        this.crearBalas();
        this.pistolaTexture = PIXI.Sprite.from('./img/Pistola.png');
        this.pistolaTexture.position.set(this.juego.app.screen.width * 0.04, 80);
        this.pistolaTexture.scale.set(0.7, 0.7);
        this.container.addChild(this.pistolaTexture);


        //hud menu

        this.nameGame = new PIXI.Text("FAIRY WITH A GUN", { fontFamily: 'Press Start 2P', fontSize: 50, fill: 0x000000, stroke: 0xffffff, strokeThickness: 8 });
        this.nameGame.position.set(this.juego.app.screen.width * 0.3, this.juego.app.screen.height * 0.75);
        this.container.addChild(this.nameGame);
        
        this.pressStart = new PIXI.Text("Press 'ENTER' to Start ", { fontFamily: 'Press Start 2P', fontSize: 30, fill: 0x000000, stroke: 0xffffff, strokeThickness: 8 });
        this.pressStart.position.set(this.juego.app.screen.width * 0.34, this.juego.app.screen.height * 0.85);
        this.container.addChild(this.pressStart);

        this.WASD = PIXI.Sprite.from('./img/WASDTuto.png');
        this.WASD.position.set(this.juego.app.screen.width * 0.41, this.juego.app.screen.height * 0.3);
        this.WASD.scale.set(0.7, 0.7);
        this.container.addChild(this.WASD);

        this.hudRecargar = PIXI.Sprite.from('./img/HudRecargar.png');
        this.hudRecargar.position.set(this.juego.app.screen.width * 0.014, this.juego.app.screen.height * 0.4);
        this.hudRecargar.scale.set(0.7, 0.7);
        this.container.addChild(this.hudRecargar);

        this.textRecargar = new PIXI.Text(" Press 'R' to reload", { fontFamily: 'Press Start 2P', fontSize: 12, fill: 0x000000, stroke: 0xffffff, strokeThickness: 8 });
        this.textRecargar.position.set(this.juego.app.screen.width * 0.033, this.juego.app.screen.height * 0.42);
        this.container.addChild(this.textRecargar);

        this.hudDisparo = PIXI.Sprite.from('./img/HudDisparo.png');
        this.hudDisparo.position.set(this.juego.app.screen.width * 0.02, this.juego.app.screen.height * 0.3);
        this.hudDisparo.scale.set(0.7, 0.7);
        this.container.addChild(this.hudDisparo);

        this.textDisparo = new PIXI.Text(" Press 'Mouse Left Button' to shoot", { fontFamily: 'Press Start 2P', fontSize: 12, fill: 0x000000, stroke: 0xffffff, strokeThickness: 8 });
        this.textDisparo.position.set(this.juego.app.screen.width * 0.033, this.juego.app.screen.height * 0.32);
        this.container.addChild(this.textDisparo);

        this.textEstadisticas = new PIXI.Text(" Press 'Q' to toggle statistics", { fontFamily: 'Press Start 2P', fontSize: 12, fill: 0x000000, stroke: 0xffffff, strokeThickness: 8 });
        this.textEstadisticas.position.set(this.juego.app.screen.width * 0.033, this.juego.app.screen.height * 0.52);
        this.container.addChild(this.textEstadisticas);


        //hud estadisticas
        this.hudCompanion = PIXI.Sprite.from('./img/HudCompanion.png');
        this.hudCompanion.position.set(this.juego.app.screen.width * 0.4, 50);
        this.hudCompanion.scale.set(1, 1);
        this.container.addChild(this.hudCompanion);

        this.cantCompanion = new PIXI.Text("", { fontFamily: 'Press Start 2P', fontSize: 50, padding: 20, fill: 0x000000, stroke: 0xffffff, strokeThickness: 8 });
        this.cantCompanion.position.set(this.juego.app.screen.width * 0.43, 60);
        this.cantCompanion.scale.set(0.5, 0.5);
        this.container.addChild(this.cantCompanion);


        this.companion = new PIXI.Text("", { fontFamily: 'Press Start 2P', fontSize: 40, padding: 20, fill: 0x000000, stroke: 0xffffff, strokeThickness: 8 });
        this.companion.position.set(this.juego.app.screen.width * 0.39, 95);
        this.companion.scale.set(0.5, 0.5);
        this.container.addChild(this.companion);
        ////////////////////////////////////
        this.hudPerforar = PIXI.Sprite.from('./img/HudPerforar.png');
        this.hudPerforar.position.set(this.juego.app.screen.width * 0.5, 50);
        this.hudPerforar.scale.set(1, 1);
        this.container.addChild(this.hudPerforar);

        this.cantPerforar = new PIXI.Text("", { fontFamily: 'Press Start 2P', fontSize: 50, padding: 20, fill: 0x000000, stroke: 0xffffff, strokeThickness: 8 });
        this.cantPerforar.position.set(this.juego.app.screen.width * 0.53, 60);
        this.cantPerforar.scale.set(0.5, 0.5);
        this.container.addChild(this.cantPerforar);

        this.perforar = new PIXI.Text("", { fontFamily: 'Press Start 2P', fontSize: 40, padding: 20, fill: 0x000000, stroke: 0xffffff, strokeThickness: 8 });
        this.perforar.position.set(this.juego.app.screen.width * 0.46, 95);
        this.perforar.scale.set(0.5, 0.5);
        this.container.addChild(this.perforar);

        /////////////////////////////////////

        this.hudCadencia = PIXI.Sprite.from('./img/HudCadencia.png');
        this.hudCadencia.position.set(this.juego.app.screen.width * 0.6, 50);
        this.hudCadencia.scale.set(1, 1);
        this.container.addChild(this.hudCadencia);

        this.cantCadencia = new PIXI.Text("", { fontFamily: 'Press Start 2P', fontSize: 50, padding: 20, fill: 0x000000, stroke: 0xffffff, strokeThickness: 8 });
        this.cantCadencia.position.set(this.juego.app.screen.width * 0.63, 60);
        this.cantCadencia.scale.set(0.5, 0.5);
        this.container.addChild(this.cantCadencia);

        this.cadencia = new PIXI.Text("", { fontFamily: 'Press Start 2P', fontSize: 40, padding: 20, fill: 0x000000, stroke: 0xffffff, strokeThickness: 8 });
        this.cadencia.position.set(this.juego.app.screen.width * 0.63, 95);
        this.cadencia.scale.set(0.5, 0.5);
        this.container.addChild(this.cadencia);

        console.log("Se creo el hud");


        //hud Perdiste

        this.derrota = new PIXI.Text("YOU DIED", { fontFamily: 'Press Start 2P', fontSize: 50, fill: 0x000000, stroke: 0xffffff, strokeThickness: 5 });
        this.derrota.position.set(this.juego.app.screen.width * 0.4, this.juego.app.screen.height * 0.5);
        this.derrota.visible = false;
        this.container.addChild(this.derrota);

        this.textScoreHadas = new PIXI.Text( "", { fontFamily: 'Press Start 2P', fontSize: 40, padding: 20, fill: 0x000000, stroke: 0xffffff, strokeThickness: 5 });
        this.textScoreHadas.position.set(this.juego.app.screen.width * 0.15, this.juego.app.screen.height * 0.7);
        this.textScoreHadas.visible = false;
        this.container.addChild(this.textScoreHadas);

        this.textScoreTotal = new PIXI.Text("Tu Score Total es", { fontFamily: 'Press Start 2P', fontSize: 40, padding: 20, fill: 0x000000, stroke: 0xffffff, strokeThickness: 5 });
        this.textScoreTotal.position.set(this.juego.app.screen.width * 0.7, this.juego.app.screen.height * 0.7);
        this.textScoreTotal.visible = false;
        this.container.addChild(this.textScoreTotal);

    }
    alternarColoresTextos() {
        // Lista de todos los textos en el HUD
        const textos = [
            this.puntaje, 
            this.asesinatos, 
            this.nivel,
            this.companion, 
            this.perforar, 
            this.cadencia,
            this.cantCompanion, 
            this.cantPerforar, 
            this.cantCadencia,
            this.textScoreHadas,
            this.textScoreTotal,
            this.derrota
            //this.textRecargar, 
            //this.textDisparo, 
            //this.textEstadisticas,
            //this.nameGame, 
            //this.pressStart
        ];
        
        // Alternar el color de cada texto
        textos.forEach(texto => {
            // Si el color actual es negro, lo cambiamos a blanco, y viceversa
            if (texto.style.fill == '#000000') {
                console.log("entro al if");
                texto.style.fill = 0xFFFFFF; // blanco
            } else {
                console.log("entro al else");
                texto.style.fill = 0x000000; // negro
            }
        });
    }

    apagarEstadisticas() {
        if (this.esVisible) {
            this.esVisible = false;
        } else {
            this.esVisible = true;
        }

        this.hudCompanion.visible = this.esVisible;
        this.hudPerforar.visible = this.esVisible;
        this.hudCadencia.visible = this.esVisible;

        this.cantCompanion.visible = this.esVisible;
        this.cantPerforar.visible = this.esVisible;
        this.cantCadencia.visible = this.esVisible;

        this.companion.visible = this.esVisible;
        this.perforar.visible = this.esVisible;
        this.cadencia.visible = this.esVisible;
    }
    actualizarHud() {
        this.puntaje.text = "Score " + this.juego.player.puntaje;
        this.nivel.text = "Level " + this.juego.nivel;
        this.asesinatos.text = this.juego.player.asesinatos;

        this.cantCompanion.text = this.juego.companions.length;
        this.cantPerforar.text = this.juego.player.maxPerforaciones;
        this.cantCadencia.text = this.juego.player.delayEntreBalas;

        this.companion.text = "FAIRY";
        this.perforar.text = "PENETRATION";
        this.cadencia.text = "ROF";
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
            case 0:
                this.vida.texture = this.vidas0;
                break;
        }

    }

    actualizarPosicion() {
        this.puntaje.position.set(this.juego.app.screen.width * 0.841, 95)
        //this.punt.position.set(this.juego.app.screen.width * 0.9, 85);
        this.asesinatos.position.set(this.juego.app.screen.width * 0.92, 25);
        this.asesinato.position.set(this.juego.app.screen.width * 0.892, 10);
        this.nivel.position.set(this.juego.app.screen.width * 0.46, 25);
        this.vida.position.set(this.juego.app.screen.width * 0.05, 25);
        this.pistolaTexture.position.set(this.juego.app.screen.width * 0.04, 80);
        
        let xPos = this.juego.app.screen.width * 0.11;
        const yPos = 88;

        for (let i = 0; i < this.balasSprites.length; i++) {
            this.balasSprites[i].position.set(xPos, yPos);
            xPos += 40;
        }

        this.derrota.position.set(this.juego.app.screen.width * 0.4, this.juego.app.screen.height * 0.5);
        this.textScoreHadas.position.set(this.juego.app.screen.width * 0.15, this.juego.app.screen.height * 0.7);
        this.textScoreTotal.position.set(this.juego.app.screen.width * 0.7, this.juego.app.screen.height * 0.7);

        //posicion estadisticas
        this.hudCompanion.position.set(this.juego.app.screen.width * 0.4, 50);
        this.cantCompanion.position.set(this.juego.app.screen.width * 0.43, 60);
        this.companion.position.set(this.juego.app.screen.width * 0.39, 95);
        this.hudPerforar.position.set(this.juego.app.screen.width * 0.5, 50);
        this.cantPerforar.position.set(this.juego.app.screen.width * 0.53, 60);
        this.perforar.position.set(this.juego.app.screen.width * 0.46, 95);
        this.hudCadencia.position.set(this.juego.app.screen.width * 0.6, 50);
        this.cantCadencia.position.set(this.juego.app.screen.width * 0.63, 60);
        this.cadencia.position.set(this.juego.app.screen.width * 0.63, 95);

        //hud menu
        if (this.juego.start) {
            this.pressStart.position.set(this.juego.app.screen.width * 0.34, this.juego.app.screen.height * 0.85);
            this.WASD.position.set(this.juego.app.screen.width * 0.41, this.juego.app.screen.height * 0.3);
            this.hudRecargar.position.set(this.juego.app.screen.width * 0.014, this.juego.app.screen.height * 0.4);
            this.textRecargar.position.set(this.juego.app.screen.width * 0.033, this.juego.app.screen.height * 0.42);
            this.hudDisparo.position.set(this.juego.app.screen.width * 0.02, this.juego.app.screen.height * 0.3);
            this.textDisparo.position.set(this.juego.app.screen.width * 0.033, this.juego.app.screen.height * 0.32);
            this.textEstadisticas.position.set(this.juego.app.screen.width * 0.033, this.juego.app.screen.height * 0.52);
            this.nameGame.position.set(this.juego.app.screen.width * 0.3, this.juego.app.screen.height * 0.75);
    
        }
        

    }
    prenderDerrota(){
        this.textScoreHadas.text = "You saved \n" + this.juego.companions.length + "\n Fairies";
        this.textScoreHadas.style.align = "center";
        this.textScoreTotal.text = "Your Score is \n" + this.juego.player.puntaje;
        this.textScoreTotal.style.align = "center";


        this.juego.hud.derrota.visible = true;
        this.juego.hud.textScoreHadas.visible = true;
        this.juego.hud.textScoreTotal.visible = true;
    }
    apagarMenu() {
        this.borrarDelHud(this.pressStart);
        this.borrarDelHud(this.WASD);
        this.borrarDelHud(this.hudRecargar);
        this.borrarDelHud(this.textRecargar);
        this.borrarDelHud(this.textDisparo);
        this.borrarDelHud(this.hudDisparo);
        this.borrarDelHud(this.textEstadisticas);
        this.borrarDelHud(this.nameGame);
        canciones.MENU.paused = true;
        playMusic(canciones.IN_GAME,0.25);
    }
    crearBalas() {
        // Posicion inicial para las balas
        let xPos = this.juego.app.screen.width * 0.11;
        let yPos = 88;

        // Crear los sprites de las balas en estado cargado
        for (let i = 0; i < this.balasTotales; i++) {
            const bala = new PIXI.Sprite(this.balaCargadaTexture);
            bala.scale.set(0.7, 0.7);
            bala.position.set(xPos, yPos);
            xPos += 30; // Ajusta la separación entre las balas
            this.container.addChild(bala);
            this.balasSprites.push(bala);
        }
    }
    borrarBalas() {
        this.balasSprites.forEach(bala => {
            this.container.removeChild(bala);
        });
        this.balasSprites = [];
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
        this.borrarBalas()
        this.crearBalas();
        this.actualizarPosicion();
    }
    actualizarBalas() {
        this.juego.player.balasTotales += 1;
        this.juego.balasTotales = this.juego.player.balasTotales;
        this.juego.player.balas = this.juego.player.balasTotales;
        this.actualizarBalasTotales(this.juego.player.balasTotales);

    }

    borrarDelHud(variable) {
        if (variable) {
            this.container.removeChild(variable);
            variable.destroy();
            variable = null;
        }
    }

    //this.juego.hud.actualizarBalasTotales(this.juego.balasTotales += 1);  linea para agregar donde se creen mas balas(PowerUp o lo que sea)

}