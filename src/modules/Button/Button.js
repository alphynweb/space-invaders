import Ctx from '../Ctx/Ctx';

const button = (x, y, width, height, text, color = '#fff', id, cssClass) => {
    return {
        x,
        y,
        width,
        height,
        text,
        color,
        id,
        cssClass,
        ctx: Ctx(),
        render: function () {
            const gameArea = document.getElementById('gameArea');
            const btn = document.createElement('button');
            btn.id = this.id;
            btn.classList.add(this.cssClass);
            btn.innerHTML = text;
            btn.style.width = this.width;
            btn.style.height = this.height;
            gameArea.appendChild(btn);
        }
    };
};

export default button;