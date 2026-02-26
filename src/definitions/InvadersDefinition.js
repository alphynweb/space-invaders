export default class InvadersDefinition {
    getLevelConfig() {
        return {
            levelName: this.levelName,
            y: this.y,
            formation: this.formation,
            columns: this.columns,
            columnGap: this.columnGap,
            columnWidth: this.columnWidth,
            rowHeight: this.rowHeight,
            rowGap: this.rowGap,
            bullets: this.bullets,
            moveSpeed: this.moveSpeed
        };
    }
    setLevelConfig(configs, currentLevel) {
        const configKey = 'wave' + currentLevel;
        const config = configs.configs[configKey];
        this.levelName = configKey;
        this.y = config.y;
        this.formation = config.formation;
        this.columns = config.columns;
        this.columnGap = config.columnGap;
        this.columnWidth = config.columnWidth;
        this.moveSpeed = config.moveSpeed;
        this.rowHeight = config.rowHeight;
        this.rowGap = config.rowGap;
        this.bullets = config.bullets;
    }
}