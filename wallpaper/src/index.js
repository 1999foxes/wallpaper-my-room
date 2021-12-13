import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { game } from './game';
import PopUp from './PopUp';
import ImageButton from './ImageButton';
import buttonEdit from './SpriteImages/button-edit.png';
import buttonLeave from './SpriteImages/button-leave.png';
import buttonTalk from './SpriteImages/button-talk.png';


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
                  const localPlayer = game.getLocalPlayer();
                  localPlayer.say(emoji);
                  localPlayer.needSync = true;
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


const outfitList = [
  require('./SpriteImages/empty.png').default,
];

for (let i = 0; i < 20; ++i) {
  outfitList.push(require('./SpriteImages/player-outfit'+i+'.png').default);
}

const backgroundList = [
  require('./SpriteImages/bg0.png').default,
  require('./SpriteImages/bg1.png').default,
]

function PopUpEdit(props) {
  const [chosenOutfit, setChosenOutfit] = useState(game.getLocalPlayer().outfit);
  const [chosenBackground, setChosenBackground] = useState(backgroundList[0]);

  return (
    <PopUp close={props.close}
      content={
        <>
          <div className='popupEditEntry'>
            <label>Eye Color:  </label>
            <input type='color' onChange={e => game.getLocalPlayer().setEyeColor(e.target.value)} defaultValue={game.getLocalPlayer().eyeColor}></input>
          </div>
          <div className='popupEditEntry'>
            <label>Body Color:  </label>
            <input type='color' onChange={e => game.getLocalPlayer().setBodyColor(e.target.value)} defaultValue={'white'}></input>
          </div>
          <div className='popupEditEntry'>
            <label>Outfit:  </label>
            <div className='outfitList'>
              {
                outfitList.map(outfit =>
                  <img key={outfit} className='outfitListEntry' src={outfit}
                    style={{ background: outfit === chosenOutfit ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.1)' }}
                    onClick={() => {
                      const localPlayer = game.getLocalPlayer();
                      localPlayer.setOutfit(outfit);
                      localPlayer.needSync = true;
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
        <>
        <button onClick={() => game.connectToLocalHost()}>connect to local host</button>
        <button onClick={() => game.connectToRemoteHost()}>connect to remote host</button>
        </>
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


