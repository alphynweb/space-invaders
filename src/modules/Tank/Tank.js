import { SCREEN } from '../../config';

export default class Tank {
    constructor(startX, type, subType, configs, screen) {
        const config = configs[subType];
        this.animationType = 'normal';
        this.type = type;
        this.subType = subType;
        this.width = config.width;
        this.height = config.height;
        this.startX = startX;
        this.x = startX;
        this.y = config.y;
        this.isActive = true;
        this.speed = config.speed;
        this.spriteInfo = config.spriteInfo;
        this.explosionDuration = config.explosionDuration;
        this.explosionTimer = 0;
        this.screenConfig = screen;
    }

    initializeLevel = () => {
        this.reset();
    }

    move = (direction) => {
        if (direction === 'left') this.x -= this.speed;
        if (direction === 'right') this.x += this.speed;

        this.x = Math.max(
            0,
            Math.min(this.x, this.screenConfig.width - this.spriteInfo[this.animationType].width)
        );
    }

    destroy = () => {
        this.animationType = 'exploding';
        this.isActive = false;
    }

    reset = () => {
        this.animationType = 'normal';
        this.isActive = true;
        this.x = this.startX;
    }

    update = (delta) => {
        if (this.animationType === 'exploding') {
            this.explosionTimer += delta;
            if (this.explosionTimer >= this.explosionDuration) {
                this.explosionTimer = 0;
                this.reset();
            }
        }
    }
}