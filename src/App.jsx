import MeteoForecast from './components/MeteoForecast';
import SearchBar from './components/SearchBar';
import { useRef } from 'react';

export default function App() {
  const forecastRef = useRef(null);

  return (
    <main className="flex flex-col min-h-screen bg-gray-200">
      <SearchBar onSearch={(city) => forecastRef.current?.updateCity(city)} />
      <MeteoForecast ref={forecastRef} />

    </main>
  )
}
