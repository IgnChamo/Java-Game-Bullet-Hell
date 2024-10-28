class HUD{
    constructor(juego){
        this.juego = juego;
        this.container = new PIXI.Container()
        this.container.visible = true;
        this.container.zIndex = 99999;

        //vida

        this.vidas5 = PIXI.Texture.from('./img/Life05.png');
        this.vidas4 = PIXI.Texture.from('./img/Life04.png');
        this.vidas3 = PIXI.Texture.from('./img/Life03.png');
        this.vidas2 = PIXI.Texture.from('./img/Life02.png');
        this.vidas1 = PIXI.Texture.from('./img/Life01.png');

        //this.juego.hudContainer.addChild(this.container);
        this.juego.hudContainer.addChild(this.container);

        this.puntaje = new PIXI.Text("Puntaje",{fontFamily: 'fuente', fontSize: 30, fill: 0x000000});
        this.puntaje.position.set(this.juego.app.screen.width * 0.05, 100)
        this.container.addChild(this.puntaje);
    
        this. asesinatos = new PIXI.Text("Asesinatos",{fontFamily: 'fuente', fontSize: 30, fill: 0x000000});
        this.asesinatos.position.set(this.juego.app.screen.width * 0.9, 50);
        this.container.addChild(this.asesinatos);

        this.nivel = new PIXI.Text("Nivel",{fontFamily: 'fuente', fontSize: 20, fill: 0x000000});
        this.nivel.position.set(this.juego.app.screen.width * 0.5, 25);
        this.container.addChild(this.nivel);

        this. balas = new PIXI.Text("Balas",{fontFamily: 'fuente', fontSize: 30, fill: 0x000000});
        this.balas.position.set(this.juego.app.screen.width * 0.05, 75,);
        this.container.addChild(this.balas);

        this.vida = new PIXI.Sprite(this.vidas5);
        this.vida.position.set(this.juego.app.screen.width * 0.05, 25);
        this.container.addChild(this.vida);

        console.log("Se creo el hud");
        
    }
    actualizarHud(){
        this.puntaje.text = "Puntaje: " + this.juego.player.puntaje;
        this.nivel.text = "Nivel " + this.juego.nivel;
        this.asesinatos.text = "Asesinatos " + this.juego.player.asesinatos;
    }
    actualizarHudVida(){
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
    actualizarBalas(){
        this.balas.text = "Balas = " + this.juego.player.balas + "/" + this.juego.balasTotales;
    }
    actualizarPosicion() {
        this.puntaje.position.set(this.juego.app.screen.width * 0.05, 100);
        this.asesinatos.position.set(this.juego.app.screen.width * 0.9, 50);
        this.nivel.position.set(this.juego.app.screen.width * 0.5, 25);
        this.balas.position.set(this.juego.app.screen.width * 0.05, 75,);
        this.vida.position.set(this.juego.app.screen.width * 0.05, 25);
    }
}