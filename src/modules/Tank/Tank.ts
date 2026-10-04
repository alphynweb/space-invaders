import type { SpriteInfo } from '../../types/SpriteInfo.js';

interface TankConfig {
    x: number;
    y: number;
    speed: number;
    width: number;
    height: number;
    explosionDuration: number;
    spriteInfo: SpriteInfo;
}

interface TankConfigs {
    [key: string]: TankConfig;
}

export default class Tank {
    animationType: 'normal' | 'shooting' | 'exploding';
    animationFrame: number;
    type: string;
    subType: string;
    width: number;
    height: number;
    startX: number;
    x: number;
    y: number;
    isActive: boolean;
    speed: number;
    spriteInfo: SpriteInfo;
    explosionDuration: number;
    explosionTimer: number;
    screenWidth: number;

    constructor(
        startX: number,
        type: string,
        subType: string,
        tankConfigs: TankConfigs,
        screenWidth: number
    ) {
        const config = tankConfigs[subType];

        if (!config) {
            throw new Error('Config file for Tank not found');
        }

        this.animationType = 'normal';
        this.animationFrame = 0;
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
        this.screenWidth = screenWidth;
    }

    initializeLevel = () => {
        this.reset();
    }

    move = (direction: 'left' | 'right') => {
        if (direction === 'left') this.x -= this.speed;
        if (direction === 'right') this.x += this.speed;

        const spriteInfoFrames = this.spriteInfo[this.animationType][0];

        if (!spriteInfoFrames) {
            throw new Error('Sprite info frames not found for Tank');
        }

        const tankWidth = spriteInfoFrames.width;

             this.x = Math.max(
            0,
            Math.min(this.x, this.screenWidth - tankWidth)
        );
    }

    destroy = () => {
        this.animationFrame = 0;
        this.animationType = 'exploding';
        this.isActive = false;
    }

    reset = () => {
        this.animationType = 'normal';
        this.isActive = true;
        this.x = this.startX;
    }

    update = (delta: number) => {
        if (this.animationType === 'exploding') {
            this.explosionTimer += delta;
            if (this.explosionTimer >= this.explosionDuration) {
                this.explosionTimer = 0;
                this.reset();
            }
        }
    }
}