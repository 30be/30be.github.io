import React, { useEffect, useState } from 'react'
import { MapComponent } from './map.js'
import { Weather, WeatherData, getWeather } from './weather.js'

export function App(): React.JSX.Element {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
    useEffect(() => {
        getWeather(30, 60).then((wd) => setWeatherData(wd))
    }, [])
    return (
        <div id="app">
            <Weather weatherData={weatherData}></Weather>
            <MapComponent
                onLeftClick={(e, map) => {
                    getWeather(e.lngLat.lat, e.lngLat.lng).then((weather) => {
                        setWeatherData(weather)
                    })
                }}
                onRightClick={(e, map) => {}}
            ></MapComponent>
        </div>
    )
}
