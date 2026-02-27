export default class FinishLevel {
    constructor(
        graphicsManager,
        screen,
        textConfig,
        currentLevel
    ) {
        this.graphicsManager = graphicsManager;
        this.screen = screen;
        this.ctx = screen.ctx;
        this.textConfig = textConfig;
        this.font = this.textConfig.configs['gameText'].font;
        this.fillStyle = this.textConfig.configs['gameText'].fillStyle;
        this.x = this.screen.width / 2;
        this.textX = this.screen.width / 2;
        this.y = this.screen.height / 2;
        this.currentLevel = currentLevel;
        this.timer = 0;
        this.duration = 2000;
        this.state = 'show';
    }
    render = () => {
        this.renderMessage();
    }
    switchState = (state) => {
        this.state = state;
    }

    renderMessage = () => {
        this.graphicsManager.renderText(
            this.font,
            this.fillStyle,
            this.textX,
            this.y,
            "Level " + this.currentLevel + " Finished"
        )
    }
    update = (delta) => {
        this.timer += delta;
        if (this.timer >= this.duration) {
            this.timer = 0;
            this.switchState(null);
        }
    }
}