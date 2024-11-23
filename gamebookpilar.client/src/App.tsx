import { useEffect, useState } from 'react';
import './App.css';

interface Location {
    locationId: number,
    name: string,
    body: string
}

function App() {
    const [data, setData] = useState(null);
    
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch("api/Locations");
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