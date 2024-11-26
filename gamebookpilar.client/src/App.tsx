import { useEffect, useState } from 'react';
import './App.css';

interface Location {
    locationId: number,
    name: string,
    body: string
}

interface PlayerState {
    currentLocation: number, // the location that the player is currently in
    sanity: number // sanity level of player (0 to 5)
}

interface GameState {
    flareLocation: number, // location of the flare, -1 means its in the inventory of the player, -2 means it hasn't been found yet
    cigarettesTaken: number, // cigarettes will be finite and set for each room, it will be held like this: 10101010110
    candlesTaken: number, // -||-
    pagesTaken: number, // -||-
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

// encodes a number into a binary string, filling in the 0's at the beginning
function numToBin(num: number, range:number) {
    let rtn = num.toString(2)
    while (rtn.length < range) {
        rtn = "0" + rtn
    }
    return rtn
}

// decodes a binary string into a number
function binToNum(binaryStr: string): number {
    return parseInt(binaryStr, 2);
}

// encodes playerState, gameState and inventory in a single binary string
function encode(state: State): string {
    let rtn = "";
    rtn = rtn + numToBin(state.player.currentLocation, 6)
    rtn = rtn + numToBin(state.player.sanity, 3)
    rtn = rtn + numToBin(state.game.flareLocation + 2, 6)
    rtn = rtn + numToBin(state.game.cigarettesTaken, 8)
    rtn = rtn + numToBin(state.game.candlesTaken, 8)
    rtn = rtn + numToBin(state.game.pagesTaken, 8)
    rtn = rtn + numToBin(state.inventory.cigarettes + 1, 3)
    rtn = rtn + numToBin(state.inventory.candles + 1, 3)
    rtn = rtn + numToBin(state.inventory.pages + 1, 3)
    return rtn;
}

// decodes a binary string back into the playerState, gameState, and inventory
function decode(binaryStr: string): State {
    let idx = 0;

    // Decode PlayerState
    const currentLocation = binToNum(binaryStr.slice(idx, idx + 6));
    idx += 6;
    const sanity = binToNum(binaryStr.slice(idx, idx + 3));
    idx += 3;
    const playerState: PlayerState = {
        currentLocation,
        sanity
    };

    // Decode GameState
    const flareLocation = binToNum(binaryStr.slice(idx, idx + 6)) - 2; // reverse the +2 transformation
    idx += 6;
    const cigarettesTaken = binToNum(binaryStr.slice(idx, idx + 8));
    idx += 8;
    const candlesTaken = binToNum(binaryStr.slice(idx, idx + 8));
    idx += 8;
    const pagesTaken = binToNum(binaryStr.slice(idx, idx + 8));
    idx += 8;
    const gameState: GameState = {
        flareLocation,
        cigarettesTaken,
        candlesTaken,
        pagesTaken
    };

    // Decode Inventory
    const cigarettes = binToNum(binaryStr.slice(idx, idx + 3)) - 1; // reverse the +1 transformation
    idx += 3;
    const candles = binToNum(binaryStr.slice(idx, idx + 3)) - 1; // reverse the +1 transformation
    idx += 3;
    const pages = binToNum(binaryStr.slice(idx, idx + 3)) - 1; // reverse the +1 transformation
    idx += 3;
    const inventory: Inventory = {
        cigarettes,
        candles,
        pages
    };

    return { "player": playerState, "game": gameState, "inventory": inventory };
}

function binaryToBase64(binaryStr: string): string {
    // Ensure the binary string is properly padded to make it a multiple of 8 bits
    const paddedBinaryStr = binaryStr.padStart(Math.ceil(binaryStr.length / 8) * 8, '0');
    
    // Convert the binary string to an array of bytes
    const byteArray: number[] = [];
    for (let i = 0; i < paddedBinaryStr.length; i += 8) {
        byteArray.push(parseInt(paddedBinaryStr.slice(i, i + 8), 2));
    }
    
    // Convert the byte array to a Base64 string
    const buffer = new Uint8Array(byteArray);
    return btoa(String.fromCharCode(...buffer));
}

function base64ToBinary(base64Str: string): string {
    // Decode the Base64 string to an array of bytes
    const binaryString = atob(base64Str);
    const byteArray = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
    }

    // Convert each byte to a binary string and concatenate them
    let binaryStr = '';
    byteArray.forEach(byte => {
        binaryStr += byte.toString(2).padStart(8, '0'); // Ensure each byte is 8 bits long
    });

    return binaryStr;
}

function App() {
    const [data, setData] = useState(null);
    
    let playerState = {
        "currentLocation": 10,
        "sanity": 5
    }

    let gameState = {
        "flareLocation": -2,
        "cigarettesTaken": 63,
        "candlesTaken": 34,
        "pagesTaken": 8
    }

    let inventory = {
        "cigarettes": 5,
        "candles": 2,
        "pages": 5
    }

    let state = {"player": playerState, "game": gameState, "inventory": inventory}

    let encoded = encode(state)


    console.log("state:   ", state)
    console.log("normal:  ", encoded)
    console.log("encoded: ", binaryToBase64(encoded))
    console.log("decoded: ", base64ToBinary(binaryToBase64(encoded)))
    console.log("stateAFTR:", decode(base64ToBinary(binaryToBase64(encoded))))

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