import gameSounds from '../../assets/audio/gamesounds.mp3';

const sounds = () => {
    return {
        soundSrc: gameSounds,
        startTime: null,
        stopTime: null,
        soundObject: document.createElement('audio'),
        play: function(sound) {
            this.soundObject.src = this.soundSrc;
            this.soundObject.currentTime = this.startTime;
            this.soundObject.addEventListener('timeupdate', () => {
                if (this.soundObject.currentTime > this.stopTime) {
                    this.pause();
                }
            });
            this.soundObject.play();
        },
        pause: function() {
            this.soundObject.pause();
        }
    };
};

export default sounds;