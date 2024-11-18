
// List of files to load
let audioMenu = PIXI.sound.Sound.from({
    url: './music/Toxicity.mp3',
    preload: true,
    loaded: function(err, sound) {
        sound.play({
            volume: 0.09,
            loop: true
            });
        console.log("Menu Precargado.");
    }
});
let audioInGame = PIXI.sound.Sound.from({
    url: './music/BGM.mp3',
    preload: true,
    loaded: function(err, sound) {
        console.log("InGame Precargado.");
    }
});
let audioGameOver = PIXI.sound.Sound.from({
    url: './music/Toxicity.mp3',
    preload: true,
    loaded: function(err, sound) {
        console.log("GameOver Precargado.");
    }
});
let Gunshot = PIXI.sound.Sound.from({
    url: './music/Gunshot.mp3',
    preload: true,
    loaded: function(err, sound) {
        console.log("SFX 1 Precargado.");
    }
});
let dañoPlayer = PIXI.sound.Sound.from({
    url: './music/Gunshot.mp3',
    preload: true,
    loaded: function(err, sound) {
        console.log("SFX 2 Precargado.");
    }
});

let pickUp = PIXI.sound.Sound.from({
    url: './music/pickup.mp3',
    preload: true,
    loaded: function(err, sound) {
        console.log("SFX 3 Precargado.");
    }
});

const canciones = { MENU : audioMenu, IN_GAME : audioInGame, GAME_OVER : audioGameOver};
const sfx = { GUNSHOT : Gunshot, DAÑOPLAYER : dañoPlayer, PICKUP : pickUp};

let player = canciones.MENU;
player.paused = false;

// Función para reproducir la música
function playMusic(song, volume = 1) {
    if (player.paused) {
        player = song;
        player.loop = true;
        player.volume = volume;
        player.play();
        console.log('Música reproducida');
    } else {
        console.log("Deteniendo Cancion Anterior");
        pauseMusic();
        playMusic(song, volume);
    }
}

// Función para pausar la música
function pauseMusic() {
    if (!player.paused) {
        player.pause();
        console.log('Música pausada');
    }
}

// Función para reproducir el efecto de sonido (SFX)
function playSFX(sonido, vol) {
    sonido.volume = vol;
    sonido.play();
    console.log('Efecto de sonido reproducido');
}

