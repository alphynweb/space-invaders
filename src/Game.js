// Config
import {
    CITY,
    TEXT,
    INVADER,
    INVADERS,
    LIVES,
    MOTHERSHIP,
    SCREEN,
    TANK,
    BULLET,
    BUTTON
} from './config';

// Events
import { EventEmitter } from 'events';

//Utils
import collisionDetector from './utils/CollisionDetector';
import inputHandler from './utils/inputHandler';

// Definitions
import InvadersDefinition from './definitions/InvadersDefinition';

// Modules
import Screen from './modules/Screen/Screen';
import Tank from './modules/Tank/Tank';
// import Invader from './modules/Invader/Invader';
import Invaders from './modules/invaders/Invaders';
import Bullets from './modules/Bullets/Bullets';
import Cities from './modules/Cities/Cities';
import cityCollisionMap from './modules/City/cityCollisionMap';
import Mothership from './modules/Mothership/Mothership';
import Score from './modules/Score/Score';
import Lives from './modules/Lives/Lives';
import GameLoop from './GameLoop';
import GameStates from './controllers/GameStates';

import IntroScreen from './states/IntroScreen';
import GameOver from './states/GameOver';
import StartLevel from './states/StartLevel';
import FinishLevel from './states/FinishLevel';
import CollisionSystem from './systems/CollisionSystem';
import SoundManager from './systems/SoundManager';
import GraphicsManager from './systems/GraphicsManager';

export default class Game {
    constructor() {
        this.eventEmitter = new EventEmitter();

        const originalEmit = this.eventEmitter.emit;
        this.eventEmitter.emit = function (event, ...args) {
            console.log('event', event, args);
            return originalEmit.call(this, event, ...args);
        };

        this.cityConfig = CITY;
        this.cityCollisionMap = cityCollisionMap;
        this.textConfig = TEXT;
        this.invaderConfig = INVADER;
        this.invadersConfig = INVADERS;
        this.bulletConfig = BULLET;
        this.mothershipConfig = MOTHERSHIP;
        this.tankConfig = TANK;
        this.buttonConfig = BUTTON;
        this.livesConfig = LIVES;
        this.screenConfig = SCREEN;

        this.livesLeft = this.livesConfig.lives;
        this.maxLevel = Object.keys(this.invadersConfig.configs).length;

        this.screen = Screen();
        this.screen.ctx.textAlign = 'center';
        this.screen.textBaseline = 'middle';

        this.screen.render();

        this.wave = 1;
        this.lives = null;
        this.livesLeft = this.livesConfig.lives;
        this.tank = null;
        this.invaders = null;
        this.bullets = null;
        this.cities = null;
        this.mothership = null;
        this.mothershipTimer = 0;
        this.mothershipMinTime = this.mothershipConfig.configs['main'].timingMin;
        this.mothershipMaxTime = this.mothershipConfig.configs['main'].timingMax;
        this.collisionInfo = null;
        this.now = null;
        this.isTankBullet = false;
        this.invaderGroupY = null;
        this.currentLevel = 1;
        this.collisionDetector = collisionDetector;

        this.screenCanvas = document.getElementById('screenCanvas');

        this.gameLoop = new GameLoop(this.onTick);

        this.gameStates = new GameStates(
            this.onIntro,
            this.onStartGame,
            this.onRunGame,
            this.onPauseGame,
            this.onStartNewLevel,
            this.onFinishLevel,
            this.onLoseLife,
            this.onEndGame
        );



        this.volumeControlContainer = document.getElementById('volume');
        this.volumeControl = document.getElementById('volumeControl');

        this.init();
    }

    init = async () => {
        await this.setupGraphics('/graphics/graphicsSprite.png');
        await this.graphicsManager.init();

        await this.setupAudio('/audio/audioSprite.mp3');
        await this.soundManager.init();

        this.soundManager.mute();


        this.setupInstances();
        this.setupStates();
        this.setupDefinitions();
        this.setupEntities();

        inputHandler.init();

        this.gameStates.currentState = this.gameStates.intro;
        this.gameLoop.start();
    }

    setupInstances = () => {
        this.score = new Score();
        this.lives = new Lives(this.livesConfig.configs);

        this.tank = new Tank(
            this.tankConfig.type,
            'main',
            this.tankConfig.configs,
            this.screen
        );

        this.invaders = new Invaders(
            this.invadersConfig,
            this.invaderConfig,
        );

        this.mothership = new Mothership(
            this.mothershipConfig.type,
            'main',
            this.mothershipConfig.configs,
            this.mothershipConfig.configs['main'].x,
            this.mothershipConfig.configs['main'].y
        );

        this.bullets = new Bullets();

        this.cities = new Cities(
            [
                this.screenConfig,
                this.cityConfig,
                this.invaderConfig,
                this.tankConfig,
                this.bulletConfig
            ]
        );

        this.collisionSystem = new CollisionSystem(
            this.screen,
            this.collisionDetector,
            this.tankConfig,
            this.invaderConfig,
            this.cityConfig,
            this.tank,
            this.invaders,
            this.mothership,
            this.bullets,
            this.cities
        );
    }

    setupStates = () => {
        this.startLevel = null;
        this.finishLevel = null;
        this.introScreen = null;
        this.gameOver = null;

        this.introScreen = new IntroScreen(
            this.eventEmitter,
            this.graphicsManager,
            this.screen,
            this.onStartGame,
            this.textConfig,
            this.mothershipConfig,
            this.invaderConfig,
            this.buttonConfig
        );

        this.startLevel = new StartLevel(
            this.graphicsManager,
            this.screen,
            this.textConfig,
            this.currentLevel
        );

        this.finishLevel = new FinishLevel(
            this.graphicsManager,
            this.screen,
            this.textConfig,
            this.currentLevel
        );

        this.gameOver = new GameOver(
            this.eventEmitter,
            this.graphicsManager,
            this.screen,
            this.onStartGame,
            this.onEndGame,
            this.textConfig,
            this.buttonConfig,
            this.score
        );

    };

    setupDefinitions = () => {
        const configs = this.invadersConfig;
        this.invadersDefinition = new InvadersDefinition();
        this.invadersDefinition.setLevelConfig(
            configs,
            this.wave,
        );
    }

    setupEntities = () => {
        this.tank.initializeLevel();

        this.invaders.initializeLevel(
            this.invadersDefinition.getLevelConfig()
        );

        this.mothership.initializeLevel();
        this.resetMothershipSpawnTime();

        this.cities.initializeLevel();

        this.bullets.initializeLevel();

        this.now = 0;
        this.invaderMoveTime = this.invadersConfig.configs['wave' + this.wave].moveTime - this.invadersConfig.configs['wave' + this.wave].speedIncrease;
    }

    setupGraphics = async (graphicsSpriteUrl) => {
        const ctx = document.getElementById('screenCanvas').getContext('2d');

        const entityMap = new Map([
            ['tank', this.tankConfig],
            ['invader', this.invaderConfig],
            ['mothership', this.mothershipConfig],
            ['bullet', this.bulletConfig],
            ['button', this.buttonConfig]
        ]);

        this.graphicsManager = new GraphicsManager(
            this.eventEmitter,
            graphicsSpriteUrl,
            entityMap,
            ctx
        );
    }

    setupAudio = async (audioSpriteUrl) => {
        const soundsMap = new Map([
            ['invaderExplosion', { start: 1.305, stop: 1.680 }],
            ['tankExplosion', { start: 7.05, stop: 7.95 }],
            ['tankBulletFired', { start: 0.008, stop: 0.307 }],
            ['invadersMoved', { start: 2.676, stop: 2.768 }],
            ['mothershipExplosion', { start: 7.05, stop: 7.95 }]
        ]);

        this.soundManager = new SoundManager(
            audioSpriteUrl,
            soundsMap
        );
    }

    setup = () => {
        this.invaderMoveTime = this.invadersConfig.configs['wave' + this.wave].moveTime;
        this.score.reset();
        this.lives.reset();
        this.tank.reset();
        this.invaders.reset();
        this.currentLevel = 1;
        this.setupDefinitions();
        this.invaders.initializeLevel(
            this.invadersDefinition.getLevelConfig()
        );
        this.cities.reset();
        this.cities.initializeLevel();
        this.cities.cityList.forEach(city => {
            this.graphicsManager.renderCity(city);
        });
        this.mothership.reset();
        this.bullets.initializeLevel();
    }

    checkCollisions = () => {
        this.collisionSystem.checkCollisions();
        const collisions = this.collisionSystem.collisions;

        const collisionHandlers = {
            "Tank vs Invader": (collision) => {
                const invader = collision.target;
                this.score.increase(collision.target.score);
                this.invaderMoveTime -= this.invadersConfig.configs['wave' + this.wave].speedIncrease;
                this.bullets.removeBullet(collision.bulletIndex);
                this.soundManager.play('invaderExplosion');
                invader.destroy();
            },
            "Tank vs City": (collision) => {
                const bullet = collision.bullet;
                const city = collision.target;
                const spriteInfo = city.spriteInfo;

                const topLeftX = bullet.x - city.x - (spriteInfo.damageWidth / 2);
                let topLeftY;
                const subType = bullet.subType;

                const configs = [
                    this.screenConfig,
                    this.cityConfig,
                    this.invaderConfig,
                    this.tankConfig,
                    this.bulletConfig
                ];

                for (const [matchFn, handlerFn] of this.cityCollisionMap) {
                    if (matchFn(subType)) {
                        topLeftY = handlerFn(collision, configs);
                        break;
                    }
                }

                this.graphicsManager.damageCity(city, topLeftX, topLeftY);
                this.bullets.removeBullet(collision.bulletIndex);
            },
            "Tank vs Mothership": (collision) => {
                this.mothership.destroy();
                this.resetMothershipSpawnTime();
                this.bullets.removeBullet(collision.bulletIndex);
                this.score.increase(collision.target.score);
                this.soundManager.play('mothershipExplosion');
            },
            "Invader vs Tank": (collision) => {
                inputHandler.currentKeysPressed = [];
                this.bullets.removeBullet(collision.bulletIndex);
                this.tank.destroy();
                this.lives.lose();
                this.soundManager.play('tankExplosion');
                this.gameStates.currentState = this.gameStates.lose;
            },
            "Invader vs City": (collision) => {
                const bullet = collision.bullet;
                const city = collision.target;
                const spriteInfo = city.spriteInfo;

                const topLeftX = bullet.x - city.x - (spriteInfo.damageWidth / 2);
                let topLeftY;
                const subType = bullet.subType;

                const configs = [
                    this.screenConfig,
                    this.cityConfig,
                    this.invaderConfig,
                    this.tankConfig,
                    this.bulletConfig
                ];

                for (const [matchFn, handlerFn] of this.cityCollisionMap) {
                    if (matchFn(subType)) {
                        topLeftY = handlerFn(collision, configs);
                        break;
                    }
                }

                this.graphicsManager.damageCity(city, topLeftX, topLeftY);
                this.bullets.removeBullet(collision.bulletIndex);
            },
            "Mothership vs Tank": (collision) => {
                inputHandler.currentKeysPressed = [];
                this.bullets.removeBullet(collision.bulletIndex);
                this.tank.destroy();
                this.lives.lose();
                if (this.lives.currentLives === 0) {
                    this.gameStates.currentState = this.gameStates.over;
                    return;
                }
                this.soundManager.play('tankExplosion');
                this.gameStates.currentState = this.gameStates.lose;
            },
            "Mothership vs City": (collision) => {

            },
            "Invaders vs Bottom": (collision) => {
                this.tank.destroy();
                this.lives.lose(this.lives.livesLeft);
                this.soundManager.play('tankExplosion');
                this.gameStates.currentState = this.gameStates.lose;
            }
        }

        if (collisions.length) {
            collisions.forEach((collision) => {
                const handlerType = collisionHandlers[collision.type];
                if (handlerType) {
                    handlerType(collision);
                }
            });
            this.collisionSystem.reset();
        }
    }

    render = () => {
        this.screen.clear();
        this.graphicsManager.render(this.tank);
        this.invaders.invaderList.forEach((invader) => {
            this.graphicsManager.render(invader);
        });
        this.graphicsManager.render(this.mothership);

        if (this.mothership.animationType === 'exploding') {
            const textX = this.mothership.x + (this.mothership.width / 2);
            const textY = this.mothership.y + (this.mothership.height / 2);

            this.graphicsManager.renderText(
                this.textConfig.configs['gameText'].font,
                this.textConfig.configs['gameText'].fillStyle,
                textX,
                textY,
                this.mothership.score
            );
        }

        this.bullets.bulletList.forEach((bullet) => {
            this.graphicsManager.render(bullet);
        });

        const scoreTextConfig = this.textConfig.configs['score'];
        this.graphicsManager.renderText(
            scoreTextConfig.font,
            scoreTextConfig.fillStyle,
            scoreTextConfig.x,
            scoreTextConfig.y,
            'Score: ' + this.score.currentScore
        );

        this.renderLives();
    }

    renderLives = () => {
        const config = this.livesConfig.configs['main'];
        let x = config.x;
        const y = config.y;
        const livesGap = config.livesGap;
        const livesLeft = this.lives.livesLeft;
        const spriteInfo = config.spriteInfo['normal'];
        const width = spriteInfo.width;

        for (let i = 0; i < livesLeft; i++) {
            this.graphicsManager.renderSprite(
                spriteInfo,
                x,
                y
            )
            x += livesGap + width;
        }
    }

    purge = () => {
        this.invaders.purge(); // Get rid of any invaders that are destroyed.
        this.mothership.purge(); // Get rid of mothership if destroyed

        if (this.invaders.invaderList.length < 1) {
            this.cities.clear();
            this.gameStates.currentState = this.gameStates.finishLevel;
        }
    }

    onTick = (currentTime) => {
        this.gameStates.currentState(currentTime);
    }

    onIntro = () => {
        this.screen.clear();
        const delta = this.gameLoop.delta;
        this.introScreen.update(delta);
        this.startButton = document.getElementById('startButton');
    }

    onStartGame = () => {
        this.invaderMoveTime = this.invadersConfig.configs['wave' + this.wave].moveTime;
        this.volumeControlContainer.style.visibility = "visible";
        this.volumeControl.oninput = () => {
            this.soundManager.onSetVolume(this.volumeControl.value);
        }

        this.setup();

        this.gameStates.currentState = this.gameStates.run;
    }

    onRunGame = (currentTime) => {
        this.purge();
        this.checkCollisions();
        this.bullets.move();
        this.moveInvaders(currentTime);

        if (this.mothership.isActive && !this.mothership.animationType !== 'exploding') {
            this.moveMothership();
            this.createMothershipBullets();
        }

        if (inputHandler.isKeyPressed('Space')) {
            this.onTankBulletFired();
        }
        if (inputHandler.isKeyPressed('ArrowRight')) {
            this.tank.move('right');
        }
        if (inputHandler.isKeyPressed('ArrowLeft')) {
            this.tank.move('left');
        }

        const delta = this.gameLoop.delta;
        this.invaders.update(delta);
        this.mothership.update(delta);
        this.tank.update(delta);

        this.mothershipTimer += delta;

        if (this.mothershipTimer > this.mothershipConfig.configs['main'].timingMin) {
            this.spawnMothership();
            this.mothershipTimer = 0;
        }

        this.render();
    }

    onPauseGame = () => {
        this.gameLoop.stop();
    }

    onFinishLevel = () => {
        this.finishLevel.update(this.gameLoop.delta);
        this.finishLevel.render();

        if (!this.finishLevel.state) {
            const noOfLevels = Object.keys(this.invadersConfig.configs).length;
            this.currentLevel++;
            this.setupStates();
            this.startLevel.state = 'show';
            this.bullets.bulletList = [];
            this.gameStates.currentState = this.gameStates.startLevel;
        }
    }

    onStartNewLevel = () => {
        this.screen.clear();
        this.startLevel.render();
        this.startLevel.update(this.gameLoop.delta);
        if (!this.startLevel.state) {
            this.wave++;
            this.wave = Math.min(this.wave, this.maxLevel);
            this.invaders.reset();
            this.setupDefinitions();
            this.invaders.initializeLevel(
                this.invadersDefinition.getLevelConfig()
            );
            this.invaderMoveTime = this.invadersConfig.configs['wave' + this.wave].moveTime;
            this.cities.reset();
            this.cities.initializeLevel();
            this.cities.cityList.forEach(city => {
                this.graphicsManager.renderCity(city);
            });
            this.mothership.reset();
            this.bullets.initializeLevel();

            this.gameStates.currentState = this.gameStates.run;
        }

        this.setupDefinitions();
    }

    onLoseLife = () => {
        const delta = this.gameLoop.delta;
        this.tank.update(delta);
        if (this.tank.animationType !== 'normal') return;
        if (this.lives.livesLeft <= 0) {
            this.cities.clear();
            this.gameOver.score = this.score;
            this.gameOver.init();
            this.gameStates.currentState = this.gameStates.over;
            return;
        }

        this.tank = null;
        this.tank = new Tank(
            this.tankConfig.type,
            'main',
            this.tankConfig.configs,
            this.screen
        );
        this.collisionSystem.tank = this.tank;
        this.gameStates.currentState = this.gameStates.run;
    }

    onEndGame = () => {
        this.screen.clear();
        const delta = this.gameLoop.delta;
        this.bullets.bulletList = [];
        this.gameOver.update(delta);
    }

    createInvaderBullets = () => {
        return;
        // Check how many invader bullets are currently in play
        let invaderBullets = this.bullets.bulletList.filter((bullet) => bullet.subType.includes('invader'));

        let invaderIndex;
        let invader;
        let bottomInvIndex;
        let bottomInv;

        // If it's less than 2(? Arbitrary) for example, then create more randomly so there are always 2
        let noBulletsToCreate = Math.min(this.invaders.invaderList.length - invaderBullets.length, this.invadersDefinition.bullets);
        if (noBulletsToCreate <= 0) return;

        for (let i = 0; i < noBulletsToCreate; i++) {
            // Choose random invader - the bottom one of whatever column
            invaderIndex = Math.floor((Math.random() * this.invaders.invaderList.length));

            invader = this.invaders.invaderList[invaderIndex];

            this.invaders.invaderList.forEach((inv, index) => {
                if (inv.x === invader.x) {
                    bottomInvIndex = index;
                }
            });

            bottomInv = this.invaders.invaderList[bottomInvIndex];

            const subType = bottomInv.subType;

            if (bottomInv.animationType !== 'exploding') {
                this.bullets.addBullet(
                    'bullet',
                    subType,
                    this.bulletConfig.configs,
                    bottomInv.x + (bottomInv.width / 2),
                    bottomInv.y + bottomInv.height
                );
            }
        }
    }

    createMothershipBullets = () => {
        return;
        // Create mothership bomb (Fired when mothership is above tank)
        const mothershipCenter = this.mothership.x + (this.mothership.width / 2);
        const tankCenter = this.tank.x + (this.tank.width / 2);

        if (mothershipCenter === tankCenter || (mothershipCenter < tankCenter + 4 && mothershipCenter > tankCenter - 4)) {
            // Create mothership bomb in bullets list if there isn't already one
            const mothershipBullets = this.bullets.bulletList.filter((bullet) => bullet.subType === 'mothership');

            if (mothershipBullets.length === 0 && this.mothership.animationType === 'normal') {
                this.bullets.addBullet(
                    'bullet',
                    'mothership',
                    this.bulletConfig.configs,
                    mothershipCenter,
                    this.mothership.y + this.mothership.height
                );
            }
        }
    }

    onTankBulletFired() {
        const isTankBullet = this.bullets.bulletList.find((bullet) => {
            return bullet.subType === 'tank';
        });
        if (!isTankBullet) { // If no tank bullet currently in play
            const type = 'bullet';
            const subType = 'tank';
            const x = this.tank.x + (this.tankConfig.configs['main'].width / 2) - (this.bulletConfig.configs[subType].width / 2);
            const y = this.tank.y - this.bulletConfig.configs[subType].height;
            this.bullets.addBullet(
                type,
                subType,
                this.bulletConfig.configs,
                x,
                y
            );
            this.tank.animationType = 'shooting';
            this.soundManager.play('tankBulletFired');
        }
    }

    moveMothership = (currentTime) => {
        if (this.mothership.isActive && !this.mothership.animationType !== 'exploding') {
            this.mothership.move();
            if (this.mothership.x > this.screenConfig.configs['main'].width) {
                this.mothership.reset();
                this.resetMothershipSpawnTime();
            }
        } else {
            if (currentTime > this.mothershipOldTime + this.mothershipNewTime) {
                this.mothershipOldTime = currentTime;
                this.mothership.reset();
                this.resetMothershipTime();
            }
        }
    }

    moveInvaders = (currentTime) => {
        if (currentTime > this.now + this.invaderMoveTime) {
            // Only move invaders etc if none of them are currently being destroyed
            let areInvadersExploding = this.invaders.invaderList.filter((invader) => {
                return invader.isExploding;
            });
            if (!areInvadersExploding.length) {
                this.invaders.move();
                this.createInvaderBullets();
                this.soundManager.play("invadersMoved");
            }
            this.now = currentTime;
        }
    }

    resetMothershipSpawnTime = () => {
        this.mothershipSpawnTime = Math.random() * (this.mothershipMaxTime - this.mothershipMinTime) + this.mothershipMinTime;
    }

    spawnMothership = () => {
        this.mothership.isActive = true;
        const t = 0;
    }
}