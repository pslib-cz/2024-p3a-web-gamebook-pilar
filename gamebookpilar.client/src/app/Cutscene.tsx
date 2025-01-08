import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { StateContext } from '../providers/StateProvider';
import s from './Cutscene.module.css';

interface Cutscene {
    cutsceneId: number, //PK,
    targetLocationId: number
    frames: Frame[]
}

interface Frame {
    frameId: number, //PK
    imageUrl: string,
    frameIndex: number,
    monologue: string,
    cutsceneId: number //FK
}

function Cutscene() {
    //AA0AAAAA+41
    // let { receivedGameKey } = useParams();
    // let { updateGameKey, encode, decode } = useContext(StateContext);
    let nav = useNavigate();

    // let gameKey = updateGameKey(receivedGameKey);
    // let state = decode(gameKey);

    const [currentCutscene, setCurrentCutscene] = useState<Cutscene>();

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`https://localhost:7014/api/cutscene/${state.currentLocation - 100}`);
                const jsonData:Cutscene = await response.json();
                setCurrentCutscene(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        })();
    }, []);

    const getFrameImageUrl = (cutscene:Cutscene) => {
        let resultFrame = cutscene.frames[0];
        for (const Frame of cutscene.frames) {
            if (parseInt(localStorage.getItem("cs-currentFrame") ?? "") ) {
                resultFrame = Frame;
            }
        }
        return resultFrame.imageUrl;
    }

    return (
        <div className={s.body} style={{backgroundImage: `url(https://localhost:7014/Images/${currentCutscene ? getFrameImageUrl(currentCutscene) : ""})`}}>
            <div className={s.hud}>
            </div>
            {/* {currentCutscene?.moveButtons.map((moveButton:MoveButton) => (
                <button className={s.action} style={{left: `${moveButton.locationX - 5}%`, top: `${moveButton.locationY}%`}} onClick={() => {doMoveAction(moveButton.targetLocationId)}}> {moveButton.label} </button>
            ))} */}
        </div>
    );
}

export default Cutscene;