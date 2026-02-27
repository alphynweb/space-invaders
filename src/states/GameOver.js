import Button from '../modules/Button/Button';

export default class GameOver {
    constructor(
        eventEmitter,
        graphicsManager,
        screen,
        startGame,
        endGame,
        textConfig,
        buttonConfig,
        score
    ) {
        this.eventEmitter = eventEmitter;
        this.eventEmitter.on('typewriterTextFinished', this.handleTypewriterTextFinished);
        this.graphicsManager = graphicsManager;
        this.screen = screen;
        this.screenCenter = screen.width / 2;
        this.endGame = endGame;
        this.textConfig = textConfig;
        this.textObjects = [];
        this.textDelay = 200;
        this.textTimer = 0;
        this.textObjectsIndex = 0;
        this.buttonConfig = buttonConfig;
        this.score = score;
        this.ctx = screen.ctx;
        this.font = this.textConfig.configs['gameText'].font;
        this.fillStyle = this.textConfig.configs['gameText'].fillStyle;
        this.x = Math.floor(this.screen.width / 2);
        this.verticalSpacing = 60;
        this.startGame = startGame;
    }

    init = () => {
        this.buildTextObjects();
        this.textObjects[0].status = 'started';

        const subType = 'startButton';
        const animationType = 'normal';

        const startButtonConfigs = this.buttonConfig.configs[subType].spriteInfo[animationType];

        const x = this.screenCenter - (startButtonConfigs.width / 2);
        const y = 400;

        const clickListen = (event) => {
            const rect = this.screen.screen.getBoundingClientRect();
            const xClicked = event.clientX - rect.left;
            const yClicked = event.clientY - rect.top;

            if (x < xClicked && (x + startButtonConfigs.width) > xClicked && y < yClicked && (y + startButtonConfigs.height) > yClicked) {
                event.currentTarget.removeEventListener('click', clickListen);
                this.graphicsManager.clear();
                this.cleanup();
                this.startGame();
            }
        }

        this.screen.screen.addEventListener('click', clickListen, {once: true});
    }

    update = (delta) => {
        // console.log("Running GameOver update");
        this.renderText(delta);
        this.renderStartButton();
    }

    buildTextObjects = () => {
        const textStrings = [
            'Game over. You scored ' + this.score.currentScore,
            'Press start to play again'
        ];

        const font = this.font;
        const fillStyle = this.fillStyle;
        const delay = this.textDelay;

        textStrings.forEach((text, index) => {
            const x = this.x;
            const y = 200 + (this.verticalSpacing * index);
            const textObject = {
                font,
                fillStyle,
                x,
                y,
                delay,
                text,
                status: false
            };
            this.textObjects.push(textObject);
        });
    }

    renderText = (delta) => {
        this.textTimer += delta;

        this.textObjects.forEach(textObject => {
            if (textObject.status === 'finished') {
                this.graphicsManager.renderText(
                    textObject.font,
                    textObject.fillStyle,
                    textObject.x,
                    textObject.y,
                    textObject.text
                )
            }
        });

        if (this.textObjects[this.textObjectsIndex].status === 'finished') {
            if (this.textObjectsIndex < (this.textObjects.length - 1)) {
                this.textObjectsIndex++;
                this.textObjects[this.textObjectsIndex].status = 'started';
            }
        }

        if (this.textObjects[this.textObjectsIndex].status === 'started' && this.textTimer > this.textDelay) {
            this.graphicsManager.renderTypewriterText(
                delta,
                this.textObjects[this.textObjectsIndex]
            );
        }
    }

    renderStartButton = () => {
        const subType = 'startButton';
        const animationType = 'normal';
        const startButtonConfigs = this.buttonConfig.configs[subType].spriteInfo[animationType];
        const width = startButtonConfigs.width;
        const height = startButtonConfigs.height;
        const x = this.screenCenter - (width / 2);
        const y = 400;

        const startButton = new Button(
            this.buttonConfig.type,
            subType,
            this.buttonConfig.configs,
            x,
            y
        );

        this.graphicsManager.render(startButton);


    }

    handleTypewriterTextFinished = (textObject) => {
        textObject.status = 'finished';
        this.textTimer = 0;
    }

    cleanup = () => {
        this.eventEmitter.removeListener('typewriterTextFinished', this.handleTypewriterTextFinished);
    }
}