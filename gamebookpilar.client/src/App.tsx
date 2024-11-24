import { useEffect, useState } from 'react';
import './App.css';

interface Location {
    locationId: number,
    name: string,
    body: string
}

interface Inventory {
    cigarettes: number,
    flares: number,
    candles: number,
    pages: number
}

function encode(inventory:Inventory): string {
    console.log(inventory.cigarettes.toString(2) + inventory.flares.toString(2), inventory.candles.toString(2), inventory.pages.toString(2))
    return "";
}

function App() {
    const [data, setData] = useState(null);
    
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