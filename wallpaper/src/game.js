import './game.css';
import Sprite from './Sprite';
import Player from './Player';
import emptyImg from './SpriteImages/empty.png';
import Clock from './Clock';


const gameRoot = document.getElementById('GameRoot');


// global variables, functions and constants
let nextID = 1;
const game = {
  time: Date.now(),
  deltaTime: 0,

  pointerX: 0,
  pointerY: 0,
  isPointerDown: false,
  lastPointerDownX: 0,
  lastPointerDownY: 0,

  gameObjects: new Map(),
  getUniqueID: function getUniqueID() {
    return '' + nextID++;
  },

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

  isHost: true,

  getObjectConstructor: function (name) {
    const constructorMap = {
      'Sprite': Sprite,
      'Player': Player,
      'Clock': Clock,
    }
    return constructorMap[name];
  }
};


// expose global variable for debugging
window.game = game;


// background
game.setBackground = (bg) => {
  gameRoot.style.backgroundImage = 'url(' + bg + ')';;
  game.background = bg;
}
game.setBackground(game.background);


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


// update and sync
const websocketAddress = 'ws://localhost:9876';
let websocket = {};
window.websocket = websocket    // debug

function handleWSClose(e) {
  console.error('websocket disconnected, reconneting in 10 seconds');
  setTimeout(() => { websocket = new WebSocket(websocketAddress) }, 10000);
}

function handleWSMessage(e) {
  const data = JSON.parse(e.data);
  recvEventList.push(data);
}

game.connectToRemoteHost = () => {
  // backup
  const localPlayer = game.getLocalPlayer();
  game.localGameObjects = new Map(game.gameObjects);
  game.gameObjects = new Map();
  game.gameObjects.set(localPlayer.id, localPlayer);
  game.gameObjects.set('playerManager', game.localGameObjects.get('playerManager'));

  sendEventList.length = 0;
  recvEventList.length = 0;

  // connect to remote host
  websocket = new WebSocket(websocketAddress);
  game.isHost = false;
  websocket.onclose = handleWSClose;
  websocket.onmessage = handleWSMessage;
}

game.connectToLocalHost = () => {
  // recover
  if (game.localGameObjects) {
    game.gameObjects = game.localGameObjects;
  }
  
  sendEventList.length = 0;
  recvEventList.length = 0;
  // test
  // const clock = new Clock({x: 1000, y: 1000});
  
  // connect to local host
  websocket = new WebSocket(websocketAddress);
  game.isHost = true;
  websocket.onclose = handleWSClose;
  websocket.onmessage = handleWSMessage;
}

// game.connectToLocalHost();

const sendEventList = [];
const recvEventList = [];
window.recvEventList = recvEventList;
game.queueEvent = (e) => {
  sendEventList.push(e);
}

function animate(timeStamp) {
  requestAnimationFrame(animate);

  game.deltaTime = timeStamp - game.time;
  game.time = timeStamp;
  // if (game.deltaTime < 100) return;  // limit fps

  // update game objects
  for (const gameObject of game.gameObjects.values()) {
    try {
      gameObject.update();
    } catch (error) {
      console.error(error);
    }
  }
  
  // deal with recived events
  for (const e of recvEventList) {
    console.log('recv', e);
    if (e.playerID === game.getLocalPlayer().id) {
      continue;
    }
    let target = game.gameObjects.get(e.objectID);
    if (target === undefined || target[e.eventType] === undefined) {
      if (e.eventType === 'set') {  // setting an object that haven't been created yet
        const objectConstructor = game.getObjectConstructor(e.data.type);
        target = new objectConstructor(e.data);
        game.gameObjects.set(target.id, target);
      } else {
        continue;
      }
    } else try {
      target[e.eventType](e.data);
    } catch (error) {
      console.error(error);
    }
  }
  recvEventList.length = 0;

  // send events
  if (websocket.readyState === 1) {
    for (const e of sendEventList) {
      console.log('send', e);
      websocket.send(JSON.stringify(e));
    }
    sendEventList.length = 0;
  }
}


// player manager
const playerManager = {
  onPlayerConnect: function (playerID) {
    console.log('player ' + playerID + ' connected');
    const localPlayer = game.getLocalPlayer();
    if (game.isHost) {
      for (const o of game.gameObjects.values()) {
        if (o.set && o.get) {
          game.queueEvent({playerID: localPlayer.id, objectID: o.id, eventType: 'set', data: o.get()});
        }
      }
    } else {
      if (playerID === localPlayer.id) {
        game.queueEvent({playerID: localPlayer.id, objectID: localPlayer.id, eventType: 'set', data: localPlayer.get()});
      }
    }
  },

  onPlayerDisconnect: function(playerID) {
    console.log('player ' + playerID + ' disconnected');
    game.gameObjects.get(playerID).destroy();
  },

  setPlayerID: function(playerID) {
    const oldID = game.getLocalPlayer().id, localPlayer = game.getLocalPlayer();
    game.gameObjects.delete(oldID);
    localPlayer.id = playerID;
    game.gameObjects.set(playerID, localPlayer);
    console.log('setPlayerID', oldID, playerID, game.gameObjects);
  },

  update: function () {},
}
game.gameObjects.set('playerManager', playerManager);


// local player
const localPlayer = new Player({ isLocalPlayer: true });
game.gameObjects.set(localPlayer.id, localPlayer);
game.getLocalPlayer = () => {
  return localPlayer;
};


// start running!
requestAnimationFrame(animate);
export { game };
