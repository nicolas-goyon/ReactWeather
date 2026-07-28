# Météo (ReactWeather)

Application météo en React : conditions actuelles, prévisions horaires (24 h) et quotidiennes (7 jours), avec recherche de ville et géolocalisation. 

## Stack

React 19 · Vite · Tailwind CSS 4 · react-icons

## APIs

- [Open-Meteo Forecast](https://open-meteo.com/en/docs) — prévisions météo (sans clé)
- [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) — autocomplétion des villes (sans clé)
- [OpenWeatherMap Reverse Geocoding](https://openweathermap.org/api/geocoding-api) — ville depuis la géolocalisation (clé requise)

## Démarrage

```bash
cp .env.example .env   # renseigner VITE_OPENWEATHERMAP_API_KEY
npm install
npm run dev
```
