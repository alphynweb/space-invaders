import gameSprite from '../../assets/images/sprite-2.png';

const sprite = function() {
    let img = new Image();
    img.src = gameSprite;
    return img;
};

export default sprite;