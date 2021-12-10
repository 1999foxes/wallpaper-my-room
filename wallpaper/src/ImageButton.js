import './ImageButton.css';
import React, { useState } from 'react';


function ImageButton(props) {
    return (
        <button 
            className='ImageButton' 
            onClick={props.onClick}
        >
            <img src={props.image}></img>
        </button>
    )
}


export default ImageButton;