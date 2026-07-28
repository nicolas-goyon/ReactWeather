import MeteoForecast from './components/MeteoForecast';
import SearchBar from './components/SearchBar';

export default function App() {
  return (
    <main className="flex flex-col min-h-screen bg-gray-200">
      <SearchBar onSearch={(city) => {
        // Handle search logic here
      }} />
      <MeteoForecast cityForecast={null} />

    </main>
  )
}
