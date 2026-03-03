export default class GraphicsManager {
    constructor(eventEmitter, spriteUrl, entityMap, ctx) {
        this.eventEmitter = eventEmitter;
        this.spriteUrl = spriteUrl;
        this.entityMap = entityMap;
        this.ctx = ctx;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.sprite = null;
        this.typewriterTextTimer = 0;
        this.typewriterTextIndex = 0;
        this.typewriterTextX = 0;
        this.typewriterText = '';
        this.typewriterTextEnd = false;
    }

    async init() {
        try {
            this.sprite = await this.loadImage(this.spriteUrl);
        } catch (err) {
            console.log(err);
        }
    }

    async loadImage(imageUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject("Image failed to load");
            img.src = imageUrl;
        });
    }

    render = (entity) => {
        const entityInfo = this.entityMap.get(entity.type);
        const entityConfigs = entityInfo.configs;
        const entityConfig = entityConfigs[entity.subType];
        const animationType = entity.animationType;

        if (!this.sprite) return;
        if (!entityConfig) return;

        let sx, sy, width, height;

        if (Array.isArray(entityConfig.spriteInfo[animationType])) {
            const animationFrame = entity.animationFrame;
            sx = entityConfig.spriteInfo[animationType][animationFrame].x;
            sy = entityConfig.spriteInfo[animationType][animationFrame].y;
            width = entityConfig.spriteInfo[animationType][animationFrame].width;
            height = entityConfig.spriteInfo[animationType][animationFrame].height;
        } else {
            sx = entityConfig.spriteInfo[animationType].x;
            sy = entityConfig.spriteInfo[animationType].y;
            width = entityConfig.spriteInfo[animationType].width;
            height = entityConfig.spriteInfo[animationType].height;
        }

        const dx = entity.x;
        const dy = entity.y;

        this.ctx.drawImage(
            this.sprite,
            sx,
            sy,
            width,
            height,
            dx,
            dy,
            width,
            height
        );
    }

    renderText = (font, fillStyle, x, y, text) => {
        this.ctx.font = font;
        this.ctx.fillStyle = fillStyle;
        this.ctx.fillText(text, x, y);
    }

    renderTypewriterText = (delta, textObject) => {
        this.typewriterTextTimer += delta;

        const font = textObject.font;
        const fillStyle = textObject.fillStyle;
        const x = textObject.x;
        const y = textObject.y;
        const delay = textObject.delay;
        const text = textObject.text;
        const textSplit = text.split('');

        this.renderText(
            font,
            fillStyle,
            x,
            y,
            this.typewriterText
        );

        if (this.typewriterTextTimer > delay) {
            const chr = textSplit[this.typewriterTextIndex];
            this.typewriterText += chr;
            this.typewriterTextTimer = 0;
            this.typewriterTextIndex++;
            if (this.typewriterTextIndex >= textSplit.length) {
                this.eventEmitter.emit('typewriterTextFinished', textObject);
                this.clear();
            }
        }
    }

    renderSprite = (spriteInfo, x, y) => {
        const sx = spriteInfo.x;
        const sy = spriteInfo.y;
        const width = spriteInfo.width;
        const height = spriteInfo.height;
        const dx = x;
        const dy = y;

        this.ctx.drawImage(
            this.sprite,
            sx,
            sy,
            width,
            height,
            dx,
            dy,
            width,
            height
        )
    }

    renderCity = (city) => {
        const ctx = city.ctx;
        const spriteInfo = city.spriteInfo;
        const sx = spriteInfo.x;
        const sy = spriteInfo.y;
        const width = city.width;
        const height = city.height;
        const dx = 0;
        const dy = 0;

        ctx.drawImage(
            this.sprite,
            sx,
            sy,
            width,
            height,
            dx,
            dy,
            width,
            height
        );
    }

    damageCity = (city, topLeftX, topLeftY) => {
        const ctx = city.ctx;
        const spriteInfo = city.spriteInfo;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.drawImage(
            this.sprite,
            spriteInfo.damageX,
            spriteInfo.damageY,
            spriteInfo.damageWidth,
            spriteInfo.damageHeight,
            topLeftX,
            topLeftY,
            spriteInfo.damageWidth,
            spriteInfo.damageHeight

        );
        this.ctx.globalCompositeOperation = 'source-over'; // Change back to default for re-rendering of cities
    }

    clear = () => {
        this.typewriterTextIndex = 0;
        this.typewriterText = '';
    }
}