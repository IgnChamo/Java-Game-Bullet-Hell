class HUD{
    constructor(juego){
        this.juego = juego;
        this.container = new PIXI.Container()
        this.container.visible = true;
        this.container.zIndex = 99999;

        //this.juego.hudContainer.addChild(this.container);
        this.juego.hudContainer.addChild(this.container);

        this.puntaje = new PIXI.Text("Puntaje",{fontFamily: 'fuente', fontSize: 30, fill: 0x000000});
        this.puntaje.position.set(100, 50,);
        this.container.addChild(this.puntaje);
       
        this.timer = new PIXI.Text("Timer",{fontFamily: 'fuente', fontSize: 30, fill: 0x000000});
        this.timer.position.set(400, 50,);
        this.container.addChild(this.timer);

        this.nivel = new PIXI.Text("Nivel",{fontFamily: 'fuente', fontSize: 20, fill: 0x000000});
        this.nivel.position.set(900, 25,);
        this.container.addChild(this.nivel);

        this. asesinatos = new PIXI.Text("Asesinatos",{fontFamily: 'fuente', fontSize: 30, fill: 0x000000});
        this.asesinatos.position.set(1600, 50,);
        this.container.addChild(this.asesinatos);

        this. balas = new PIXI.Text("Balas",{fontFamily: 'fuente', fontSize: 30, fill: 0x000000});
        this.balas.position.set(100, 85,);
        this.container.addChild(this.balas);


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
        this.timer.position.set(this.juego.app.screen.width * 0.2, 50);
        this.nivel.position.set(this.juego.app.screen.width * 0.5, 25);
        this.asesinatos.position.set(this.juego.app.screen.width * 0.8, 50);
        this.balas.position.set(this.juego.app.screen.width * 0.05, 85,);
    }
}