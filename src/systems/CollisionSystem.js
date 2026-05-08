export default class CollisionSystem {
    constructor(
        screen,
        collisionDetector,
        tankConfig,
        invadersConfigArray,
        cityConfig,
        tank,
        invaders,
        mothership,
        bullets,
        cities
    ) {
        this.screen = screen;
        this.tankConfig = tankConfig;
        this.invadersConfigArray = invadersConfigArray;
        this.cityConfig = cityConfig;

        this.collisionDetector = collisionDetector;
        this.tank = tank;
        this.invaders = invaders;
        this.mothership = mothership;
        this.bullets = bullets;
        this.cities = cities;

        this.invaders.invaderList = this.invaders.invaderList.reverse();

        this.collisions = [];
    }

    reset = () => {
        this.collisions = [];
    }

    checkCollisions() {
        this.collisions = [];
        this.handleTankBulletCollisions();
        this.handleInvaderBulletCollisions();
        this.handleMothershipBulletCollisions();
        this.handleInvadersBottom();
    }

    handleTankBulletCollisions = () => {
        let tankBulletIndex;
        let collisionInfo;
        let bulletCanvasInfo;
        let targetCanvasInfo;

        if (this.bullets.bulletList.length) {
            tankBulletIndex = this.bullets.bulletList.findIndex((bullet) => {
                return bullet.subType === 'tank';
            });
        }

        if (tankBulletIndex > -1) {
            const tankBullet = this.bullets.bulletList[tankBulletIndex];

            const invaderList = this.invaders.invaderList;

            // Tank bullet vs invaders
            for (const invader of invaderList) {
                if (invader.animationType === 'exploding') return;

                bulletCanvasInfo = {
                    ctx: this.screen.ctx,
                    x: 0,
                    y: 0,
                    width: this.screen.width,
                    height: this.screen.height
                }

                targetCanvasInfo = {
                    ctx: this.screen.ctx,
                    x: 0,
                    y: 0,
                    width: this.screen.width,
                    height: this.screen.height
                }

                collisionInfo = this.collisionDetector.collisionInfo(bulletCanvasInfo, targetCanvasInfo, tankBullet, invader);

                if (collisionInfo.didCollide) {
                    if (!invader.isExploding) {
                        const collision = {
                            type: 'Tank vs Invader',
                            bullet: tankBullet,
                            bulletIndex: tankBulletIndex,
                            target: invader
                        };
                        this.collisions.push(collision);
                        // break;
                    }
                }
            };

            // Tank bulllet vs cities
            for (const city of this.cities.cityList) {

                bulletCanvasInfo = {
                    ctx: this.screen.ctx,
                    x: 0,
                    y: 0,
                    width: this.screen.width,
                    height: this.screen.height
                }

                targetCanvasInfo = {
                    ctx: city.ctx,
                    x: city.x,
                    y: city.y,
                    width: city.width,
                    height: city.height
                }

                collisionInfo = this.collisionDetector.collisionInfo(bulletCanvasInfo, targetCanvasInfo, tankBullet, city);

                if (collisionInfo.didCollide) {
                    const collision = {
                        type: 'Tank vs City',
                        bullet: tankBullet,
                        bulletIndex: tankBulletIndex,
                        target: city,
                        lookAhead: collisionInfo.lookAhead
                    };
                    this.collisions.push(collision);
                    break;
                }
            }

            // Tank bullet vs mothership
            if (this.mothership.isActive) {
                if (this.mothership.animationType === 'exploding') return;

                bulletCanvasInfo = {
                    ctx: this.screen.ctx,
                    x: 0,
                    y: 0,
                    width: this.screen.width,
                    height: this.screen.height
                }

                targetCanvasInfo = {
                    ctx: this.screen.ctx,
                    x: 0,
                    y: 0,
                    width: this.screen.width,
                    height: this.screen.height
                }

                collisionInfo = this.collisionDetector.collisionInfo(bulletCanvasInfo, targetCanvasInfo, tankBullet, this.mothership);

                if (collisionInfo.didCollide) {
                    const collision = {
                        type: 'Tank vs Mothership',
                        bullet: tankBullet,
                        bulletIndex: tankBulletIndex,
                        target: this.mothership
                    };
                    this.collisions.push(collision);
                }
            }
        }
    }

    handleInvaderBulletCollisions = () => {
        // Collision detector for invader bullets
        if (this.bullets.bulletList.length) {
            let invader;
            let bulletInfo;
            let cityHit; // City that is hit
            // Area to check imagedata of    
            let topLeftX;
            let topLeftY;
            let width;
            let height;
            let imgData;
            let damageCity = false;
            let collisionObj;
            let collisionInfo;
            let bulletCanvasInfo;
            let targetCanvasInfo;

            // Run through any invaders bullets in bulletsList
            this.bullets.bulletList.forEach((bullet, index) => {
                if (bullet.subType.slice(0, 7) === 'invader') {
                    // Invader vs Tank

                    bulletCanvasInfo = {
                        ctx: this.screen.ctx,
                        x: 0,
                        y: 0,
                        width: this.screen.width,
                        height: this.screen.height
                    }

                    targetCanvasInfo = {
                        ctx: this.screen.ctx,
                        x: 0,
                        y: 0,
                        width: this.screen.width,
                        height: this.screen.height
                    }


                    collisionInfo = this.collisionDetector.collisionInfo(bulletCanvasInfo, targetCanvasInfo, bullet, this.tank,);

                    if (collisionInfo.didCollide && !this.tank.isAnimating) {
                        collisionObj = {
                            type: 'Invader vs Tank',
                            bullet: bullet,
                            bulletIndex: index,
                            target: this.tank,
                            lookAhead: collisionInfo.lookAhead
                        };
                        this.collisions.push(collisionObj);
                    }

                    // Invader vs cities
                    for (const city of this.cities.cityList) {
                        damageCity = false;

                        bulletCanvasInfo = {
                            ctx: this.screen.ctx,
                            x: 0,
                            y: 0,
                            width: this.screen.width,
                            height: this.screen.height
                        }

                        targetCanvasInfo = {
                            ctx: city.ctx,
                            x: city.x,
                            y: city.y,
                            width: city.width,
                            height: city.height
                        }

                        collisionInfo = this.collisionDetector.collisionInfo(bulletCanvasInfo, targetCanvasInfo, bullet, city);

                        if (collisionInfo.didCollide) {
                            const collision = {
                                type: 'Invader vs City',
                                bullet: bullet,
                                bulletIndex: index,
                                target: city,
                                lookAhead: collisionInfo.lookAhead
                            };
                            this.collisions.push(collision);
                            break;
                        }
                    };
                }
            });
        }
    }

    handleMothershipBulletCollisions = () => {
        let collisionInfo;
        let collisionObj;
        let bulletCanvasInfo;
        let targetCanvasInfo;

        this.bullets.bulletList.forEach((bullet, index) => {
            if (bullet.subType === 'mothership') {
                bulletCanvasInfo = {
                    ctx: this.screen.ctx,
                    x: 0,
                    y: 0,
                    width: this.screen.width,
                    height: this.screen.height
                }

                targetCanvasInfo = {
                    ctx: this.screen.ctx,
                    x: 0,
                    y: 0,
                    width: this.screen.width,
                    height: this.screen.height
                }
                collisionInfo = this.collisionDetector.collisionInfo(bulletCanvasInfo, targetCanvasInfo, bullet, this.tank);

                if (collisionInfo.didCollide && !this.tank.isAnimating) {
                    collisionObj = {
                        type: 'Mothership vs Tank',
                        bullet: bullet,
                        bulletIndex: index,
                        target: this.tank
                    };
                    this.collisions.push(collisionObj);
                }
            }
        });
    }

    handleInvadersBottom = () => {
        let collisionObj;

        for (let invader of this.invaders.invaderList) {
            if (invader.y + invader.height >= this.screen.height) {
                console.log(this.screen.height);
                console.log(invader.y + invader.height);
                collisionObj = {
                    type: 'Invaders vs Bottom',
                    bullet: null,
                    bulletIndex: null,
                    target: null
                }
                this.collisions.push(collisionObj);
                break;
            }
        }
    }
}