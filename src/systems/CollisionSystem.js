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

        if (this.bullets.bulletList.length) {
            tankBulletIndex = this.bullets.bulletList.findIndex((bullet) => {
                return bullet.subType === 'tank';
            });
        }

        if (tankBulletIndex > -1) {
            const tankBullet = this.bullets.bulletList[tankBulletIndex];

            // Tank bullet vs invaders
            for (const invader of this.invaders.invaderList) {
                if (invader.animationType === 'exploding') return;
                collisionInfo = this.collisionDetector.collisionInfo(tankBullet, invader);

                if (collisionInfo.didCollide) {
                    if (!invader.isExploding) {
                        const collision = {
                            type: 'Tank vs Invader',
                            bullet: tankBullet,
                            bulletIndex: tankBulletIndex,
                            target: invader
                        };
                        this.collisions.push(collision);
                        break;
                    }
                }
            };

            // Tank bulllet vs cities
            for (const city of this.cities.cityList) {
                collisionInfo = this.collisionDetector.collisionInfo(tankBullet, city);

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
                collisionInfo = this.collisionDetector.collisionInfo(tankBullet, this.mothership);

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

            // Run through any invaders bullets in bulletsList
            this.bullets.bulletList.forEach((bullet, index) => {
                if (bullet.subType.slice(0, 7) === 'invader') {
                    // Invader vs Tank
                    collisionInfo = this.collisionDetector.collisionInfo(bullet, this.tank);

                    if (collisionInfo.didCollide && !this.tank.isAnimating) {
                        collisionObj = {
                            type: 'Invader vs Tank',
                            bullet: bullet,
                            bulletIndex: index,
                            target: this.tank
                        };
                        this.collisions.push(collisionObj);
                    }

                    // Invader vs cities
                    this.cities.cityList.forEach((city) => {
                        damageCity = false;
                        collisionInfo = this.collisionDetector.collisionInfo(bullet, city);
                        if (collisionInfo.didCollide) {
                            // Check the area directly above the bullet to see whether it's solid
                            // Area to check imagedata of
                            topLeftX = bullet.x - city.x; // Bullet x
                            topLeftY = bullet.y - city.y + bullet.height; // 1 px below bullet y
                            width = bullet.width;
                            height = 1;
                            imgData = city.ctx.getImageData(topLeftX, topLeftY, width, height);

                            for (let i = 0; i < imgData.data.length; i += 4) {
                                if (imgData.data[i + 3] === 255) {
                                    damageCity = true;
                                }
                            }

                            if (damageCity) { // If pixel alpha is 255
                                collisionObj = {
                                    type: 'Invader vs City',
                                    bullet: bullet,
                                    bulletIndex: index,
                                    target: city
                                };
                                this.collisions.push(collisionObj);
                                // console.trace(collisionObj);
                            }
                        }
                    });
                }
            });
        }
    }

    handleMothershipBulletCollisions = () => {
        let collisionInfo;
        let collisionObj;

        this.bullets.bulletList.forEach((bullet, index) => {
            if (bullet.subType === 'mothership') {
                collisionInfo = this.collisionDetector.collisionInfo(bullet, this.tank);

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