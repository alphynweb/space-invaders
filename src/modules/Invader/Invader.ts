import { INVADERS } from '../../config.js'; // Todo - reconsider how direct refernce is used in this file
import type { AnimationType, SpriteInfo } from '../../types/SpriteInfo';

interface InvaderConfig {
    score: number;
    width: number;
    height: number;
    explosionDuration: number;
    spriteInfo: SpriteInfo;
}

interface InvaderConfigs {
    [key: string]: InvaderConfig;
}

export default class Invader {
    animationType: AnimationType;
    animationFrame: number;
    spriteInfo: SpriteInfo;
    direction: 'right' | 'left';
    type: string;
    subType: string;
    score: number;
    width: number;
    height: number;
    explosionDuration: number;
    explosionTimer: number;
    isActive: boolean;
    x: number;
    y: number;

    constructor(
        type: string,
        subType: string,
        invaderConfigs: InvaderConfigs,
        x: number,
        y: number,
    ) {
        const invaderConfig = invaderConfigs[subType];

        if (!invaderConfig) {
            throw new Error('Config for Invader not found');
        }
        
        this.type = type;
        this.subType = subType;
        this.score = invaderConfig.score;
        this.width = invaderConfig.width;
        this.height = invaderConfig.height;
        this.explosionDuration = invaderConfig.explosionDuration;
        this.explosionTimer = 0;
        this.x = x;
        this.y = y;
        this.isActive = true; // Determines whether invader is active in game (switch to false when animating explosion etc)
        this.direction = 'right';
        this.animationType = 'normal';
        this.spriteInfo = invaderConfig.spriteInfo;
        this.animationFrame = 0;
    }

    move(direction: 'left' | 'right' | 'down'): void {
        if (direction !== 'down') {
            this.x += direction === 'right' ? INVADERS.configs['wave1'].moveSpeed : -INVADERS.configs['wave1'].moveSpeed;
        } else {
            this.y += INVADERS.configs['wave1'].shiftDownSpeed;
        }

        const spriteInfoFrames = this.spriteInfo[this.animationType];

        if (!spriteInfoFrames) {
            throw new Error('Sprite Info Frames not found for Invader');
        }

        if (this.animationFrame < (spriteInfoFrames.length - 1)) {
            this.animationFrame++;
        } else {
            this.animationFrame = 0;
        }
    }

    destroy(): void {
        this.animationFrame = 0;
        this.animationType = 'exploding';
    }

    update(delta: number): void {
        if (this.animationType === 'exploding') {
            this.explosionTimer += delta;
            if (this.explosionTimer >= this.explosionDuration) {
                this.explosionTimer = 0;
                this.isActive = false;
            }
        }

    }
}