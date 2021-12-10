import './game.css';
import Player from './Player';
import emptyImg from './SpriteImages/empty.png';


const gameRoot = document.getElementById('GameRoot');


// global variables, functions and constants
const game = {
  time: Date.now(),
  deltaTime: 0,

  pointerX: 0,
  pointerY: 0,
  isPointerDown: false,
  lastPointerDownX: 0,
  lastPointerDownY: 0,
  // keyStates: [],
  
  gameObjects: [],

  width: 1920,
  height: 1080,
  xy2vwvh: (x, y) => {
    return [x / game.width * 100, y / game.height * 100];
  },
  vwvh2xy: (vw, vh) => {
    return [vw / 100 * game.width, vh / 100 * game.height];
  },

  popUps: [],

  player: null,

  background: emptyImg,
};

game.gameObjects.remove = (obj) => {
  for (let i = 0; i < game.gameObjects.length; ++i) {
      if (game.gameObjects[i] === obj) {
          game.gameObjects.splice(i, 1);
      }
  }
};

game.player = new Player({});

game.setBackground = (bg) => {
  gameRoot.style.backgroundImage = 'url(' + bg + ')';;
  game.background = bg;
}
game.setBackground(game.background);


// expose global variable for debugging
window.game = game;


// global events
document.body.addEventListener('pointermove', (e) => {
  game.pointerX = e.clientX;
  game.pointerY = e.clientY;
});

document.body.addEventListener('pointerdown', (e) => {
  game.isPointerDown = true;
  game.lastPointerDownX = e.clientX;
  game.lastPointerDownY = e.clientY;
});

document.body.addEventListener('pointerup', (e) => {
  game.isPointerDown = false;
});




export { game };
