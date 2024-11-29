import { useContext, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { StateContext } from '../providers/StateProvider';

function Game() {
    let { receivedGameKey } = useParams();
    let { updateGameKey, encode, decode } = useContext(StateContext);

    let gameKey = updateGameKey(receivedGameKey);
    console.log(gameKey)
    
    let state = {
        "player": {
            "currentLocation": 0,
            "sanity": 5
        },

        "game": {
            "flareLocation": -2,
            "cigarettesTaken": "000000000",
            "candlesTaken": "00000",
            "pagesTaken": "000",
            },

        "inventory": {
            "cigarettes": 0,
            "candles": 0,
            "pages": 0  
        }
    }

    console.log("state:   ", state)
    let encoded = encode(state)
    console.log("encoded:  ", encoded)
    console.log("decoded: ", decode(encoded))
    console.log("decoded from url: ", decode(gameKey))

    console.log("")
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

    return (
        <div>
            <h1 id="tableLabel">Weather location</h1>
            <p>This component demonstrates fetching data from the server.</p>
        </div>
    );
}

export default Game;