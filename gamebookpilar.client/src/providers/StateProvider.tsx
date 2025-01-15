import {FC, PropsWithChildren, useState, createContext} from "react"

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

// encodes a number into a binary string, filling in remaining 0's
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
function stateToBin(state: State): string {
    let rtn = "";
    rtn = rtn + numToBin(state.currentLocation, 6);
    rtn = rtn + numToBin(state.sanity, 3);
    rtn = rtn + state.cigarettesTaken; // 10 bits
    rtn = rtn + state.candlesTaken; // 5 bits
    rtn = rtn + state.pagesTaken; // 3 bits
    rtn = rtn + state.keysTaken; // 9 bits
    rtn = rtn + state.switchesFlipped; // 9 bits
    rtn = rtn + numToBin(state.cigarettesSmoked, 4); // 4 bits
    return rtn;
}

// decodes a binary string back into the playerState, gameState, and inventory
function binToState(bin: string): State {
    let index = 0;

    const currentLocation = binToNum(bin.slice(index, index + 6));
    index += 6;

    const sanity = binToNum(bin.slice(index, index + 3));
    index += 3;

    const cigarettesTaken = bin.slice(index, index + 9);
    index += 9;

    const candlesTaken = bin.slice(index, index + 5);
    index += 5;

    const pagesTaken = bin.slice(index, index + 3);
    index += 3;

    const keysTaken = bin.slice(index, index + 9);
    index += 9;

    const switchesFlipped = bin.slice(index, index + 9);
    index += 9;

    const cigarettesSmoked = binToNum(bin.slice(index, index + 4));
    index += 4;

    return {
        currentLocation: currentLocation,
        sanity: sanity,
        cigarettesTaken: cigarettesTaken,
        candlesTaken: candlesTaken,
        pagesTaken: pagesTaken,
        keysTaken: keysTaken,
        switchesFlipped: switchesFlipped,
        cigarettesSmoked: cigarettesSmoked
    };
}

// converts a binary string into a Base64 string
function binaryToBase64(binaryStr: string): string {
    const paddedBinaryStr = binaryStr.padStart(Math.ceil(binaryStr.length / 8) * 8, '0');
    
    const byteArray: number[] = [];
    for (let i = 0; i < paddedBinaryStr.length; i += 8) {
        byteArray.push(parseInt(paddedBinaryStr.slice(i, i + 8), 2));
    }
    
    const buffer = new Uint8Array(byteArray);
    return btoa(String.fromCharCode(...buffer));
}

// converts a Base64 string into a binary string
function base64ToBinary(base64Str: string): string {
    const binaryString = atob(base64Str);
    const byteArray = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
    }

    let binaryStr = '';
    byteArray.forEach(byte => {
        binaryStr += byte.toString(2).padStart(8, '0');
    });

    return binaryStr;
}

// encodes the state to Base64, leaving the length of the binary string after the +
function encode(state: State): string {
    let bin = stateToBin(state);
    return binaryToBase64(bin) + "+" + bin.length;
}

// decodes the state from Base64, matching the binary string from the length after the +
function decode(text: string): State {
    let bin = base64ToBinary(text.split("+")[0]);
    let binLength = parseInt(text.split("+")[1]);
    while (binLength != bin.length) {
        bin = bin.substring(1);
    }
    return binToState(bin);
}

function updateGameKey(newString: string | undefined) : string {
    let gameKey: string = encode({
        "currentLocation": 1,
        "sanity": 5,
        "cigarettesTaken": "000000000",
        "candlesTaken": "00000",
        "pagesTaken": "000",
        "keysTaken": "000000000",
        "switchesFlipped": "000000000",
        "cigarettesSmoked": 0,
    });
    let storedKey = localStorage.getItem("gameKey");
    if (newString) {
        if (newString != "reset") {
            gameKey = newString;
        }
    } else if (storedKey) {
        gameKey = storedKey;
    }
    localStorage.setItem("gameKey", gameKey);
    return gameKey;
}

interface TStateContext {
    updateGameKey: (k: string | undefined) => string,
    encode: (s: State) => string,
    decode: (s: string) => State
}

export const StateContext = createContext<TStateContext>(
    {
        updateGameKey: (k: string | undefined) => "",
        encode: (s: State) => "",
        decode: (s: string) => ({
            "currentLocation": 0,
            "sanity": 5,
            "flareLocation": -2,
            "cigarettesTaken": "000000000",
            "candlesTaken": "00000",
            "pagesTaken": "000",
            "keysTaken": "000000000",
            "switchesFlipped": "000000000",
            "cigarettesSmoked": 0,
        })
    }
);

export const StateProvider:FC<PropsWithChildren> = ({children}) => {
    return (
        <StateContext.Provider value={{
            "updateGameKey": updateGameKey,
            "encode": encode,
            "decode": decode
        }}>
            {children}
        </StateContext.Provider>
    )
}

export default StateProvider;