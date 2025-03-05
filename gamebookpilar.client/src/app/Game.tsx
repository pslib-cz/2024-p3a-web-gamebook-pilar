import { useContext, useEffect, useReducer, useState } from 'react';
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
    isCandle: boolean,
    isPage: boolean,
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
    isCutscene: boolean,
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

    const initialState = {
        gameState: decode(gameKey),
        currentLocation: undefined,
        backgroundImageUrl: undefined,
        statusImageUrl: undefined
    };

    function reducer(state: any, action: any) {
        switch (action.type) {
            case 'SET_STATE':
                return { ...state, gameState: action.payload };
            case 'SET_CURRENT_LOCATION':
                return { ...state, currentLocation: action.payload };
            case 'SET_BACKGROUND_IMAGE_URL':
                return { ...state, backgroundImageUrl: action.payload };
            case 'SET_STATUS_IMAGE_URL':
                return { ...state, statusImageUrl: action.payload };
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        (async () => {
            gameKey = updateGameKey(receivedGameKey);
            let newState = decode(gameKey);
            try {
                const response = await fetch(`${SERVER_URL}/api/location/${newState.currentLocation}`);
                const jsonData:Location = await response.json();
                
                dispatch({ type: 'SET_CURRENT_LOCATION', payload: jsonData });
                console.log(state.currentLocation)

                handleStatus(newState);

                let hasItem = checkItemPresence(newState, jsonData);
                let resultBackground = jsonData.backgrounds[0];
                for (const background of jsonData.backgrounds) {
                    if (background.hasItem == hasItem && background.isLit == isLocationLit(jsonData)) {
                        resultBackground = background;
                    }
                }
                dispatch({ type: 'SET_BACKGROUND_IMAGE_URL', payload: resultBackground.imageUrl });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            dispatch({ type: 'SET_STATE', payload: newState });
        })();
    }, [receivedGameKey]);

    const handleTransition = () => {
        const bodyElement = document.querySelector(`.${s.body}`);
        bodyElement?.classList.add(s.transition);
        setTimeout(() => {
            bodyElement?.classList.remove(s.transition);
        }, 500);
    };

    const handleStatus = async (state:State) => {
            try {
                const response = await fetch(`${SERVER_URL}/api/status/${state.sanity}`);
                const jsonData = await response.json();
                dispatch({ type: 'SET_STATUS_IMAGE_URL', payload: jsonData.imageUrl });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
    }

    const isLocationLit = (location?: Location) => {
        if (location) {
            if (location.switchIndex != undefined) {
                return state.gameState.switchesFlipped[location?.switchIndex] == "1";
            } else {
                return location?.isLit;
            }
        } else {
            return false;
        }
    }

    const checkItemPresence = (gameState:State, location?:Location) => {
        if (location) {
            if (location.itemIndex != undefined) {
                switch (location.containedItem) {
                    case 0:
                        return gameState.cigarettesTaken[location.itemIndex] == "0"
    
                    case 1:
                        return gameState.candlesTaken[location.itemIndex] == "0"
    
                    case 2:
                        return gameState.pagesTaken[location.itemIndex] == "0"
    
                    case 3:
                        return gameState.keysTaken[location.itemIndex] == "0"
                    default:
                        break;
                    }
            }
            }
        return false;
    }

    const doMinigameAction = (code:string, targetLocationId:number) => {
        localStorage.setItem("mg-targetCode", code);
        state.gameState.sanity -= 1;
        localStorage.setItem("mg-sourceRoom", encode(state.gameState));
        state.gameState.currentLocation = targetLocationId;
        localStorage.setItem("mg-targetRoom", encode(state.gameState));
        handleTransition();
        nav("/minigame");
    }

    const doMoveAction = async (moveButtonId:number) => {
        const response = await fetch(`${SERVER_URL}/api/state/move/${encode(state.gameState)}/${moveButtonId}`);
        const jsonData = await response.json();
        handleTransition();
        setTimeout(() => {
            nav(`/game/${jsonData}`);
        }, 250);
    }

    const findItem = async () => {
        const response = await fetch(`${SERVER_URL}/api/state/search/${encode(state.gameState)}/`);
        const jsonData = await response.json();
        nav(`/game/${jsonData}`);
    }

    const smokeCigarette = async () => {
        const response = await fetch(`${SERVER_URL}/api/state/smoke/${encode(state.gameState)}/`);
        const jsonData = await response.json();
        nav(`/game/${jsonData}`);
    }

    const flipSwitch = async (switchId:number) => {
        const response = await fetch(`${SERVER_URL}/api/state/switch/${encode(state.gameState)}/${switchId}`);
        const jsonData = await response.json();
        nav(`/game/${jsonData}`);
    }

    return (
        <div className={s.body}>
            <div className={s.background} style={{backgroundImage: `url(${SERVER_URL}/Images/${state.backgroundImageUrl})`}}></div>
            {(!state.currentLocation?.isCutscene) && (
                <div className={s.hud}>
                    <div className={s.player}>
                        <div className={s.status}>
                            <img src={`${SERVER_URL}/Images/${state.statusImageUrl}`} alt="Player status" />
                        </div>
                        <div className={s.info}>
                            <div className={s.monologue}>
                                <p>{state.currentLocation?.monologue}</p>
                            </div>
                        </div>
                    </div>
                    <div className={s.inventory}>
                        <button className={s.item} onClick={smokeCigarette}>
                            <p className={s.itemLabel}>
                                {(state.gameState.cigarettesTaken.match(/1/g) || []).length - state.gameState.cigarettesSmoked}
                            </p>
                            <img className={s.itemImage} src={`${SERVER_URL}/Images/inventory/cigarette.png`} alt="Cigarette" />
                        </button>
                        <div className={s.item}>
                            <p className={s.itemLabel}>
                                {(state.gameState.candlesTaken.match(/1/g) || []).length}
                            </p>
                            <img className={s.itemImage} src={`${SERVER_URL}/Images/inventory/candle.png`} alt="Candle" />
                        </div>
                        <div className={s.item}>
                            <p className={s.itemLabel}>
                                {(state.gameState.pagesTaken.match(/1/g) || []).length}
                            </p>
                            <img className={s.itemImage} src={`${SERVER_URL}/Images/inventory/page.png`} alt="Page" />
                        </div>
                    </div>
                </div>
            )}
            {(state.currentLocation?.isCutscene) && (
                <div className={s.cutsceneMonologue}>
                    <p>{state.currentLocation.monologue}</p>
                </div>
            )}
            {checkItemPresence(state.gameState, state.currentLocation) ? <button className={s.action} style={{left: `45%`, top: `75%`}} onClick={() => {findItem()}}> search room </button>:null}
            {state.currentLocation?.moveButtons.map((moveButton:MoveButton) => {
                if (moveButton.isCandle && state.gameState.candlesTaken == "11111") {
                    return <button className={s.action} style={{left: `${moveButton.locationX - 5}%`, top: `${moveButton.locationY}%`}} onClick={() => {doMoveAction(moveButton.moveButtonId)}}> {moveButton.label} </button>
                } else if (moveButton.isPage && state.gameState.pagesTaken == "111") {
                    return <button className={s.action} style={{left: `${moveButton.locationX - 5}%`, top: `${moveButton.locationY}%`}} onClick={() => {doMoveAction(moveButton.moveButtonId)}}> {moveButton.label} </button>
                } else if (moveButton.pin != null) {
                    return <button className={s.action} style={{left: `${moveButton.locationX - 5}%`, top: `${moveButton.locationY}%`}} onClick={() => {doMinigameAction(moveButton.pin, moveButton.targetLocationId)}}> {moveButton.label} </button>
                } else if (moveButton.keyIndex != null) {
                    if (state.gameState.keysTaken[moveButton.keyIndex] == "1") {
                        return <button className={s.action} style={{left: `${moveButton.locationX - 5}%`, top: `${moveButton.locationY}%`}} onClick={() => {doMoveAction(moveButton.moveButtonId)}}> {moveButton.label} </button>;
                    } else {
                        return null;
                    }
                } else {
                    return <button className={s.action} style={{left: `${moveButton.locationX - 5}%`, top: `${moveButton.locationY}%`}} onClick={() => {doMoveAction(moveButton.moveButtonId)}}> {moveButton.label} </button>
                }
            })}
            {state.currentLocation?.switches.map((sswitch:Switch) => {
                if (state.gameState.switchesFlipped[sswitch.switchIndex] == "0") {
                    return <button className={s.action} style={{left: `${sswitch.locationX - 5}%`, top: `${sswitch.locationY}%`}} onClick={() => {flipSwitch(sswitch.switchId)}}> flip switch </button>;
                } else {
                    return null;
                }
            })}
        </div>
    );
}

export default Game;