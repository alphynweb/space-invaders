import Invader from '../modules/Invader/Invader';
import Mothership from '../modules/Mothership/Mothership';
import Button from '../modules/Button/Button';

export default class IntroScreen {
    constructor(
        eventEmitter,
        graphicsManager,
        screen,
        startGame,
        textConfig,
        mothershipConfig,
        invaderConfig,
        buttonConfig
    ) {
        this.eventEmitter = eventEmitter;
        this.eventEmitter.on('typewriterTextFinished', this.handleTypewriterTextFinished);
        this.graphicsManager = graphicsManager;
        this.textConfig = textConfig;
        this.mothershipConfig = mothershipConfig;
        this.invaderConfig = invaderConfig;
        this.buttonConfig = buttonConfig;
        this.screen = screen;
        this.screenCenter = screen.width / 2;
        this.ctx = screen.ctx;
        this.font = this.textConfig.configs['gameText'].font;
        this.arrowFont = this.textConfig.configs['gameText'].arrowFont;
        this.fillStyle = this.textConfig.configs['gameText'].fillStyle;
        this.lhVertical = Math.floor(this.screen.width / 2 - (this.screen.width / 5));
        this.rhVertical = Math.floor(this.screen.width / 2 + (this.screen.width / 5));
        this.verticalSpacing = 60;
        this.y = this.verticalSpacing;
        this.currentYPost = 0;
        this.invadersInfo = [];
        this.invadersInfoIndex = 0;
        this.textDelay = 200;
        this.textTimer = 0;

        this.startGame = startGame;
        this.init();
    }

    init = () => {
        this.invaders = [];
        let index = 1;
        for (const [subType, config] of Object.entries(this.invaderConfig.configs)) {
            const width = config.width;

            const type = this.invaderConfig.type;
            const configs = this.invaderConfig.configs;
            let x = this.lhVertical - (width / 2);
            let y = this.verticalSpacing * index;

            const invader = new Invader(
                type,
                subType,
                configs,
                x,
                y
            )

            this.invaders.push(invader);

            index++;
        }

        this.motherships = [];

        const invaderY = Object.entries(this.invaderConfig.configs).length * this.verticalSpacing;
        index = 1;
        for (const [subType, config] of Object.entries(this.mothershipConfig.configs)) {
            const width = config.width;
            const type = this.mothershipConfig.type;
            const configs = this.mothershipConfig.configs;
            let x = this.lhVertical - (width / 2);
            let y = this.verticalSpacing * index + invaderY;

            const mothership = new Mothership(
                type,
                subType,
                configs,
                x,
                y
            )

            this.motherships.push(mothership);

            // this.graphicsManager.render(mothership);

            x = this.rhVertical;
            y += mothership.height / 2;

            this.graphicsManager.renderText(
                this.font,
                this.fillStyle,
                x,
                y,
                "Score ???"
            )

            index++;
            this.y += this.verticalSpacing * index;
        }

        this.buildInvadersInfo();
        this.invadersInfo[0].status = 'started';
        console.log(this.invadersInfo);

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

        this.screen.screen.addEventListener('click', clickListen);
    }

    render = (delta) => {
        this.renderInvadersInfo(delta);
        // this.renderMothershipInfo();
        this.renderStartButton();
        this.renderInstructions();
    }

    update = (delta) => {
        this.motherships.forEach(mothership => {
            mothership.update(delta);
        });
        this.render(delta);
    }

    buildInvadersInfo = () => {
        this.invaders.forEach(invader => {
            const x = this.rhVertical;
            const y = invader.y + (invader.height / 2);

            const invaderInfo = {
                invader,
                x,
                y,
                font: this.font,
                fillStyle: this.fillStyle,
                text: "Test " + invader.score,
                delay: this.textDelay,
                status: false
            };

            this.invadersInfo.push(invaderInfo);
        });

        this.motherships.forEach(mothership => {
            const x = this.rhVertical;
            const y = mothership.y + (mothership.height / 2);

            const mothershipInfo = {
                invader: mothership,
                x,
                y,
                font: this.font,
                fillStyle: this.fillStyle,
                text: "Test ???",
                delay: this.textDelay,
                status: false
            };

            this.invadersInfo.push(mothershipInfo);
        });
    }

    renderInvadersInfo = (delta) => {
        this.textTimer += delta;

        // Display statically the text that has already been finished
        this.invadersInfo.forEach(currentInvaderInfo => {
            if (currentInvaderInfo.status == 'finished') {
                this.graphicsManager.render(currentInvaderInfo.invader);
                this.graphicsManager.renderText(
                    currentInvaderInfo.font,
                    currentInvaderInfo.fillStyle,
                    currentInvaderInfo.x,
                    currentInvaderInfo.y,
                    currentInvaderInfo.text
                );
            }
        });

        if (this.invadersInfo[this.invadersInfoIndex].status == 'finished') {
            if (this.invadersInfoIndex < (this.invadersInfo.length - 1)) {
                this.invadersInfoIndex++;
                this.invadersInfo[this.invadersInfoIndex].status = 'started';
            }
        }


        if (this.invadersInfo[this.invadersInfoIndex].status == 'started' && this.textTimer > this.textDelay) {
            this.graphicsManager.render(this.invadersInfo[this.invadersInfoIndex].invader);
            this.graphicsManager.renderTypewriterText(
                delta,
                this.invadersInfo[this.invadersInfoIndex]
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

    renderInstructions = () => {
        let y = 550;

        this.graphicsManager.renderText(
            this.arrowFont,
            this.fillStyle,
            this.lhVertical,
            y,
            String.fromCharCode('8592')
        );

        this.graphicsManager.renderText(
            this.font,
            this.fillStyle,
            this.rhVertical,
            y,
            'Move Tank Left'
        );

        y += this.verticalSpacing;

        this.graphicsManager.renderText(
            this.arrowFont,
            this.fillStyle,
            this.lhVertical,
            y,
            String.fromCharCode('8594')
        );

        this.graphicsManager.renderText(
            this.font,
            this.fillStyle,
            this.rhVertical,
            y,
            'Move Tank Right'
        );

        y += this.verticalSpacing;

        this.graphicsManager.renderText(
            this.font,
            this.fillStyle,
            this.lhVertical,
            y,
            'Space Bar'
        );

        this.graphicsManager.renderText(
            this.font,
            this.fillStyle,
            this.rhVertical,
            y,
            'Fire'
        );
    }

    handleTypewriterTextFinished = (invaderObject) => {
        invaderObject.status = 'finished';
        this.textTimer = 0;
    }

    cleanup = () => {
        this.invadersInfo = [];
        this.motherships = [];
        this.eventEmitter.removeListener('typewriterTextFinished', this.handleTypewriterTextFinished);
    }
}