import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { StateContext } from '../providers/StateProvider';
import InputField from '../components/InputField';

function Game() {
    let { receivedGameKey } = useParams();
    let { updateGameKey, encode, decode } = useContext(StateContext);
    let nav = useNavigate();

    let gameKey = updateGameKey(receivedGameKey);
    console.log(gameKey);
    
    let state = decode(gameKey);
    console.log("decoded from url: ", state)

    // console.log("decoded from code: ", decode(gameKey ? gameKey : "0000000"))

    // useEffect(() => {
    //     (async () => {
    //         try {
    //             const response = await fetch("https://localhost:7014/api/locations");
    //             const jsonData = await response.json();
    //             setData(jsonData);
    //             console.log(jsonData);
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     })();
    // }, []);

    const [code, setCode] = useState("");

    const test = () => {
        localStorage.setItem("mg-targetCode", code);
        localStorage.setItem("mg-sourceRoom", "SOURCEAA+41");
        localStorage.setItem("mg-targetRoom", "TARGETAA+41");
        nav("/minigame");
    }

    return (
        <div>
            <h1 id="tableLabel">Weather location</h1>
            <p>This component demonstrates fetching data from the server.</p>
            <Link to={"/game/AAUBBABJ+41"}>Test</Link>
            <InputField defaultValue='' onChange={(value?: string) => {setCode(value ? value : "")}}></InputField>
            <button onClick={test}>minigme</button>
        </div>
    );
}

export default Game;