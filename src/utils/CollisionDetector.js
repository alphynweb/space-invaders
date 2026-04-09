// Returns collision info and coordinates of collision and lookahead

class CollisionDetector {
    collisionInfo(missileCanvasInfo, targetCanvasInfo, missile, target) {
        const collidingSides = [];

        let willIntersect = false;
        let didCollide = false; // true = on the next frame missile is within rectangular boundaries of target and now needs to check along number = speed pixel by pixel

        // Use pixel speed to calculate whether it passes through object on next tick - check each value in front or beside it
        for (let i = 0; i < missile.speed; i++) {
            // Check top of missile with missile going upwards
            switch (missile.direction) {
                case 'up':
                    willIntersect =
                        missile.y - i < target.y + target.height &&
                        missile.y - i > target.y &&
                        (missile.x > target.x && missile.x < target.x - target.width || // Lh of missile is horizontally within target width
                            missile.x + missile.width > target.x && missile.x + missile.width < target.x + target.width); // Rh of missile is horizontally within target width
                    break;
                case 'down':
                    willIntersect =
                        missile.y + missile.height + i > target.y && // Missile bottom is below target top
                        (missile.x > target.x && missile.x < target.x - target.width || // Lh of missile is horizontally within target width
                            missile.x + missile.width > target.x && missile.x + missile.width < target.x + target.width); // Rh of missile is horizontally within target width
                    break;
                case 'left':

                case 'right':
            }
        }

        if (willIntersect) { // Will intersect on the next tick
            // Establish lookahead by checking pixels in front of bullet to the same length as speed.

            // Area to check imagedata of a recangle vertically above the bullet which is bullet.width wide and bullet.speed tall. If collision detected, 
            // then send collision data of the place where a collision was detected in teh lookahead and that is the bottom left coord of the city damage sprite

            // let x = missile.x; // Bullet x
            let missileTop = missile.y; // City y
            let missileBottom = missile.y + missile.height;
            let imgData;
            let ctx = target.type === 'city' ? target.ctx : screen.ctx;

            const width = missile.width;
            const rowHeight = 1; // Height of rwo of pixels to check
            let lookAhead = 0;

            for (let l = 0; l < missile.speed; l++) {
                switch (missile.direction) {
                    case 'up':
                        if (target.type === 'city') {
                            const cityHitX = Math.abs(missile.x + (missile.width / 2) - target.x);
                            const cityCtxHitY = missileTop - l - target.y - 1;
                            imgData = ctx.getImageData(cityHitX, cityCtxHitY, width, rowHeight);
                        } else {

                        }
                        break;
                    case 'down':
                        if (target.type === 'city') {
                            const cityHitX = Math.abs(missile.x + (missile.width / 2) - target.x);
                            const cityCtxHitY = missileBottom + l - target.y + 1;
                            imgData = ctx.getImageData(cityHitX, cityCtxHitY, width, rowHeight);
                        } else {

                        }
                        break;
                }
                
                for (let i = 0; i < imgData.data.length; i += 4) {
                    if (imgData.data[i + 3] === 255) {
                        didCollide = true;
                        lookAhead = l;
                        break;
                    }
                }

                if (didCollide) {
                    break;
                }
            }

            if (didCollide) {
                // Work out which sides are closest (which sides are touching)
                // Distance between missile right and target left
                // const missileRighttargetLeft = (target.x) - (missile.x + missile.width);
                // Distance betwwen missile left and target right
                // const missileLefttargetRight = (missile.x) - (target.x + target.width);
                // Distance between missile top and target bottom
                const missileToptargetBottom = (target.y + target.height) - (missile.y - lookAhead);
                // Distance between missile bottom and target top
                const missileBottomtargetTop = (missile.y - lookAhead) - (target.y);

                collidingSides.push(
                    // Convert negative values to positive ones

                    // {
                    //     // "sides": "missileRight", "distance": Math.abs(missileRighttargetLeft)
                    // },
                    // {
                    //     // "sides": "missileLeft", "distance": Math.abs(missileLefttargetRight)
                    // },
                    {
                        "sides": "missileTop", "distance": Math.abs(missileToptargetBottom)
                    },
                    {
                        "sides": "missileBottom", "distance": Math.abs(missileBottomtargetTop)
                    }
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


        return {
            didCollide: false
        }
    }
}

const collisionDetector = new CollisionDetector();
export default collisionDetector;