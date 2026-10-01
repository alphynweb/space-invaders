import type { SpriteInfo } from  '../../types/SpriteInfo.js';

interface BulletConfig {
    direction: 'up' | 'down';
    speed: number;
    width: number;
    height: number;
    spriteInfo: SpriteInfo;
}

interface BulletConfigs {
    [key: string]: BulletConfig;
}

export default class Bullet {
    type: string;
    subType: string;
    x: number;
    y: number;
    width: number;
    height: number;
    direction: 'up' | 'down';
    speed: number;
    animationType: 'normal';

    constructor(
        type: string, 
        subType: string, 
        bulletConfigs: BulletConfigs, 
        x: number, 
        y: number
    ) {
        this.type = type;
        this.subType = subType; 
        const bulletConfig = bulletConfigs[subType];
        this.x = x; 
        this.y = y; 
        this.width = bulletConfig.width;
        this.height = bulletConfig.height;
        this.direction = bulletConfig.direction;
        this.speed = bulletConfig.speed;
        this.animationType = 'normal';
    }

    move() {
        this.y = this.direction === 'up' ? this.y - this.speed : this.y + this.speed;
    }
}