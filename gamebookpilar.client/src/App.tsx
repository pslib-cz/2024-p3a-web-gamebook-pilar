import { useEffect, useState } from 'react';
import { encode, decode, PlayerState, GameState, Inventory, State } from './utils.ts';
import './App.css';

function App() {
    const [data, setData] = useState(null);
    
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
    console.log("normal:  ", encoded)
    console.log("encoded: ", decode(encoded))

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch("https://localhost:7014/api/locations");
                const jsonData = await response.json();
                setData(jsonData);
                console.log(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        })();
    }, []);

    return (
        <div>
            <h1 id="tableLabel">Weather location</h1>
            <p>This component demonstrates fetching data from the server.</p>
        </div>
    );
}

export default App;