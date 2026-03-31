const cityCollisionMap = new Map([
    [
        subType => subType.startsWith('invader'),
        (city, collisionObject, configs) => {
            const bulletConfig = configs.find(c => c.type === 'bullet').configs[collisionObject.subType];
            const topLeftY = collisionObject.y - city.y + collisionObject.height - bulletConfig.height;
            return topLeftY;
        }
    ],
    [
        subType => subType === 'tank',
        (collision, configs) => {
            // const bulletConfig = configs.find(c => c.type === 'bullet').configs['tank'];
            const topLeftY = collision.bullet.y - collision.lookAhead - collision.target.y - collision.target.spriteInfo.damageHeight;
            return topLeftY;
        }
    ],
    [
        subType => subType === 'mothership',
        (city, collisionObject, configs) => {
            debugger;
        }
    ]
]);

export default cityCollisionMap;