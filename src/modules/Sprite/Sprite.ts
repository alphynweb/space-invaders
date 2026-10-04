export default class Sprite {
    gameSprite: string;
    img: HTMLImageElement | null;

    constructor(gameSprite: string) {
        this.gameSprite = gameSprite;
        this.img = null;
    }

    loadSprite = () => {
        this.img = new Image();
        this.img.src = this.gameSprite;
        return this.img;
    }

};