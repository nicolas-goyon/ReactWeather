import { AutoCompleteCity } from "../data/geocoding";
import { useState } from "react";
import { GetCityFromGeolocation } from "../data/openweathermap";


import { FaLocationDot, FaSpinner } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";


async function GeolocationAutoFill(setLocating, setAutocompleteResults) {
    // Use navigator geolocation to get the user's current position
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by this browser.");
        return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
        try {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const results = await GetCityFromGeolocation(lat, lon);
            if (results.length > 0) {
                const city = results[0];
                AutoCompleteCityInput({ target: { value: city.name } }, setAutocompleteResults);
            } else {
                alert("No city found for your location.");
            }
        } finally {
            setLocating(false);
        }
    }, (error) => {
        console.warn("Geolocation error:", error);
        setLocating(false);
    });
}

async function AutoCompleteCityInput(input, setAutocompleteResults) {
    if (input.target.value.length < 3) return;

    const results = await AutoCompleteCity(input.target.value);

    setAutocompleteResults(results);
}

function AutoCompleteResultElement(result) {
    const city = result.result;
    return (
        <div className="autocomplete-result-item p-2 cursor-pointer hover:bg-gray-200 text-gray-800"
            onClick={() => {
                document.querySelector('input').value = `${city.name}, ${city.country}`;
                document.querySelector('#autocomplete-results').innerHTML = '';
                document.querySelector('#autocomplete-results').hidden = true;
            }}>
            {city.name}, {city.country}
        </div>
    );
}



export default function SearchBar({ onSearch }) {
    const [autocompleteResults, setAutocompleteResults] = useState([]);
    const [locating, setLocating] = useState(false);

    return (
        <div className="flex flex-row justify-between  p-10 bg-slate-900 text-slate-100">
            <h1 className="text-2xl font-bold">Météo</h1>
            <div className="flex items-center justify-center gap-2">
                <div>
                    <input
                        className="border border-gray-300 rounded-md p-2"
                        name="city"
                        type="text"
                        placeholder="Recherchez une ville..."
                        onChange={(e) => AutoCompleteCityInput(e, setAutocompleteResults)}
                    />
                    <div
                        id="autocomplete-results"
                        className="absolute mt-2 bg-white border border-gray-800 rounded-md shadow-lg z-50 w-64 max-h-60 overflow-y-auto"
                        hidden={autocompleteResults.length === 0}
                    >
                        {autocompleteResults.map((result, index) => (
                            <AutoCompleteResultElement key={index} result={result} />
                        ))}
                    </div>
                </div>
                <button
                    onClick={() => GeolocationAutoFill(setLocating, setAutocompleteResults)}
                    disabled={locating}
                    className={`${locating ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"} text-white p-2 rounded-md h-10 w-10 flex items-center justify-center`}
                >
                    {locating ? <FaSpinner className="animate-spin" /> : <FaLocationDot />}
                </button>
                <button onClick={() => onSearch(document.querySelector('input').value)} className="bg-green-500 text-white p-2 rounded-md h-10 w-10 flex items-center justify-center">
                    <CiSearch />
                </button>
            </div>
        </div>
    );
}