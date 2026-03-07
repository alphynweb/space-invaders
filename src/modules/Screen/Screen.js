import * as config from '../../config';

const screen = () => {
    const newScreen = document.createElement('canvas');
    newScreen.id = "screenCanvas";
    newScreen.width = config.SCREEN.configs.main.width;
    newScreen.height = config.SCREEN.configs.main.height;
    newScreen.style.backgroundColor = "transparent";
    newScreen.style.position = "absolute";
    newScreen.style.top = "0";
    newScreen.style.left = "0";
    newScreen.style.textAlign = "center";

    const dpr = window.devicePixelRatio || 1;
    
    return {
        screen: newScreen,
        width: config.SCREEN.configs.main.width,
        height: config.SCREEN.configs.main.height,
        ctx: newScreen.getContext('2d', { willReadFrequently: true }),
        render: function() {
            const gameArea = document.getElementById('gameArea');
            gameArea.style.width = config.SCREEN.configs.main.width + 'px';
            gameArea.style.position = 'relative';
            gameArea.appendChild(this.screen);
        },
        clear: function() {
            this.ctx.clearRect(0, 0, this.width, this.height);
        }
    };
};

export default screen;