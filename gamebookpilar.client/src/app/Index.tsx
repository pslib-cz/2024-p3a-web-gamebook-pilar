import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { StateContext } from '../providers/StateProvider';
import s from './Index.module.css';

function Index() {
    let { receivedGameKey } = useParams();
    let { updateGameKey } = useContext(StateContext);
    let nav = useNavigate();

    let gameKey = updateGameKey(receivedGameKey);

    const [showInput, setShowInput] = useState(false);
    const [inputValue, setInputValue] = useState('');
    
    const playGame = () => {
        nav(`/game/${gameKey}`);
    }

    const loadGame = () => {
        if (showInput) {
            nav(`/game/${inputValue}`);
        } else {
            setShowInput(true);
            setInputValue(gameKey);
        }
    }

    const aboutGame = () => {
        nav(`/about/`);
    }

    return (
        <div className={s.main}>
            <h1>nyctophobia</h1>
            <button onClick={playGame}>play</button>
            <div className={s.load}>
                <button onClick={loadGame}>{showInput ? '> load' : 'save/load'}</button>
                {showInput && (
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className={s.inputField}
                    />
                )}
            </div>
            <button onClick={aboutGame}>about</button>
        </div>
    )
}

export default Index;