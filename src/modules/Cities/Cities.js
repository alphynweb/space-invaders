import { CITY } from '../../config';
import City from '../City/City';

export default class Cities {
    constructor(configs) {
        this.configs = configs;
        const cityConfig = configs.find(config => config.type === 'city').configs['main'];
        const screenConfig = configs.find(config => config.type === 'screen').configs['main'];
        this.cityList = [];
        this.noOfCities = cityConfig.no;
        this.cityWidth = cityConfig.width;
        this.cityXArea = screenConfig.width - (cityConfig.indent * 2); // Horizontal area that city takes up
        this.cityGap = (this.cityXArea - (this.noOfCities * this.cityWidth)) / (this.noOfCities - 1);
        this.indent = cityConfig.indent;
        this.gameArea = document.querySelector('#gameArea');
    }

    initializeLevel = () => {
        this.cityList = [];
        this.build();
    }

    reset = () => {
        // Clear the canvases that are already here and then build new ones from scratch
        this.cityList.forEach(city => {
            const cityCanvas = document.getElementById(city.canvasId);
            if (cityCanvas) {
                cityCanvas.remove();
            }
        });
    }

    build() {
        for (let i = 0; i < this.noOfCities; i++) {

            const gameArea = document.getElementById('gameArea');

            // Work out x coord for city based on no of cities and city gap
            const cityX = (i * this.cityWidth) + (i * this.cityGap) + this.indent;

            // Build a seperate canvas for the city
            const cityCanvas = document.createElement('canvas');
            cityCanvas.id = 'cityCanvas' + i;
            cityCanvas.width = CITY.configs['main'].width;
            cityCanvas.height = CITY.configs['main'].height;
            cityCanvas.style.position = "absolute";
            cityCanvas.style.top = (CITY.configs['main'].y) + "px";
            cityCanvas.style.left = cityX + "px";
            cityCanvas.style.zIndex = "999";

            gameArea.appendChild(cityCanvas);

            const newCity = new City(cityCanvas.id, cityX, this.configs);

            this.cityList.push(newCity);
        }
    }

    clear() {
        this.cityList.forEach((city) => {
            city.clear();
        });
    }
}