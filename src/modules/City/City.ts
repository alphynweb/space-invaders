interface CitySpriteInfo {
    x: number;
    y: number;
    damageX: number;
    damageY: number;
    damageWidth: number;
    damageHeight: number;
}

interface CityConfig {
    y: number;
    width: number;
    height: number;
    no: number;
    indent: number;
    spriteInfo: CitySpriteInfo;
}

interface CityConfigs {
    [key: string]: CityConfig;
}

export default class City {
    canvasId: string;
    x: number;
    y: number;
    width: number;
    height: number;
    spriteInfo: CitySpriteInfo;
    type: string;
    ctx: CanvasRenderingContext2D;
    // sprite: Sprite;

    constructor(
        canvasId: string,
        x: number,
        configs: {
            type: string,
            configs: CityConfigs
        }[] // TODO - More accurately describe config shapes rather than just using "CityConfigs"
    ) {
        const config = configs.find(config => config.type === 'city');

        if (!config) {
            throw new Error('City config not found');
        }

        const cityConfig = config.configs['main'];

        if (!cityConfig) {
            throw new Error('Config for City not found');
        }

        this.canvasId = canvasId;
        this.x = x;
        this.y = cityConfig.y;
        const canvas = document.getElementById(canvasId);

        if (!(canvas instanceof HTMLCanvasElement)) {
            throw new Error('City canvas not found');
        }

        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
            throw new Error('Could not get 2D canvas context');
        }

        this.ctx = ctx;
        // this.sprite = new Sprite();
        this.width = cityConfig.width;
        this.height = cityConfig.height;
        this.spriteInfo = cityConfig.spriteInfo;
        this.type = 'city';
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
}