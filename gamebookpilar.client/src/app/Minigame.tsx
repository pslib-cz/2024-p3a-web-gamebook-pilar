import { useEffect, useState } from 'react';
import s from './Minigame.module.css';
import { useNavigate } from 'react-router';
import MGBox from '../components/MGBox';

const SERVER_URL = "";

interface PlayerState {
    currentLocation: number, // the location that the player is currently in
    sanity: number // sanity level of player (0 to 5)
}

interface GameState {
    flareLocation: number, // location of the flare, -1 means its in the inventory of the player, -2 means it hasn't been found yet
    cigarettesTaken: string, // cigarettes will be finite and set for each room, it will be held like this: 10101010110
    candlesTaken: string, // -||-
    pagesTaken: string, // -||-
}

interface Inventory {
    cigarettes: number, // amount of cigarettes on the player (-1 to 5)
    candles: number, // amount of candles on the player (-1 to 5)
    pages: number // amount of pages on the player (-1 to 5)
}

interface State {
    player: PlayerState,
    game: GameState,
    inventory: Inventory
}

function Minigame() {
    let nav = useNavigate();

    let targetCode = localStorage.getItem("mg-targetCode") ?? "7194";

    let targetButton = localStorage.getItem("mg-targetButton") ?? "0";

    const [pastCodes, setPastCodes] = useState([""]);

    const [values, setValues] = useState(["-|0", "-|0", "-|0", "-|0", "-|0", "-|0", "-|0", "-|0", "-|0", "-|0", "-|0", "-|0", "-|0", "-|0", "-|0", "-|0"]);

    const [code, setCode] = useState("");
    const [tries, setTries] = useState(0);

    const handleTransition = () => {
        const bodyElement = document.querySelector(`.${s.body}`);
        bodyElement?.classList.add(s.transition);
        setTimeout(() => {
            bodyElement?.classList.remove(s.transition);
        }, 500);
    };
    
    const doMoveAction = async (moveButtonId:number) => {
        const response = await fetch(`${SERVER_URL}/api/state/move/${localStorage.getItem("gameKey")}/${moveButtonId}`);
        const jsonData = await response.json();
        localStorage.setItem("gameKey", jsonData);
        handleTransition();
        setTimeout(() => {
            nav(`/game`);
        }, 250);
    }

    const changeCode = (num: string) => {
        if (num == "*") {
            setCode("");
        } else if (num == "#") {
            if (code.length == targetCode.length) {
                if (code == targetCode) {
                    doMoveAction(parseInt(targetButton));
                } else if (tries >= 3) {
                    doMoveAction(0);
                } else {
                    pastCodes.push(code);
                    setCode("");
                    setTries(tries + 1);
                }
            }
        } else {
            if (code.length < targetCode.length && pastCodes.length <= 4) {
                setCode(code + num);
            }
        }
    }

    useEffect(() => {
        let newValues = []
        for (const pastCode of pastCodes) {
            for (const i in [...pastCode]) {
                const pastLetter = pastCode[i];
                const correctLetter = targetCode[i];
                if (pastLetter == correctLetter) {
                    newValues.push(pastLetter + "|2");
                } else if (targetCode.includes(pastLetter)) {
                    newValues.push(pastLetter + "|1");
                } else {
                    newValues.push(pastLetter + "|3");
                }
            }
        }
        for (const letter of code) {
            newValues.push(letter + "|0");
        }
        while (newValues.length < values.length) {
            newValues.push("-|0");
        }
        setValues([...newValues]);
        // setValues()
    }, [code, pastCodes]);

    return (
        <div className={ s.main }>
            <div className={ s.keypad }>
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((x:string) => (<button className={s.key} onClick={() => changeCode(x)} >{x}</button>))}
            </div>
            <div className={ s.result } >
                {values.map((x:string, i:number) => (<MGBox content={x} />))}
            </div>
        </div>
    )
}

export default Minigame;