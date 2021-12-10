import './Player.css'
import { game } from './game';
import './Sprite.css';
import Sprite from './Sprite'
import emptyImg from './SpriteImages/empty.png';
import { whileStatement } from '@babel/types';
import { timingSafeEqual } from 'crypto';


const gameRoot = document.getElementById('GameRoot');


class PlayerText extends Sprite {
    constructor({ text = 'hello', player = null }) {
        super({x: player.x + 5, y: player.y});
        this.player = player;
        this.text = text;

        this.domElement.classList.add('PlayerText');
        // remove default shadow
        this.domElement.removeChild(this.domShadow);
        this.domShadow = undefined;

        this.domElement.innerText = text;

        setTimeout(this.destroy.bind(this), 1500);
    }

    destroy() {
        if (this.player) this.player.text = undefined;
        this.domElement.style.opacity = 0;
        setTimeout(() => super.destroy(), 500);
    }

    update() {
        this.x = this.player.x + 120;
        this.y = this.player.y - 30;
        super.update();
    }
}


class Player extends Sprite {
    constructor({ image = emptyImg, x = 0, y = 0, animation = 'animation_none', outfit = emptyImg, bodyColor = 'white', eyeColor = 'black' }) {
        super({image, x, y, animation});

        // dom elements
        this.domElement.classList.add('Player');

        this.domBody = document.createElement('div');
        this.domBody.classList.add('Body');
        this.domElement.appendChild(this.domBody);

        this.domEyes = document.createElement('div');
        this.domEyes.classList.add('Eyes');
        this.domElement.appendChild(this.domEyes);

        this.domOutfit = document.createElement('div');
        this.domOutfit.classList.add('Outfit');
        this.domElement.appendChild(this.domOutfit);

        // color, outfit
        this.eyeColor = eyeColor;
        this.bodyColor = bodyColor;
        this.outfit = outfit;
        this.domOutfit.style.backgroundImage = outfit;

        // events
        this.handleMouseDown = (e) => {
            const vw = e.x / document.body.offsetWidth * 100, 
                vh = e.y / document.body.offsetHeight * 100;
            let [x, y] = game.vwvh2xy(vw, vh);
            const paddingX = 100, paddingY = 100;
            x = (x < paddingX)? paddingX : (x > game.width - paddingX)? game.width - paddingX : x;
            y = (y < paddingY)? paddingY : (y > game.height - paddingY)? game.height - paddingY : y;
            if (this.distanceTo(x, y) > 100) {
                this.move(x, y, 0.5);
            }
        };
        gameRoot.addEventListener('mousedown', this.handleMouseDown);

        this.handleMovingStart = () => {
            this.scaleX = (this.targetX < this.x)? -Math.abs(this.scaleX) : Math.abs(this.scaleX);
            this.setAnimation(Sprite.animations.walk);
        };

        this.handleMovingStop = () => {
            this.setAnimation(Sprite.animations.none);
        };

        // animation
        this.setAnimation(animation, this.domBody);
        this.setAnimation(Sprite.animations.blink, this.domEyes);
    }

    destroy() {
        super.destroy();
        gameRoot.removeEventListener('mousedown', this.handleMouseDown);
    }

    setAnimation(animation, domPart=this.domBody) {
        if (domPart.animation !== undefined) {
            domPart.classList.replace(domPart.animation, animation);
        } else {
            domPart.classList.add(animation);
        }
        domPart.animation = animation;
    }

    setEyeColor(color) {
        this.eyeColor = color;
        Object.assign(this.domEyes.style, {backgroundColor: color});
    }

    setBodyColor(color) {
        this.bodyColor = color;
        Object.assign(this.domBody.style, {backgroundColor: color});
    }

    setOutfit(outfit) {
        this.outfit = outfit;
        this.domOutfit.style.backgroundImage = 'url(' + this.outfit + ')';
    }

    say(text) {
        console.log(text);
        this.text = new PlayerText({player: this, text: text});
    }
}

export default Player;