import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { StateContext } from '../providers/StateProvider';

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
    flareActive: boolean,
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
    backgrounds: Background[]
}



function Game() {
    //AA0AAAAA+41
    let { receivedGameKey } = useParams();
    let { updateGameKey, encode, decode } = useContext(StateContext);
    let nav = useNavigate();

    let gameKey = updateGameKey(receivedGameKey);
    let state = decode(gameKey);

    const [currentLocation, setCurrentLocation] = useState<Location>();

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`https://localhost:7014/api/location/${state.player.currentLocation}`);
                const jsonData = await response.json();
                setCurrentLocation(jsonData);
                console.log(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        })();
    }, [gameKey]);

    const getBackgroundImageUrl = (location:Location) => {
        let flareActive = state.game.flareLocation === location.locationId;
        let hasItem = false;
        if (location.containedItem != -1) {
            switch (location.containedItem) {
                case 0:
                    hasItem = state.game.cigarettesTaken[location.itemIndex] == "0"
                    break;
                
                case 1:
                    hasItem = state.game.flareLocation == -2
                    break;
                
                case 2:
                    hasItem = state.game.candlesTaken[location.itemIndex] == "0"
                    break;
                
                case 3:
                    hasItem = state.game.pagesTaken[location.itemIndex] == "0"
                    break;
                
                case 4:
                    hasItem = state.game.keysTaken[location.itemIndex] == "0"
                    break;
            
                default:
                    break;
            }
        }
        let resultBackground = location.backgrounds[0];
        for (const background of location.backgrounds) {
            if (background.hasItem == hasItem && background.flareActive == flareActive) {
                resultBackground = background;
            }
        }
        return resultBackground.imageUrl;
    }

    const insertLocation = (key:string, targetLocationId:number) => {
        let tempState = decode(key);
        tempState.player.currentLocation = targetLocationId;
        return encode(tempState)
    }

    const doMinigameAction = (code:string, targetLocationId:number) => {
        localStorage.setItem("mg-targetCode", code);
        localStorage.setItem("mg-sourceRoom", encode(state));
        localStorage.setItem("mg-targetRoom", insertLocation(encode(state), targetLocationId));
        nav("/minigame");
    }

    const doAction = (targetLocationId:number) => {
        nav(`/game/${insertLocation(encode(state), targetLocationId)}`)
    }

    return (
        <div>
            <h1 id="tableLabel">.</h1>
            <p>{currentLocation?.monologue}</p>
            {currentLocation?.moveButtons.map((moveButton:MoveButton) => (
                <button onClick={() => {doAction(moveButton.targetLocationId)}}> {moveButton.label} </button>
            ))}
            {currentLocation?.keypadButtons.map((keypadButton:KeypadButton) => (
                <button onClick={() => {doMinigameAction(keypadButton.pin, keypadButton.targetLocationId)}}> {keypadButton.label} </button>
            ))}
            <img src={`https://localhost:7014/Images/${currentLocation ? getBackgroundImageUrl(currentLocation) : ""}`} />
        </div>
    );
}

export default Game;