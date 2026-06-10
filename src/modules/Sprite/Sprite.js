export default class Sprite{
    constructor (gameSprite) {
        this.gameSprite = gameSprite;
        this.img;
    }

    loadSprite = () => {
        this.img = new Image();
        this.img,src = this.gameSprite;
        return this.img;
    }
     
};

// import gameSprite from '/public/graphics/graphicsSprite.png';

// const sprite = function() {
//     let img = new Image();
//     img.src = gameSprite;
//     return img;
// };

// export default sprite;