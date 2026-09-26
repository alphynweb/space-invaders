import type { AnimationType, SpriteInfo } from '../../types/SpriteInfo';

interface MothershipConfig {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    spriteX: number;
    spriteY: number;
    frameLengths: FrameLengths;
    explosionDuration: number;
    timingMin: number;
    timingMax: number;
    spriteInfo: SpriteInfo;
}

interface MothershipConfigs {
    [key: string]: MothershipConfig
}

interface FrameLengths {
    normal: number;
}

export default class Mothership {
    type: string;
    subType: string;
    score: number;
    width: number;
    height: number;
    x: number;
    y: number;
    isActive: boolean;
    speed: number;
    animationType: AnimationType;
    animationFrame: number;
    animationFrames: number;
    frameTimer: number;
    frameLengths: FrameLengths;
    spriteInfo: SpriteInfo;
    explosionDuration: number;
    explosionTimer: number;
    appearanceTimer: number;
    timingMin: number;
    timingMax: number;

    constructor(
        type: string,
        subType: string,
        configs: MothershipConfigs,
        x: number,
        y: number
    ) {
        const config = configs[subType];
        this.type = type;
        this.subType = subType;
        this.width = config.width;
        this.height = config.height;
        this.x = x;
        this.y = y;
        this.isActive = false;
        this.speed = config.speed;
        this.animationType = 'normal';
        this.animationFrame = 0;
        this.animationFrames = config.spriteInfo[this.animationType].length - 1;
        this.frameTimer = 0;
        this.frameLengths = config.frameLengths;
        this.spriteInfo = config.spriteInfo;
        this.explosionDuration = config.explosionDuration;
        this.explosionTimer = 0;
        this.appearanceTimer = 0;
        this.timingMin = config.timingMin;
        this.timingMax = config.timingMax;
        this.score = Math.ceil(Math.random() * 10) * 100;
    }

    initializeLevel() {
        this.reset();
    }

    move() {
        if (this.animationType === 'exploding') return;
        this.x += this.speed;
    }

    reset() {
        this.x = -this.width;
        this.isActive = false;
        this.score = Math.ceil(Math.random() * 10) * 100;
        this.animationType = 'normal';
    }

    remove() {
        this.isActive = false;
    }

    destroy() {
        this.animationType = 'exploding';
    }

    purge() {
        if (!this.isActive) {
            this.remove();
        }
    }

    update = (delta: number) => {
        if (this.animationType === 'normal') {
            this.frameTimer += delta;

            // const currentFrame = this.spriteInfo[this.animationType][this.animationFrame];
            // const currentFrameDuration = currentFrame.frameLength ?? this.frameLengths[this.animationType];
            const currentFrameDuration = this.frameLengths[this.animationType];

            if (this.frameTimer >= currentFrameDuration) {
                this.frameTimer = 0;
                this.animationFrame = (this.animationFrame + 1) % this.animationFrames;
            }
        }

        if (this.animationType === 'exploding') {
            this.explosionTimer += delta;
            if (this.explosionTimer >= this.explosionDuration) {
                this.explosionTimer = 0;
                this.reset();
            }
        }
    }
}