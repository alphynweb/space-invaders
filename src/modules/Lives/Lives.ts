import { SpriteInfo } from '../../types/SpriteInfo';

interface LifeConfig {
    x: number;
    y: number;
    lives: number;
    livesGap: number;
    spriteInfo: SpriteInfo;
}

interface LivesConfigs {
    [key: string]: LifeConfig;
}

export default class Lives {
    config: LifeConfig;
    livesLeft: number;

    constructor(
        configs: LivesConfigs
    ) {
        this.config = configs['main'];
        this.livesLeft = this.config.lives;
    }

    reset = () => {
        this.livesLeft = this.config.lives;
    }

    lose = (noOfLivesToLose: number = 1) => {
        this.livesLeft -= noOfLivesToLose;
    }
}