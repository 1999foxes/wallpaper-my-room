import './Player.css'
import { game } from './game';
import './Sprite.css';
import Sprite from './Sprite'
import emptyImg from './SpriteImages/empty.png';


class Clock extends Sprite {
    constructor(config = {}) {
        super(config);
        this.type = 'Clock';
        this.domElement.innerHTML = 'clock';
    }

    update() {
        super.update();
    }
}


export default Clock;