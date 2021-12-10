import './PopUp.css';
import ImageButton from './ImageButton';
import popupImg from './SpriteImages/popup.png';
import closeImg from './SpriteImages/button-close.png';

function PopUp(props) {
    return (
        <>
        <div className='PopUp'>
            <div className='content'>{props.content}</div>            
            {/* <ImageButton image={closeImg} onClick={props.close}></ImageButton> */}
            {/* <img src={popupImg}></img> */}
        </div>
        <div className='PopUpOutside' onClick={props.close}></div>
        </>
    );
}


export default PopUp;