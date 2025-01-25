import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { StateContext } from '../providers/StateProvider';
import s from './Game.module.css';

const SERVER_URL = "https://localhost:7014";

interface MoveButton {
    moveButtonId: number, //PK
    label: string,
    locationX: number,
    locationY: number,
    keyIndex: number,
    pin: string,
    targetLocationId: number,
    locationId: number //FK
}

interface Background {
    backgroundId: number, //PK
    hasItem: boolean,
    isLit: boolean,
    imageUrl: string,
    locationId: number //FK
}

interface Switch {
    switchId: number, //Pk
    locationX: number,
    locationY: number,
    switchIndex: number,
    targetLocationId: number,
    locationId: number //FK
}

interface Location {
    locationId: number, //PK
    monologue: string,
    containedItem: number | undefined,
    itemIndex: number | undefined,
    switchIndex: number | undefined,
    cutsceneIndex: number | undefined,
    moveButtons: MoveButton[],
    backgrounds: Background[],
    switches: Switch[],
    isLit: boolean
}

interface State {
    currentLocation: number, // the location that the player is currently in
    sanity: number // sanity level of player (0 to 5)
    cigarettesTaken: string, // cigarettes will be finite and set for each room, it will be held like this: 10101010110
    candlesTaken: string, // -||-
    pagesTaken: string, // -||-
    keysTaken: string, // -||-
    switchesFlipped: string, // -||-
    cigarettesSmoked: number // keeps track of used cigarettes, will be matched with cigarettesTaken to deduce cigarette count
}

function Game() {
    let { receivedGameKey } = useParams();
    let { updateGameKey, encode, decode } = useContext(StateContext);
    let nav = useNavigate();

    let gameKey = updateGameKey(receivedGameKey);
    const [state, setState] = useState<State>(decode(gameKey));
    

    const [currentLocation, setCurrentLocation] = useState<Location>();

    const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>();

    const [statusImageUrl, setStatusImageUrl] = useState<string>();

    useEffect(() => {
        (async () => {
            gameKey = updateGameKey(receivedGameKey);
            let newState = decode(gameKey);
            try {
                const response = await fetch(`${SERVER_URL}/api/location/${newState.currentLocation}`);
                const jsonData:Location = await response.json();
                
                if (isLocationLit(jsonData)) {
                    newState.sanity = 5;
                } else {
                    if (newState.sanity < 1) {
                        console.log("game over");
                    }
                }
                setCurrentLocation(jsonData);

                let hasItem = checkItemPresence(jsonData);
                let resultBackground = jsonData.backgrounds[0];
                for (const background of jsonData.backgrounds) {
                    if (background.hasItem == hasItem && background.isLit == isLocationLit(jsonData)) {
                        resultBackground = background;
                    }
                }
                setBackgroundImageUrl(resultBackground.imageUrl);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setState(newState);
        })();
    }, [receivedGameKey]);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`${SERVER_URL}/api/status/${state.sanity}`);
                const jsonData = await response.json();
                setStatusImageUrl(jsonData.imageUrl);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        })();
    }, [state]);

    const findItem = () => {
        if (state.sanity > 1 && !isLocationLit(currentLocation)) {
            state.sanity -= 1;
        }
        if (currentLocation && currentLocation.itemIndex !== undefined) {
            const updateItemState = (itemState: string, itemIndex: number) => 
                itemState.substring(0, itemIndex) + "1" + itemState.substring(itemIndex + 1);

            switch (currentLocation.containedItem) {
                case 0:
                    state.cigarettesTaken = updateItemState(state.cigarettesTaken, currentLocation.itemIndex);
                    break;
                case 1:
                    state.candlesTaken = updateItemState(state.candlesTaken, currentLocation.itemIndex);
                    break;
                case 2:
                    state.pagesTaken = updateItemState(state.pagesTaken, currentLocation.itemIndex);
                    break;
                case 3:
                    state.keysTaken = updateItemState(state.keysTaken, currentLocation.itemIndex);
                    break;
                default:
                    break;
            }
            nav(`/game/${encode(state)}`);
        }
    }

    const isLocationLit = (location?: Location) => {
        if (location) {
            console.log("switchIndex", location.switchIndex)
            if (location.switchIndex != undefined) {
                console.log("AAA")
                return state.switchesFlipped[location?.switchIndex] == "1";
            } else {
                return location?.isLit;
            }
        } else {
            return false;
        }
    }

    const doMinigameAction = (code:string, targetLocationId:number) => {
        localStorage.setItem("mg-targetCode", code);
        state.sanity -= 1;
        localStorage.setItem("mg-sourceRoom", encode(state));
        state.currentLocation = targetLocationId;
        localStorage.setItem("mg-targetRoom", encode(state));
        nav("/minigame");
    }

    const doMoveAction = (targetLocationId:number) => {
        state.currentLocation = targetLocationId;
        state.sanity -= 1;
        nav(`/game/${encode(state)}`);
    }

    const checkItemPresence = (location?:Location) => {
        if (location) {
            if (location.itemIndex != undefined) {
                switch (location.containedItem) {
                    case 0:
                        return state.cigarettesTaken[location.itemIndex] == "0"
    
                    case 1:
                        return state.candlesTaken[location.itemIndex] == "0"
    
                    case 2:
                        return state.pagesTaken[location.itemIndex] == "0"
    
                    case 3:
                        return state.keysTaken[location.itemIndex] == "0"
                    default:
                        break;
                    }
            }
            }
        return false;
    }

    const smokeCigarette = () => {
        let currentCigarettes = (state.cigarettesTaken.match(new RegExp("1", "g")) || []).length - state.cigarettesSmoked;
        if (currentCigarettes > 0 && state.sanity < 5) {
            state.sanity = 5;
            state.cigarettesSmoked += 1;
            setState(state);
            nav(`/game/${encode(state)}`);
        }
    }

    const flipSwitch = (switchIndex:number) => {
        state.switchesFlipped = state.switchesFlipped.substring(0, switchIndex) + "1" + state.switchesFlipped.substring(switchIndex + 1);
        setState(state);
        nav(`/game/${encode(state)}`);

    }

    return (
        <div className={s.body} style={{backgroundImage: `url(${SERVER_URL}/Images/${backgroundImageUrl})`}}>
            <div className={s.hud}>
                <div className={s.player}>
                    <div className={s.status}>
                        <img src={ `${SERVER_URL}/Images/${statusImageUrl}` } alt="" />
                    </div>
                    <div className={s.info}>
                        <div className={s.monologue}>
                            <p>{currentLocation?.monologue}</p>
                        </div>
                    </div>
                </div>
                <div className={s.inventory}>
                    <button className={s.item} onClick={smokeCigarette}>
                        <p className={s.itemLabel}>{(state.cigarettesTaken.match(new RegExp("1", "g")) || []).length - state.cigarettesSmoked}</p>
                        <img className={s.itemImage} src={`${SERVER_URL}/Images/inventory/cigarette.png`} alt="" />
                    </button>
                    <div className={s.item}>
                        <p className={s.itemLabel}>{(state.candlesTaken.match(new RegExp("1", "g")) || []).length}</p>
                        <img className={s.itemImage} src={`${SERVER_URL}/Images/inventory/candle.png`} alt="" />
                    </div>
                    <div className={s.item}>
                        <p className={s.itemLabel}>{(state.pagesTaken.match(new RegExp("1", "g")) || []).length}</p>
                        <img className={s.itemImage} src={`${SERVER_URL}/Images/inventory/page.png`} alt="" />
                    </div>
                </div>
            </div>
            {checkItemPresence(currentLocation) ? <button className={s.action} style={{left: `45%`, top: `75%`}} onClick={() => {findItem()}}> search room </button>:null}
            {currentLocation?.moveButtons.map((moveButton:MoveButton) => {
                if (moveButton.pin != null) {
                    return <button className={s.action} style={{left: `${moveButton.locationX - 5}%`, top: `${moveButton.locationY}%`}} onClick={() => {doMinigameAction(moveButton.pin, moveButton.targetLocationId)}}> {moveButton.label} </button>
                } else if (moveButton.keyIndex != null) {
                    if (state.keysTaken[moveButton.keyIndex] == "1") {
                        return <button className={s.action} style={{left: `${moveButton.locationX - 5}%`, top: `${moveButton.locationY}%`}} onClick={() => {doMoveAction(moveButton.targetLocationId)}}> {moveButton.label} </button>;
                    } else {
                        return null;
                    }
                } else {
                    return <button className={s.action} style={{left: `${moveButton.locationX - 5}%`, top: `${moveButton.locationY}%`}} onClick={() => {doMoveAction(moveButton.targetLocationId)}}> {moveButton.label} </button>
                }
            })}
            {currentLocation?.switches.map((sswitch:Switch) => {
                if (state.switchesFlipped[sswitch.switchIndex] == "0") {
                    return <button className={s.action} style={{left: `${sswitch.locationX - 5}%`, top: `${sswitch.locationY}%`}} onClick={() => {flipSwitch(sswitch.switchIndex)}}> flip switch </button>;
                } else {
                    return null;
                }
            })}
        </div>
    );
}

export default Game;