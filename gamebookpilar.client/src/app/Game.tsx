import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { StateContext } from '../providers/StateProvider';
import s from './Game.module.css';

interface MoveButton {
    moveButtonId: number, //PK
    label: string,
    locationX: number,
    locationY: number,
    targetLocationId: number,
    locationId: number //FK
}

interface KeypadButton {
    moveButtonId: number, //PK
    label: string,
    locationX: number,
    locationY: number,
    pin: string,
    targetLocationId: number,
    locationId: number //FK
}

interface LockButton {
    moveButtonId: number, //PK
    label: string,
    locationX: number,
    locationY: number,
    keyIndex: number,
    targetLocationId: number,
    locationId: number //FK
}

interface Background {
    backgroundId: number, //PK
    hasItem: boolean,
    imageUrl: string,
    locationId: number //FK
}

interface Location {
    locationId: number, //PK
    monologue: string,
    containedItem: number,
    itemIndex: number,
    moveButtons: MoveButton[],
    keypadButtons: KeypadButton[],
    lockButtons: LockButton[],
    backgrounds: Background[],
    isLit: boolean
}

interface State {
    currentLocation: number, // the location that the player is currently in
    sanity: number // sanity level of player (0 to 5)
    cigarettesTaken: string, // cigarettes will be finite and set for each room, it will be held like this: 10101010110
    candlesTaken: string, // -||-
    pagesTaken: string, // -||-
    keysTaken: string, // -||-
    cigarettesSmoked: number // keeps track of used cigarettes, will be matched with cigarettesTaken to deduce cigarette count
}

function Game() {
    //AA0AAAAA+41
    let { receivedGameKey } = useParams();
    let { updateGameKey, encode, decode } = useContext(StateContext);
    let nav = useNavigate();

    let gameKey = updateGameKey(receivedGameKey);
    const [state, setState] = useState<State>(decode(gameKey));

    const [currentLocation, setCurrentLocation] = useState<Location>();

    const [backgroundImageUrl, setBackgroundImageUrl] = useState<String>();

    useEffect(() => {
        (async () => {
            gameKey = updateGameKey(receivedGameKey);
            setState(decode(gameKey));
            try {
                const response = await fetch(`https://localhost:7014/api/location/${state.currentLocation}`);
                const jsonData:Location = await response.json();
                if (jsonData.isLit) {
                    setState(() => {
                        state.sanity = 5;
                        return state;
                    })
                }
                setCurrentLocation(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        })();
    }, [receivedGameKey]);

    useEffect(() => {
        (async () => {
            if (currentLocation) {
                let hasItem = checkItemPresence();
                let resultBackground = currentLocation.backgrounds[0];
                for (const background of currentLocation.backgrounds) {
                    if (background.hasItem == hasItem) {
                        resultBackground = background;
                    }
                }
                setBackgroundImageUrl(resultBackground.imageUrl);
            }
        })();
    }, [state, currentLocation]);

    const findItem = () => {
        if (state.sanity > 1) {
            state.sanity -= 1;
        }
        if (currentLocation) {
            switch (currentLocation.containedItem) {
                case 0:
                    state.cigarettesTaken = state.cigarettesTaken.substring(0, currentLocation.itemIndex) + "1" + state.cigarettesTaken.substring(currentLocation.itemIndex + 1);
                    break;
                case 1:
                    state.candlesTaken = state.candlesTaken.substring(0, currentLocation.itemIndex) + "1" + state.candlesTaken.substring(currentLocation.itemIndex + 1);
                    break;
                case 2:
                    state.pagesTaken = state.pagesTaken.substring(0, currentLocation.itemIndex) + "1" + state.pagesTaken.substring(currentLocation.itemIndex + 1);
                    break;
                case 3:
                    state.keysTaken = state.keysTaken.substring(0, currentLocation.itemIndex) + "1" + state.keysTaken.substring(currentLocation.itemIndex + 1);
                    break;
                default:
                    break;
            }
            setState(state);
            nav(`/game/${encode(state)}`);
        }
        console.log(state.cigarettesTaken);
    }

    const insertLocation = (key:string, targetLocationId:number) => {
        let tempState = decode(key);
        tempState.currentLocation = targetLocationId;
        return encode(tempState);
    }

    const doMinigameAction = (code:string, targetLocationId:number) => {
        if (state.sanity > 1) {
            state.sanity -= 1;
        }
        localStorage.setItem("mg-targetCode", code);
        localStorage.setItem("mg-sourceRoom", encode(state));
        localStorage.setItem("mg-targetRoom", insertLocation(encode(state), targetLocationId));
        nav("/minigame");
    }

    const doMoveAction = (targetLocationId:number) => {
        if (state.sanity > 1) {
            state.sanity -= 1;
        }
        let newGameKey:string = insertLocation(encode(state), targetLocationId);
        setState(decode(newGameKey));
        nav(`/game/${newGameKey}`);
    }

    const checkItemPresence = () => {
        if (currentLocation) {
            switch (currentLocation.containedItem) {
                case 0:
                    return state.cigarettesTaken[currentLocation.itemIndex] == "0"

                case 1:
                    return state.candlesTaken[currentLocation.itemIndex] == "0"

                case 2:
                    return state.pagesTaken[currentLocation.itemIndex] == "0"

                case 3:
                    return state.keysTaken[currentLocation.itemIndex] == "0"
                default:
                    break;
                }
            }
        return false;
    }

    const smokeCigarette = () => {
        let currentCigarettes = (state.cigarettesTaken.match(new RegExp("1", "g")) || []).length - state.cigarettesSmoked;
        if (currentCigarettes > 0) {
            state.sanity += 2;
            if (state.sanity > 5) {
                state.sanity = 5;
            }
            state.cigarettesSmoked += 1;
            setState(state);
            nav(`/game/${encode(state)}`);
        }
    }

    return (
        <div className={s.body} style={{backgroundImage: `url(https://localhost:7014/Images/${backgroundImageUrl})`}}>
            <div className={s.hud}>
                <div className={s.player}>
                    <div className={s.status}>
                        <img src={ `https://localhost:7014/Images/statuses/${state.sanity}.png` } alt="" />
                    </div>
                    <div className={s.info}>
                        <div className={s.monologue}>
                            <p>{currentLocation?.monologue}</p>
                        </div>
                        <div className={s.sanityBar}></div>
                    </div>
                </div>
                <div className={s.inventory}>
                    <button className={s.item} onClick={smokeCigarette}>
                        <p className={s.itemLabel}>{(state.cigarettesTaken.match(new RegExp("1", "g")) || []).length - state.cigarettesSmoked}</p>
                        <img src="https://localhost:7014/Images/inventory/cigarette.png" alt="" />
                    </button>
                </div>
            </div>
            {checkItemPresence() ? <button className={s.action} style={{left: `45%`, top: `75%`}} onClick={() => {findItem()}}> Find item </button>:null}
            {currentLocation?.moveButtons.map((moveButton:MoveButton) => (
                <button className={s.action} style={{left: `${moveButton.locationX - 5}%`, top: `${moveButton.locationY}%`}} onClick={() => {doMoveAction(moveButton.targetLocationId)}}> {moveButton.label} </button>
            ))}
            {currentLocation?.keypadButtons.map((keypadButton:KeypadButton) => (
                <button className={s.action} style={{left: `${keypadButton.locationX - 5}%`, top: `${keypadButton.locationY}%`}} onClick={() => {doMinigameAction(keypadButton.pin, keypadButton.targetLocationId)}}> {keypadButton.label} </button>
            ))}
            {currentLocation?.lockButtons.map((lockButton: LockButton) => {
                if (state.keysTaken[lockButton.keyIndex] == "1") {
                    return <button className={s.action} style={{left: `${lockButton.locationX - 5}%`, top: `${lockButton.locationY}%`}} onClick={() => {doMoveAction(lockButton.targetLocationId)}}> {lockButton.label} </button>;
                } else {
                    return null;
                }
            })}
        </div>
    );
}

export default Game;