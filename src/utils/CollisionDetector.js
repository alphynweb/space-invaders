class CollisionDetector {
    collisionInfo(missile, target) {
        const collidingSides = [];

        let isIntersecting = false;
        let didCollide = false; // true = on the next frame missile is within rectangular boundaries of target and now needs to check along number = speed pixel by pixel
        let lookAhead = 0;

        // Use pixel speed to calculate whether it passes through object on next tick - check each value in front or beside it
        for (let i = 0; i < missile.speed; i++) {
            // Check top of missile with missile going upwards
            switch (missile.direction) {
                case 'up':
                    isIntersecting =
                        missile.y - i < target.y + target.height &&
                        missile.y - i > target.y &&
                        (missile.x > target.x && missile.x < target.x - target.width || // Lh of missile is horizontally within target width
                            missile.x + missile.width > target.x && missile.x + missile.width < target.x + target.width); // Rh of missile is horizontally within target width

                    if (isIntersecting) {
                        lookAhead = i;
                    };
                    break;
                case 'down':
                    isIntersecting =
                        missile.y + missile.height + i > target.y && // Missile bottom is below target top
                        missile.y + missile.height + i < target.y + target.height && // Missile bottom is above target bottom
                        (missile.x > target.x && missile.x < target.x - target.width || // Lh of missile is horizontally within target width
                            missile.x + missile.width > target.x && missile.x + missile.width < target.x + target.width); // Rh of missile is horizontally within target width
                    break;
                case 'left':

                case 'right':
            }

            if (isIntersecting) break;
        }

        if (isIntersecting) {
            // Establish lookahead by checking pixels in front of bullet to the same length as speed.

            // Area to check imagedata of a recangle vertically above the bullet which is bullet.width wide and bullet.speed tall. If collision detected, 
            // then send collision data of the place where a collision was detected in teh lookahead and that is the bottom left coord of the city damage sprite

            let topLeftX = missile.x - target.x; // Bullet x
            let topLeftY = missile.y - target.y - 1; // 1 px above bullet y

            const width = missile.width;
            const height = 1;
            let lookAhead = 0;

            for (let l = 0; l < missile.speed; l++) {
                const imgData = target.ctx.getImageData(topLeftX, topLeftY - l, width, height);

                for (let i = 0; i < imgData.data.length; i += 4) {
                    if (imgData.data[i + 3] === 255) {
                        didCollide = true;
                        lookAhead = l;
                    }
                }

                if (didCollide) {
                    break;
                }
            }

            if (didCollide) {
                // Work out which sides are closest (which sides are touching)
                // Distance between missile right and target left
                const missileRighttargetLeft = (target.x) - (missile.x + missile.width);
                // Distance betwwen missile left and target right
                const missileLefttargetRight = (missile.x) - (target.x + target.width);
                // Distance between missile top and target bottom
                const missileToptargetBottom = (target.y + target.height) - (missile.y - lookAhead);
                // Distance between missile bottom and target top
                const missileBottomtargetTop = (missile.y - lookAhead) - (target.y);

                collidingSides.push(
                    // Convert negative values to positive ones

                    // {
                    //     "sides": "missileRight", "distance": Math.abs(missileRighttargetLeft)
                    // },
                    // {
                    //     "sides": "missileLeft", "distance": Math.abs(missileLefttargetRight)
                    // },
                    {
                        "sides": "missileTop", "distance": Math.abs(missileToptargetBottom)
                    },
                    // {
                    //     "sides": "missileBottom", "distance": Math.abs(missileBottomtargetTop)
                    // }
                );

                collidingSides.sort((a, b) => a.distance - b.distance);
            }

            let collisionInfo = {
                didCollide: didCollide,
                collidingSides: collidingSides[0],
                lookAhead: lookAhead
            };

            return collisionInfo;
        }

        return false;
    }
}

const collisionDetector = new CollisionDetector();
export default collisionDetector;