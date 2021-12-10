import { game } from './game';
import './Sprite.css';
import emptyImg from './SpriteImages/empty.png';


const gameRoot = document.getElementById('GameRoot');


class Sprite {
    constructor({ image = emptyImg, x = 0, y = 0, scaleX = 1, scaleY = 1, animation = 'animations_none' }) {
        game.gameObjects.push(this);

        // dom
        this.domElement = document.createElement('div');
        this.domElement.classList.add('Sprite');
        this.image = document.createElement('img');
        this.image.src = image;
        this.domElement. appendChild(this.image);
        this.domShadow = document.createElement('div');
        this.domShadow.classList.add('Shadow')
        this.domElement.appendChild(this.domShadow);
        gameRoot.appendChild(this.domElement);

        this.x = x;
        this.y = y;
        this.scaleX = scaleX;
        this.scaleY = scaleY;

        this.animation = animation;
        this.image.classList.add(this.animation);
    }

    static animations = {
        none: 'animation_none',
        walk: 'animation_walk',
        float: 'animation_float',
        rotate: 'animation_rotate',
        blink: 'animation_blink',
    };

    destroy() {
        if (this.domElement !== undefined) {
            gameRoot.removeChild(this.domElement);
        }
        this.domElement = undefined;
        this.image = undefined;
        game.gameObjects.remove(this);
    }

    setImage(imageUrl) {
        URL.revokeObjectURL(this.imageUrl);   // revoke the old texture
        this.image.src = imageUrl;
    }

    setAnimation(animation) {
        this.image.classList.replace(this.animation, animation);
        this.animation = animation;
    }

    setStyle(style) {
        if (this.domElement && this.domElement.style) {
            Object.assign(this.domElement.style, style);
        }
    }

    setTransform(x = 0, y = 0, scaleX = 1, scaleY = 1, align = 'bottom') {
        const [vw, vh] = game.xy2vwvh(x, y);
        if (align === 'center') {
            this.setStyle({
                transform: `translateX(${vw.toFixed(2)}vw) translateY(${vh.toFixed(2)}vh) translateX(-50%) translateY(-50%) scale(${scaleX}, ${scaleY})`,
            });
        } else if (align === 'topleft') {
            this.setStyle({
                transform: `translateX(${vw.toFixed(2)}vw) translateY(${vh.toFixed(2)}vh) scale(${scaleX}, ${scaleY})`,
            });
        } else if (align === 'bottom') {
            this.setStyle({
                transform: `translateX(${vw.toFixed(2)}vw) translateY(${vh.toFixed(2)}vh) translateX(-50%) translateY(-80%) scale(${scaleX}, ${scaleY})`,
            });
        }
    }

    static distance(x1, y1, x2, y2) {
        return (Math.abs(x1 - x2) + Math.abs(y1 - y2));
    }

    distanceTo(x, y) {
        return Sprite.distance(this.x, this.y, x, y);
    }

    move(targetX = undefined, targetY = undefined, speed = 1) {
        if (targetX !== undefined) {
            this.isMoving = true;
            this.targetX = targetX;
            this.targetY = targetY;
            this.speed = speed;
            if (this.handleMovingStart) {
                this.handleMovingStart();
            }
        } else {
            targetX = this.targetX;
            targetY = this.targetY;
            const distance = this.distanceTo(targetX, targetY);
            const distanceX = targetX - this.x;
            const distanceY = targetY - this.y;
            const moveX = game.deltaTime * this.speed * distanceX / distance;
            const moveY = game.deltaTime * this.speed * distanceY / distance;
            if (Math.abs(distanceX) > Math.abs(moveX) && Math.abs(distanceY) > Math.abs(moveY)) {
                this.x += moveX;
                this.y += moveY;
            } else {
                this.isMoving = false;
                this.targetX = undefined;
                this.targetY = undefined;
                if (this.handleMovingStop) {
                    this.handleMovingStop();
                }
            }
        }
    }

    update() {
        this.setTransform(this.x, this.y, this.scaleX, this.scaleY);
        if (this.isMoving) {
            this.move();
        }
    }
}


export default Sprite;