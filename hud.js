class HUD{
    constructor(juego){
        this.juego = juego;
        this.container = new PIXI.Container()
        this.container.visible = true;
        this.container.zIndex = 99999;

        //vida

        let vidas5 = PIXI.Sprite.from('./img/Life05.png');
        let vidas4 = PIXI.Sprite.from('./img/Life04.png');
        let vidas3 = PIXI.Sprite.from('./img/Life03.png');
        let vidas2 = PIXI.Sprite.from('./img/Life02.png');
        let vidas1 = PIXI.Sprite.from('./img/Life01.png');

        //this.juego.hudContainer.addChild(this.container);
        this.juego.hudContainer.addChild(this.container);

        this.puntaje = new PIXI.Text("Puntaje",{fontFamily: 'fuente', fontSize: 30, fill: 0x000000});
        this.puntaje.position.set(100, 50,);
        this.container.addChild(this.puntaje);
    

        this.nivel = new PIXI.Text("Nivel",{fontFamily: 'fuente', fontSize: 20, fill: 0x000000});
        this.nivel.position.set(900, 25,);
        this.container.addChild(this.nivel);

        this. asesinatos = new PIXI.Text("Asesinatos",{fontFamily: 'fuente', fontSize: 30, fill: 0x000000});
        this.asesinatos.position.set(1600, 50,);
        this.container.addChild(this.asesinatos);

        this. balas = new PIXI.Text("Balas",{fontFamily: 'fuente', fontSize: 30, fill: 0x000000});
        this.balas.position.set(100, 85,);
        this.container.addChild(this.balas);

        this.vida = new PIXI.Sprite(this.vidas5);
        this.vida.position.set(100, 200,);
        this.container.addChild(this.vida);

        console.log("Se creo el hud");
        
    }
    actualizarHud(){
        this.puntaje.text = "Puntaje: " + this.juego.player.puntaje;
        this.nivel.text = "Nivel " + this.juego.nivel;
        this.asesinatos.text = "Asesinatos " + this.juego.player.asesinatos;
    }
    actualizarBalas(){
        this.balas.text = "Balas = " + this.juego.player.balas + "/" + this.juego.balasTotales;
    }
    actualizarPosicion() {
        this.puntaje.position.set(this.juego.app.screen.width * 0.05, 50);
        this.nivel.position.set(this.juego.app.screen.width * 0.5, 25);
        this.asesinatos.position.set(this.juego.app.screen.width * 0.8, 50);
        this.balas.position.set(this.juego.app.screen.width * 0.05, 85,);
    }
}