const cityCollisionMap = new Map([
    [
        subType => subType.startsWith('invader'),
        (collision, configs) => {
            const topLeftY = collision.bullet.y + collision.bullet.height + collision.lookAhead - collision.target.y;
            return topLeftY;
        }
    ],
    [
        subType => subType === 'tank',
        (collision, configs) => {
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