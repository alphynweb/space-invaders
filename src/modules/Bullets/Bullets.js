import { SCREEN } from '../../config';
import Bullet from '../Bullet/Bullet';

export default class Bullets {
    constructor(screen) {
        this.screen = this.screen;
        this.bulletList = [];
    }

    initializeLevel = () => {
        this.bulletList = [];
    }

    addBullet(type, subType, configs, x, y) {
        const newBullet = new Bullet(
            type,
            subType,
            configs,
            x,
            y
        );
        this.bulletList.push(newBullet);
    }

    removeBullet(index) {
        this.bulletList.splice(index, 1);
    }

    move() {
        this.bulletList.forEach((bullet, index) => {
            // If tank bullet reaches top of screen, remove it from bulletList
            if (bullet.subType === 'tank' && bullet.y < 0) {
                this.removeBullet(index);
            }
            // If invader bullet reaches bottom of screen, remove it from bulletList
            if ((
                bullet.subType === 'invader1' ||
                bullet.subType === 'invader2' ||
                bullet.subType === 'invader3' ||
                bullet.subType === 'mothership'
            ) && bullet.y > SCREEN.configs['main'].height) {
                this.removeBullet(index);
            }
            bullet.move();
        });
    }

    render() {
        this.bulletList.forEach((bullet) => {
            bullet.render();
        });
    }
}