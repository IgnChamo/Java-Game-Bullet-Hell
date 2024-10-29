class Status {
    constructor(player){
        this.player=player;
    }

    damage(value){ }

    //curar hasta el maximo de vida
    heal(value){
        this.player.vidas = Math.min(4, this.player.vidas+1);
     }
     //cambiar a otro estado
     changeStatus(status){
        this.player.status=status;
     }

}

class Normal extends Status{
    constructor(player){
        super(player)
    }
    // recibe daño con underflow prevention
    damage(value){
        //super(value);
        this.player.vidas = Math.max(0, this.player.vidas-value);
        this.changeStatus(this.player.invincible)
        console.log("Daño: ", value, "Vida: ", this.player.vidas)
        console.log("Become untochable")
        setTimeout(() => {
            this.changeStatus(this.player.normal)
            console.log("back to normal")
        }, this.player.invincible.duration);
    }
}

class Invincible extends Status{
    constructor(player, duration){
        super(player);
        this.duration=duration;
    }
    damage(value){  
    }
}