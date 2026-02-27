export default class GameStates {
    constructor(
        onIntro,
        onStartGame,
        onRunGame,
        onPauseGame,
        onStartLevel,
        onFinishLevel,
        onLoseLife,
        onEndGame
    ) {
        this.currentState = this.intro;

        // Functions passed in from main Game class
        this.onStartGame = onStartGame;
        this.onStartLevel = onStartLevel;
        this.onFinishLevel = onFinishLevel;
        this.onLoseLife = onLoseLife;
        this.onIntro = onIntro;
        this.onEndGame = onEndGame;
        this.onRunGame = onRunGame;
        this.onPauseGame = onPauseGame;
    }

    intro(currentTime) {
        console.log("Firing gamestates intro");
        this.onIntro(currentTime);
    }

    run(currentTime) {
        console.log("Firing gamestates run");
        this.onRunGame(currentTime);
    }

    pause(currentTime) {
        console.log("Firing gamestates pause");
        this.onPauseGame();
    }

    finishLevel(currentTime) {
        console.log("Firing gamestates finsih level");
        this.onFinishLevel(currentTime);
    }

    startLevel() {
        console.log("Firing gamestates start level");
        this.onStartLevel();
    }

    lose(currentTime) {
        console.log("Firing gamestates lose");
        this.onLoseLife(currentTime);
    }

    over(currentTime) {
        console.log("Firing gamestates over");
        this.onEndGame(currentTime);
    }
}