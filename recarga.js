class Recarga {
    constructor(x, y, juego) {
        this.juego = juego;
        this.container = new PIXI.Container();
        this.cargarVariosSpritesAnimados(
            {
                Activo: "./img/recargar.png",
                Recargando: "./img/recargando.png",
            },
            64,
            64,
            0.09,
            (e) => {
                this.listo = true;
                this.cambiarSprite("Activo");
                this.juego.app.stage.addChild(this.container);
            }
        );
        this.container.x = x;
        this.container.y = y - 55;
        this.container.visible = false;

    }
    recarga(){
        this.container.visible = true;
        this.cambiarSprite("Recargando");
        let spriteRecarga = this.spritesAnimados["Recargando"];
        spriteRecarga.gotoAndPlay(0);
        spriteRecarga.loop = false;  
        setTimeout(() => {
            this.cambiarSprite("Activo");
          }, this.juego.player.tiempoRecarga);
    }
    actualizarPosicion() {
        this.container.x = this.juego.player.container.x;
        this.container.y = this.juego.player.container.y - 55;
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

    cargarSpriteAnimado(url, frameWidth, frameHeight, vel, cb) {
        let texture = PIXI.Texture.from(url);
        texture.baseTexture.on("loaded", () => {
            let width = texture.baseTexture.width;
            let height = texture.baseTexture.height;
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
                    // frame.anchor.set(0.5,1)

                    frames.push(frame);
                }
            } //for

            const animatedSprite = new PIXI.AnimatedSprite(frames);

            // Configurar la animación
            animatedSprite.animationSpeed = vel;
            animatedSprite.loop = true; // Para que la animación se repita

            //animatedSprite.anchor.set(0.5, 1);
            animatedSprite.anchor.set(0.5);

            // Iniciar la animación
            animatedSprite.play();

            if (cb) cb(animatedSprite);
        });
    }
}
