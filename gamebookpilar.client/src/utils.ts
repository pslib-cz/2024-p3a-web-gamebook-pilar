// encodes a number into a binary string, filling in the 0's at the beginning

export interface PlayerState {
    currentLocation: number, // the location that the player is currently in
    sanity: number // sanity level of player (0 to 5)
}

export interface GameState {
    flareLocation: number, // location of the flare, -1 means its in the inventory of the player, -2 means it hasn't been found yet
    cigarettesTaken: string, // cigarettes will be finite and set for each room, it will be held like this: 10101010110
    candlesTaken: string, // -||-
    pagesTaken: string, // -||-
}

export interface Inventory {
    cigarettes: number, // amount of cigarettes on the player (-1 to 5)
    candles: number, // amount of candles on the player (-1 to 5)
    pages: number // amount of pages on the player (-1 to 5)
}

export interface State {
    player: PlayerState,
    game: GameState,
    inventory: Inventory
}

// encodes a number into a binary string, filling in remaining 0's
export function numToBin(num: number, range:number) {
    let rtn = num.toString(2)
    while (rtn.length < range) {
        rtn = "0" + rtn
    }
    return rtn
}

// decodes a binary string into a number
export function binToNum(binaryStr: string): number {
    return parseInt(binaryStr, 2);
}

// encodes playerState, gameState and inventory in a single binary string
export function stateToBin(state: State): string {
    let rtn = "";
    rtn = rtn + numToBin(state.player.currentLocation, 6)
    rtn = rtn + numToBin(state.player.sanity, 3)
    rtn = rtn + numToBin(state.game.flareLocation + 2, 6)
    rtn = rtn + state.game.cigarettesTaken // 10 bits
    rtn = rtn + state.game.candlesTaken // 5 bits
    rtn = rtn + state.game.pagesTaken // 3 bits
    rtn = rtn + numToBin(state.inventory.cigarettes + 1, 3)
    rtn = rtn + numToBin(state.inventory.candles + 1, 3)
    rtn = rtn + numToBin(state.inventory.pages + 1, 3)
    console.log(rtn)
    return rtn;
}

// decodes a binary string back into the playerState, gameState, and inventory
export function binToState(bin: string): State {
    console.log(bin)
    let index = 0;

    const currentLocation = binToNum(bin.slice(index, index + 6));
    index += 6;

    const sanity = binToNum(bin.slice(index, index + 3));
    index += 3;

    const flareLocation = binToNum(bin.slice(index, index + 6)) - 2;
    index += 6;

    const cigarettesTaken = bin.slice(index, index + 9);
    index += 9;

    const candlesTaken = bin.slice(index, index + 5);
    index += 5;

    const pagesTaken = bin.slice(index, index + 3);
    index += 3;

    const cigarettes = binToNum(bin.slice(index, index + 3)) - 1;
    index += 3;

    const candles = binToNum(bin.slice(index, index + 3)) - 1;
    index += 3;

    const pages = binToNum(bin.slice(index, index + 3)) - 1;
    index += 3;

    return {
        player: {
            currentLocation: currentLocation,
            sanity: sanity,
        },
        game: {
            flareLocation: flareLocation,
            cigarettesTaken: cigarettesTaken,
            candlesTaken: candlesTaken,
            pagesTaken: pagesTaken,
        },
        inventory: {
            cigarettes: cigarettes,
            candles: candles,
            pages: pages,
        },
    };
}

// converts a binary string into a Base64 string
export function binaryToBase64(binaryStr: string): string {
    const paddedBinaryStr = binaryStr.padStart(Math.ceil(binaryStr.length / 8) * 8, '0');
    
    const byteArray: number[] = [];
    for (let i = 0; i < paddedBinaryStr.length; i += 8) {
        byteArray.push(parseInt(paddedBinaryStr.slice(i, i + 8), 2));
    }
    
    const buffer = new Uint8Array(byteArray);
    return btoa(String.fromCharCode(...buffer));
}

// converts a Base64 string into a binary string
export function base64ToBinary(base64Str: string): string {
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
export function encode(state: State): string {
    let bin = stateToBin(state);
    return binaryToBase64(bin) + "+" + bin.length;
}

// decodes the state from Base64, matching the binary string from the length after the +
export function decode(text: string): State {
    let bin = base64ToBinary(text.split("+")[0])
    let binLength = parseInt(text.split("+")[1])
    while (binLength != bin.length) {
        bin = bin.substring(1)
    }
    return binToState(bin);
}