export default function MeteoForecast({ cityForecast }) {
    if (!cityForecast) {
        return <div>Loading...</div>;
    }


    return (
        <div className="flex flex-col items-center justify-center">
            <h2 className="text-8xl font-bold mb-4">{cityForecast.city}</h2>
            <div className="flex flex-wrap justify-center gap-4">
                {cityForecast.forecast.map((day, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-4 w-40">
                        <h3 className="text-lg font-semibold mb-2">{day.date}</h3>
                        <p className="text-gray-600 mb-2">Temp: {day.temp}°C</p>
                        <p className="text-gray-600 mb-2">Weather: {day.weather}</p>
                        <p className="text-gray-600 mb-2">Humidity: {day.humidity}%</p>
                        <p className="text-gray-600 mb-2">Wind: {day.wind} m/s</p>
                    </div>
                ))}
            </div>
        </div>
    );
}