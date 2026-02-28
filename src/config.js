export const SCREEN = {
    type: 'screen',
    configs: {
        main: {
            subType: 'main',
            width: 1046,
            height: 800
        }
    }
};

export const LIVES = {
    type: 'lives',
    configs: {
        main: {
            x: 600,
            y: 20,
            lives: 1,
            livesGap: 10, // Space between lives at top of screen
            spriteInfo: {
                normal: {
                    x: 0,
                    y: 0,
                    width: 52,
                    height: 32
                }
            }
        }
    }
};

export const TEXT = {
    type: 'text',
    configs: {
        gameText: {
            y: 40, // Height at which lives and score etc are ren
            font: 'bold 20px arial',
            arrowFont: 'bold 40px arial',
            fillStyle: '#fff'
        },
        score: {
            x: 50,
            y: 40,
            font: 'bold 20px arial',
            fillStyle: '#fff'
        }
    }
};

export const BUTTON = {
    type: 'button',
    configs: {
        startButton: {
            x: 200,
            y: 500,
            width: 200,
            height: 50,
            spriteInfo: {
                normal: {
                    x: 0,
                    y: 463,
                    width: 120,
                    height: 37
                },
                hover: {
                    x: 0,
                    y: 463,
                    width: 120,
                    height: 37
                },
                pressed: {
                    x: 0,
                    y: 463,
                    width: 120,
                    height: 37
                }
            }
        }
    }
}

export const TANK = {
    type: 'tank',
    configs: {
        main: {
            x: 0,
            y: SCREEN.configs['main'].height - 50,
            speed: 4,
            width: 52,
            height: 32,
            explosionDuration: 2000,
            spriteInfo: {
                normal: {
                    x: 0,
                    y: 0,
                    width: 52,
                    height: 32
                },
                shooting: {
                    x: 0,
                    y: 0,
                    width: 52,
                    height: 32
                },
                exploding: {
                    x: 756,
                    y: 108,
                    width: 44,
                    height: 26
                }
            }
        }
    }
};

export const CITY = {
    type: 'city',
    configs: {
        main: {
            y: SCREEN.configs['main'].height - 180,
            width: 88,
            height: 64,
            no: 4,
            indent: 50, // Space between outer cities and edge of screen
            spriteInfo: {
                x: 52,
                y: 0,
                damageX: 52,
                damageY: 200,
                damageWidth: 20,
                damageHeight: 20
            }
        }
    }
};

export const INVADERS = {
    type: 'invaders',
    configs: {
        wave1: {
            moveSpeed: 20, // Distance invaders move horizontally
            shiftDownSpeed: 30, // Distance invaders shift down by when they reach the edge of the screen
            bullets: 1, // Number of bullets that invaders produce at any one time
            y: 100,
            maxY: 300,
            columnWidth: 50,
            rowHeight: 50,
            columns: 11,
            columnGap: 5,
            rowGap: 10,
            moveTime: 1000, // Time between movement
            speedIncrease: 17,
            explosionFrames: 5,
            formation: [
                { subType: 'invader1', rowNo: 1 },
                { subType: 'invader1', rowNo: 2 },
                { subType: 'invader2', rowNo: 3 },
                { subType: 'invader2', rowNo: 4 },
                { subType: 'invader3', rowNo: 5 }
            ]
        },
        wave2: {
            moveSpeed: 20, // Distance invaders move horizontally
            shiftDownSpeed: 30, // Distance invaders shift down by when they reach the edge of the screen
            bullets: 2,
            y: 150,
            maxY: 300,
            columnWidth: 50,
            rowHeight: 50,
            columns: 11,
            columnGap: 5,
            rowGap: 10,
            moveTime: 1000, // Time between movement
            speedIncrease: 17,
            explosionFrames: 5,
            formation: [
                { subType: 'invader1', rowNo: 1 },
                { subType: 'invader1', rowNo: 2 },
                { subType: 'invader2', rowNo: 3 },
                { subType: 'invader2', rowNo: 4 },
                { subType: 'invader3', rowNo: 5 }
            ]
        },
        wave3: {
            moveSpeed: 20, // Distance invaders move horizontally
            shiftDownSpeed: 30, // Distance invaders shift down by when they reach the edge of the screen
            bullets: 3,
            y: 200,
            maxY: 300,
            columnWidth: 50,
            rowHeight: 50,
            columns: 11,
            // columns: 11,
            columnGap: 5,
            rowGap: 10,
            moveTime: 1000, // Time between movement
            speedIncrease: 17,
            explosionFrames: 5,
            formation: [
                { subType: 'invader1', rowNo: 1 },
                { subType: 'invader1', rowNo: 2 },
                { subType: 'invader2', rowNo: 3 },
                { subType: 'invader2', rowNo: 4 },
                { subType: 'invader3', rowNo: 5 }
            ]
        }
    }
};

export const INVADER = {
    type: 'invader',
    configs: {
        invader1: {
            width: 32,
            height: 32,
            score: 50,
            animationType: 'normal',
            explosionDuration: 500,
            spriteInfo: {
                normal: [
                    {
                        x: 140,
                        y: 0,
                        width: 32,
                        height: 32
                    },
                    {
                        x: 140,
                        y: 32,
                        width: 32,
                        height: 32
                    }
                ],
                exploding: {
                    x: 756,
                    y: 0,
                    width: 44,
                    height: 26
                }
            }
        },

        invader2: {
            width: 44,
            height: 32,
            score: 50,
            animationType: 'normal',
            explosionDuration: 500,
            spriteInfo: {
                normal: [
                    {
                        x: 172,
                        y: 0,
                        width: 44,
                        height: 32
                    },
                    {
                        x: 172,
                        y: 32,
                        width: 44,
                        height: 32
                    }
                ],
                exploding: {
                    x: 756,
                    y: 0,
                    width: 44,
                    height: 26
                }
            }
        },
        invader3: {
            width: 48,
            height: 32,
            score: 50,
            animationType: 'normal',
            explosionDuration: 500,
            spriteInfo: {
                normal: [
                    {
                        x: 216,
                        y: 0,
                        width: 48,
                        height: 32
                    },
                    {
                        x: 216,
                        y: 32,
                        width: 48,
                        height: 32
                    },
                ],
                exploding: {
                    x: 756,
                    y: 0,
                    width: 44,
                    height: 26
                }
            }
        }
    }
}

export const MOTHERSHIP = {
    type: 'mothership',
    configs: {
        main: {
            x: -68,
            y: 60,
            width: 68,
            height: 27,
            speed: 2,
            spriteX: 332,
            spriteY: 0,
            frameLengths: {
                normal: 500
            },
            explosionDuration: 2000,
            timingMin: 20000,
            timingMax: 30000,
            spriteInfo: {
                normal: [
                    {
                        x: 332,
                        y: 0,
                        width: 68,
                        height: 27,
                    },
                    {
                        x: 332,
                        y: 27,
                        width: 68,
                        height: 27,
                    },
                    {
                        x: 332,
                        y: 54,
                        width: 68,
                        height: 27,
                    },
                    {
                        x: 332,
                        y: 81,
                        width: 68,
                        height: 27,
                    },
                    {
                        x: 332,
                        y: 81,
                        width: 68,
                        height: 27,
                    }
                ],
                exploding: {
                    x: 756,
                    y: 81,
                    width: 44,
                    height: 26
                }
            },
        }
    }
};

export const SOUNDS = {
    invader: {
        move: [
            {
                startTime: 2.676,
                stopTime: 2.768
            },
            {
                startTime: 3.766,
                stopTime: 3.86
            },
            {
                startTime: 4.861,
                stopTime: 4.956
            },
            {
                startTime: 5.981,
                stopTime: 6.079
            }
        ],
        fire: {

        },
        destroy: {

        }
    },
    tank: {
        fire: {

        },
        destroy: {

        }
    },
    mothership: {
        destroy: {

        }
    }
};

export const BULLET = {
    type: 'bullet',
    configs: {
        tank: {
            direction: 'up',
            speed: 8,
            width: 6,
            height: 23,
            spriteInfo: {
                normal: {
                    x: 404,
                    y: 0,
                    width: 6,
                    height: 23
                }
            }
        },
        invader1: {
            direction: 'down',
            speed: 4,
            width: 4,
            height: 10,
            spriteInfo: {
                normal: {
                    x: 420,
                    y: 0,
                    width: 4,
                    height: 10
                }
            }
        },
        invader2: {
            direction: 'down',
            speed: 4,
            width: 4,
            height: 10,
            spriteInfo: {
                normal: {
                    x: 440,
                    y: 0,
                    width: 4,
                    height: 10
                }
            }
        },
        invader3: {
            direction: 'down',
            speed: 4,
            width: 4,
            height: 10,
            spriteInfo: {
                normal: {
                    x: 460,
                    y: 0,
                    width: 4,
                    height: 10
                }
            }
        },
        mothership: {
            direction: 'down',
            speed: 4,
            width: 12,
            height: 26,
            spriteInfo: {
                normal: {
                    x: 517,
                    y: 0,
                    width: 12,
                    height: 26
                }
            }
        }
    }
};