import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { game } from './game';
import Sprite from './Sprite';
import Player from './Player';
import PopUp from './PopUp';
import ImageButton from './ImageButton';
import playerImg from './SpriteImages/player.png';
import buttonEdit from './SpriteImages/button-edit.png';
import buttonLeave from './SpriteImages/button-leave.png';
import buttonTalk from './SpriteImages/button-talk.png';
import { returnStatement } from '@babel/types';
import outfitEmpty from './SpriteImages/empty.png';
import outfit0 from './SpriteImages/player-outfit0.png';
import outfit1 from './SpriteImages/player-outfit1.png';
import bg0 from './SpriteImages/bg0.png';


function PopUpTalk(props) {
  const emojiList = [
    '\uD83D\uDE00', '\uD83D\uDE06', '\uD83D\uDE12',
    '\uD83D\uDE22',
    '\uD83D\uDE24', '\uD83D\uDE28', '\uD83D\uDE2A',
  ];
  return (
    <PopUp close={props.close}
      content={
        <div style={{ width: (emojiList.length * 10) + 'vh' }}> {
          emojiList.map(
            (emoji, i) =>
              <div
                key={i}
                className='emojiListEntry'
                onClick={() => {
                  game.player.say(emoji);
                  props.close();
                }}
              >{emoji}</div>
          )
        }
        </div>
      }
    >
    </PopUp>
  )
}


function PopUpEdit(props) {
  const outfitList = [
    outfitEmpty, outfit0, outfit1,
  ];

  const [chosenOutfit, setChosenOutfit] = useState(game.player.outfit);

  const backgroundList = [
    outfitEmpty, outfit0, outfit1,
    bg0,
  ];

  const [chosenBackground, setChosenBackground] = useState(outfitEmpty);

  return (
    <PopUp close={props.close}
      content={
        <>
          <div className='popupEditEntry'>
            <label>Eye Color:  </label>
            <input type='color' onChange={e => game.player.setEyeColor(e.target.value)} defaultValue={game.player.eyeColor}></input>
          </div>
          <div className='popupEditEntry'>
            <label>Body Color:  </label>
            <input type='color' onChange={e => game.player.setBodyColor(e.target.value)} defaultValue={'white'}></input>
          </div>
          <div className='popupEditEntry'>
            <label>Outfit:  </label>
            <div className='outfitList'>
              {
                outfitList.map(outfit =>
                  <img key={outfit} className='outfitListEntry' src={outfit}
                    style={{ background: outfit === chosenOutfit ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.1)' }}
                    onClick={() => {
                      game.player.setOutfit(outfit);
                      setChosenOutfit(outfit);
                    }}

                  />
                )
              }
            </div>
          </div>
          <div className='popupEditEntry'>
            <label>Background:  </label>
            <div className='backgroundList'>
              {
                backgroundList.map(background =>
                  <img key={background} className='backgroundListEntry' src={background}
                    style={{ background: background === chosenBackground ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.1)' }}
                    onClick={() => {
                      game.setBackground(background);
                      setChosenBackground(background);
                    }}

                  />
                )
              }
            </div>
          </div>
        </>
      }
    >
    </PopUp>
  )
}


function PopUpLeave(props) {
  return (
    <PopUp close={props.close}
      content={
        'leave'
      }
    >
    </PopUp>
  )
}


function Gui() {
  const [popUpType, setPopUpType] = useState('none');

  return (
    <div id='Gui'>
      {(popUpType === 'talk') ? <PopUpTalk close={() => setPopUpType('none')} /> : null}
      {(popUpType === 'edit') ? <PopUpEdit close={() => setPopUpType('none')} /> : null}
      {(popUpType === 'leave') ? <PopUpLeave close={() => setPopUpType('none')} /> : null}
      <div id='menu'>
        <ImageButton id='button-talk' image={buttonTalk} onClick={() => setPopUpType('talk')}></ImageButton>
        <ImageButton id='button-edit' image={buttonEdit} onClick={() => setPopUpType('edit')}></ImageButton>
        <ImageButton id='button-leave' image={buttonLeave} onClick={() => setPopUpType('leave')}></ImageButton>
      </div>
    </div>
  );
}


ReactDOM.render(
  <Gui></Gui>,
  document.getElementById('root')
);

function animate(timeStamp) {
  requestAnimationFrame(animate);

  game.deltaTime = timeStamp - game.time;
  game.time = timeStamp;
  // if (game.deltaTime < 100) return;  // limit fps

  // update game objects
  for (const gameObject of game.gameObjects) {
    gameObject.update();
  }

  // render popups
  for (const p of game.popUps) {

  }
}

requestAnimationFrame(animate);

