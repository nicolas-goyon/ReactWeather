import { useEffect, useRef, useState } from "react";
import { FaLocationDot, FaMagnifyingGlass, FaSpinner } from "react-icons/fa6";
import { searchCities } from "../services/geocoding";
import { fetchCityFromCoordinates } from "../services/reverseGeocoding";

const AUTOCOMPLETE_MIN_LENGTH = 3;
const AUTOCOMPLETE_DEBOUNCE_MS = 300;

function formatCityLabel(city) {
    return [city.name, city.admin1, city.country].filter(Boolean).join(", ");
}


export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isListOpen, setIsListOpen] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [selectedCity, setSelectedCity] = useState(null);

    const containerRef = useRef(null);
    const skipNextSearchRef = useRef(false);

    useEffect(() => {
        if (skipNextSearchRef.current) {
            skipNextSearchRef.current = false;
            return;
        }
        if (query.trim().length < AUTOCOMPLETE_MIN_LENGTH) {
            setSuggestions([]);
            setIsListOpen(false);
            return;
        }
        const timer = setTimeout(async () => {
            try {
                const results = await searchCities(query.trim());
                setSuggestions(results);
                setIsListOpen(results.length > 0);
            } catch (error) {
                console.error("City autocomplete failed:", error);
            }
        }, AUTOCOMPLETE_DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [query]);

    // Close the suggestion list when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (!containerRef.current?.contains(event.target)) {
                setIsListOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function selectCity(city) {
        skipNextSearchRef.current = true;
        setSelectedCity(city);
        setQuery(formatCityLabel(city));
        setSuggestions([]);
        setIsListOpen(false);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            let city = selectedCity ?? suggestions[0];
            if (!city && query.trim().length >= AUTOCOMPLETE_MIN_LENGTH) {
                [city] = await searchCities(query.trim());
            }
            if (!city) return;
            selectCity(city);
            onSearch(city);
        } catch (error) {
            console.error("City search failed:", error);
        }
    }

    function handleLocate() {
        if (!navigator.geolocation) {
            alert("La géolocalisation n'est pas prise en charge par ce navigateur.");
            return;
        }
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const [place] = await fetchCityFromCoordinates(latitude, longitude);
                    const [city] = place ? await searchCities(place.name) : [];
                    if (city) {
                        selectCity(city);
                        onSearch(city);
                    } else {
                        alert("Aucune ville trouvée pour votre position.");
                    }
                } catch (error) {
                    console.error("Geolocation lookup failed:", error);
                    alert("Impossible de déterminer votre position.");
                } finally {
                    setIsLocating(false);
                }
            },
            (error) => {
                console.warn("Geolocation error:", error);
                setIsLocating(false);
            },
        );
    }

    return (
        <form ref={containerRef} onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="relative">
                <input
                    className="h-10 w-56 rounded-lg border border-slate-300 bg-white px-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:w-72"
                    name="city"
                    type="text"
                    placeholder="Rechercher une ville…"
                    autoComplete="off"
                    value={query}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setSelectedCity(null);
                    }}
                    onFocus={() => setIsListOpen(suggestions.length > 0)}
                    aria-label="Rechercher une ville"
                />
                {isListOpen && (
                    <ul className="absolute left-0 top-full z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-slate-200">
                        {suggestions.map((city) => (
                            <li key={city.id ?? `${city.latitude},${city.longitude}`}>
                                <button
                                    type="button"
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                                    onClick={() => selectCity(city)}
                                >
                                    <span className="font-medium text-slate-900">{city.name}</span>
                                    <span className="block text-xs text-slate-500">
                                        {[city.admin1, city.country].filter(Boolean).join(", ")}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <button
                type="button"
                onClick={handleLocate}
                disabled={isLocating}
                title="Utiliser ma position"
                aria-label="Utiliser ma position"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isLocating ? <FaSpinner className="animate-spin" /> : <FaLocationDot />}
            </button>
            <button
                type="submit"
                className="flex h-10 shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:px-4"
                aria-label="Rechercher"
            >
                <FaMagnifyingGlass className="text-xs" aria-hidden="true" />
                <span className="hidden sm:inline">Rechercher</span>
            </button>
        </form>
    );
}
