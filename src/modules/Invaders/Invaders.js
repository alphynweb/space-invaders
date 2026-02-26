import { INVADER, INVADERS, SCREEN, SOUNDS } from '../../config';
import Invader from '../Invader/Invader';

export default class Invaders {
    constructor(invadersConfig, invaderConfigs) {
        this.config = INVADERS;
        this.moveSounds = SOUNDS.invader.move;
        this.invaderList = [];
        this.moveSounds = [];
        this.currentSoundIndex = 0;
        this.currentMoveSound = null;
        this.direction = "right";
        this.shiftDown = false;
        this.isRhWall = false;
        this.isLhWall = false;
        this.invadersConfig = invadersConfig;
        this.invaderConfigs = invaderConfigs;
    }

    reset = () => {
        this.invaderList = [];
        // this.initializeLevel(this.invadersConfig.configs.wave1);
    }

    initializeLevel(levelConfig) {
        this.setLevelConfig(levelConfig);
        this.build();
        this.direction = 'right';
    }

    setLevelConfig(levelConfig) {
        this.levelName = levelConfig.levelName;
        this.formation = levelConfig.formation;
        this.columns = levelConfig.columns;
        this.columnGap = levelConfig.columnGap;
        this.columnWidth = levelConfig.columnWidth;
        this.rowHeight = levelConfig.rowHeight;
        this.rowGap = levelConfig.rowGap;
        this.y = levelConfig.y;
    }

    build = () => {
        // Build rows
        let x;
        let y;

        this.formation.forEach((row, index) => {
            const subType = row.subType;

            const config = this.invaderConfigs[subType];

            for (let column = 1; column < this.columns + 1; column++) {
                x = (column * this.columnWidth) + (column * this.columnGap);
                y = (index * this.rowHeight) + (index * this.rowGap) + this.y;
                const newInvader = new Invader(
                    'invader',
                    subType,
                    this.invaderConfigs.configs,
                    x,
                    y
                );
                this.invaderList.push(newInvader);
            }
        })

        // Build move sounds
        this.moveSounds.forEach((moveSound) => {
            // Create audio object for sound
            const newSound = Sounds();
            newSound.startTime = moveSound.startTime;
            newSound.stopTime = moveSound.stopTime;
            // Push audio object into moveSounds array
            this.moveSounds.push(newSound);
        });
    }

    purge() {
        this.invaderList.forEach((invader, index) => {
            if (!invader.isActive) {
                this.removeInvader(index);
            }
        });
    }

    removeInvader(index) {
        this.invaderList.splice(index, 1);
    }

    move = () => {
        const isExploding = this.invaderList.find(invader => invader.animationType === 'exploding');
        if (isExploding) return;

        this.currentMoveSound = this.moveSounds[this.currentMoveSoundIndex];
        this.currentMoveSoundIndex++;

        if (this.currentMoveSoundIndex > this.moveSounds.length - 1) {
            this.currentMoveSoundIndex = 0;
        }

        // Check if invaders are touching right or left walls and reverse direction if they are
        this.isRhWall = this.invaderList.find((invader) => invader.x + invader.width >= SCREEN.configs['main'].width - INVADERS.configs[this.levelName].moveSpeed);
        this.isLhWall = this.invaderList.find((invader) => invader.x <= 0);

        if (this.isRhWall && this.direction === 'right') {
            this.shiftDown = true;
            this.direction = 'left';
        }
        if (this.isLhWall && this.direction === 'left') {
            this.shiftDown = true;
            this.direction = 'right';
        }
        if (this.shiftDown) {
            this.invaderList.forEach((invader) => {
                invader.move('down');
            });
            this.shiftDown = false;
        } else {
            this.invaderList.forEach((invader) => {
                invader.move(this.direction);
            });
        }
        this.shiftDown = false;
    }

    render() {
        this.invaderList.forEach((invader) => {
            invader.render();
        });
    }

    update = (delta) => {
        this.invaderList.forEach(invader => invader.update(delta));
    }
}