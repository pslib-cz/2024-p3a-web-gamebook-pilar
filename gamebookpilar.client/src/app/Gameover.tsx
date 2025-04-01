import { useEffect, useState } from 'react';
// import s from './Gameover.module.css';
import { useNavigate } from 'react-router';

const SERVER_URL = "https://localhost:7014";

function Gameover() {
    let nav = useNavigate();

    // const handleTransition = () => {
    //     const bodyElement = document.querySelector(`.${s.body}`);
    //     bodyElement?.classList.add(s.transition);
    //     setTimeout(() => {
    //         bodyElement?.classList.remove(s.transition);
    //     }, 500);
    // };
    
    // const doMoveAction = async (moveButtonId:number) => {
    //     const response = await fetch(`${SERVER_URL}/api/state/move/${localStorage.getItem("gameKey")}/${moveButtonId}`);
    //     const jsonData = await response.json();
    //     handleTransition();
    //     setTimeout(() => {
    //         nav(`/game/${jsonData}`);
    //     }, 250);
    // }

    return (
        <div>ahoj</div>
    )
}

export default Gameover;