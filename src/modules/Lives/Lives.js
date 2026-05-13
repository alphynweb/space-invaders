export default class Lives {
    constructor(configs) {
        this.config = configs['main'];
        this.livesLeft = this.config.lives;
    }

    reset = () => {
        this.livesLeft = this.config.lives;
    }

    lose = (noOfLivesToLose = 1) => {
        this.livesLeft -= noOfLivesToLose;
    }
}