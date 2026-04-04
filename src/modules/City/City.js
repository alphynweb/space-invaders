import { INVADER, TANK, CITY } from '../../config';
import Sprite from '../Sprite/Sprite';

export default class City {
    constructor(canvasId, x, configs) {
        // const configs = configs;
        const config = configs.find(config => config.type === 'city').configs['main'];
        this.canvasId = canvasId;
        this.x = x;
        this.y = config.y;
        this.ctx = document.getElementById(canvasId).getContext('2d', { willReadFrequently: true });;
        this.sprite = Sprite();
        this.width = config.width;
        this.height = config.height;
        this.spriteInfo = config.spriteInfo;
        this.type = 'city';
    }

    damage(collisionObject) { // collisionObject = Bullet tyep that collided with city
        const topLeftX = collisionObject.x - this.x - (this.spriteInfo.damageWidth / 2);
        let topLeftY;
        const subType = collisionObject.subType;

        for (const [matchFn, handlerFn] of City.cityCollisionMap) {
            if (matchFn(subType)) {
                topLeftY = handlerFn(this, collisionObject, this.configs);
                break;
            }
        }

        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.drawImage(
            this.sprite,
            this.spriteInfo.damageX,
            this.spriteInfo.damageY,
            this.spriteInfo.damageWidth,
            this.spriteInfo.damageHeight,
            topLeftX,
            topLeftY,
            this.spriteInfo.damageWidth,
            this.spriteInfo.damageHeight

        );
        this.ctx.globalCompositeOperation = 'source-over'; // Change back to default for re-rendering of cities
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
}