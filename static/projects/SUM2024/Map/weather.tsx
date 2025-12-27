import * as React from 'react'
import { fetchWeatherApi } from 'openmeteo'
import {
    Button,
    Grid,
    Icon,
    SvgIconTypeMap,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    styled
} from '@mui/material'
import { Paper } from '@mui/material'
import {
    AcUnit,
    Air,
    CloseFullscreen,
    CloudCircle,
    CloudQueue,
    Grain,
    OpenInFull,
    SevereCold,
    Thermostat,
    Thunderstorm,
    WaterDrop,
    WbSunny
} from '@mui/icons-material'
import { LineChart } from '@mui/x-charts/LineChart'
import { OverridableComponent } from '@mui/material/OverridableComponent.js'

export interface WeatherData {
    current: {
        time: Date
        temperature2m: number
        rain: number
        weatherCode: number
        precipitation: number
    }
    hourly: {
        time: Date[]
        temperature2m: Float32Array
        relativeHumidity2m: Float32Array
        precipitationProbability: Float32Array
        precipitation: Float32Array
        windSpeed10m: Float32Array
        windDirection10m: Float32Array
    }
}
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body1,
    padding: theme.spacing(1),
    margin: theme.spacing(0.5),
    textAlign: 'center',
    color: theme.palette.text.primary
}))
function WeatherIcon(props: { code: number }) {
    let text: string = 'default'
    let icon = <WbSunny></WbSunny>
    switch (props.code) {
        case 0:
            text = 'Clear sky'
            icon = <WbSunny></WbSunny>
            break
        case 1:
            text = 'Mainly clear'
            icon = <WbSunny></WbSunny>
            break
        case 2:
            text = 'Partly cloudy'
            icon = <CloudQueue></CloudQueue>
            break
        case 3:
            text = 'Overcast'
            icon = <CloudQueue></CloudQueue>
            break
        case 45:
            text = 'Fog'
            icon = <CloudCircle></CloudCircle>
            break
        case 48:
            text = 'Depositing rime fog'
            icon = <CloudCircle></CloudCircle>
            break
        case 51:
            text = 'Light drizzle'
            icon = <WaterDrop></WaterDrop>
            break
        case 53:
            text = 'Moderate drizzle'
            icon = <WaterDrop></WaterDrop>
            break
        case 55:
            text = 'Dense drizzle'
            icon = <WaterDrop></WaterDrop>
            break
        case 56:
            text = 'Light freezing drizzle'
            icon = (
                <>
                    <WaterDrop></WaterDrop>
                    <SevereCold></SevereCold>
                </>
            )
            break
        case 57:
            text = 'Dense freezing drizzle'
            icon = (
                <>
                    <WaterDrop></WaterDrop>
                    <SevereCold></SevereCold>
                </>
            )
            break
        case 61:
            text = 'Slight rain'
            icon = <WaterDrop></WaterDrop>
            break
        case 63:
            text = 'Moderate rain'
            icon = <WaterDrop></WaterDrop>
            break
        case 65:
            text = 'Heavy rain'
            icon = <WaterDrop></WaterDrop>
            break
        case 66:
            text = 'Light freezing rain'
            icon = (
                <>
                    <WaterDrop></WaterDrop>
                    <SevereCold></SevereCold>
                </>
            )
            text = 'Heavy freezing rain'
            icon = (
                <>
                    <WaterDrop></WaterDrop>
                    <SevereCold></SevereCold>
                </>
            )
            break
        case 71:
            text = 'Slight snow fall'
            icon = <AcUnit></AcUnit>
            break
        case 73:
            text = 'Moderate snow fall'
            icon = <AcUnit></AcUnit>
            break
        case 75:
            text = 'Heavy snow fall'
            icon = <AcUnit></AcUnit>
            break
        case 77:
            text = 'Snow grains'
            icon = <Grain></Grain>
            break
        case 80:
            text = 'Slight rain showers'
            icon = <WaterDrop></WaterDrop>
            break
        case 81:
            text = 'Moderate rain showers'
            icon = <WaterDrop></WaterDrop>
            break
        case 82:
            text = 'Violent rain showers'
            icon = <WaterDrop></WaterDrop>
            break
        case 85:
            text = 'Slight snow showers'
            icon = <WaterDrop></WaterDrop>
            break
        case 86:
            text = 'Heavy snow showers'
            icon = <WaterDrop></WaterDrop>
            break
        case 95:
            text = 'Slight thunderstorm'
            icon = <Thunderstorm></Thunderstorm>
            break
        case 96:
            text = 'Thunderstorm with slight hail'
            icon = <Thunderstorm></Thunderstorm>
            break
        case 99:
            text = 'Thunderstorm with heavy hail'
            icon = <Thunderstorm></Thunderstorm>
            break
    }
    return (
        <Item>
            {icon}
            {text}
        </Item>
    )
}
export function Weather(props: { weatherData: WeatherData | null }) {
    const [open, setOpen] = React.useState(true)
    const [chartType, setChartType] = React.useState<
        'Temperature' | 'Precipitation' | 'Wind'
    >('Temperature')
    return (
        <div id="weather" style={{ position: 'fixed', zIndex: 3 }}>
            {!open ? (
                <Paper elevation={7}>
                    <Button>
                        <OpenInFull
                            onClick={() => {
                                setOpen(true)
                            }}
                        ></OpenInFull>
                    </Button>
                </Paper>
            ) : (
                <Paper elevation={7}>
                    <Button>
                        <CloseFullscreen
                            onClick={() => {
                                setOpen(false)
                            }}
                        ></CloseFullscreen>
                    </Button>
                    <Typography variant="h5">Current data:</Typography>
                    <Grid container spacing={2} margin={1}>
                        <Item>
                            {'Now is ' +
                                props.weatherData?.current.time.toDateString()}
                        </Item>
                        <Item>
                            {'Temperature: ' +
                                props.weatherData?.current.temperature2m.toFixed(
                                    1
                                )}
                        </Item>
                        <Item>
                            {'Precipitation level: ' +
                                props.weatherData?.current.precipitation.toFixed(
                                    1
                                )}
                        </Item>
                        <WeatherIcon
                            code={props.weatherData?.current.weatherCode || 1}
                        ></WeatherIcon>
                    </Grid>

                    <ToggleButtonGroup
                        value={chartType}
                        exclusive
                        onChange={(e, value) => {
                            setChartType(value)
                        }}
                        aria-label="text alignment"
                    >
                        <ToggleButton value="Temperature">
                            <Thermostat></Thermostat>
                        </ToggleButton>
                        <ToggleButton value="Precipitation">
                            <WaterDrop></WaterDrop>
                        </ToggleButton>
                        <ToggleButton value="Wind">
                            <Air></Air>
                        </ToggleButton>
                    </ToggleButtonGroup>

                    <Typography variant="h5">
                        {chartType} for the next 3 days:
                    </Typography>
                    {props.weatherData ? (
                        chartType == 'Temperature' ? (
                            <LineChart
                                xAxis={[
                                    {
                                        data: props.weatherData.hourly.time
                                    }
                                ]}
                                series={[
                                    {
                                        data: Array.from(
                                            props.weatherData.hourly
                                                .temperature2m
                                        )
                                    }
                                ]}
                                width={500}
                                height={300}
                            ></LineChart>
                        ) : chartType == 'Precipitation' ? (
                            <LineChart
                                xAxis={[
                                    {
                                        data: props.weatherData.hourly.time
                                    }
                                ]}
                                series={[
                                    {
                                        data: Array.from(
                                            props.weatherData.hourly
                                                .precipitation
                                        )
                                    }
                                ]}
                                width={500}
                                height={300}
                            ></LineChart> /*chartType == "wind" ?*/
                        ) : (
                            <LineChart
                                xAxis={[
                                    {
                                        data: props.weatherData.hourly.time
                                    }
                                ]}
                                series={[
                                    {
                                        data: Array.from(
                                            props.weatherData.hourly
                                                .windSpeed10m
                                        )
                                    }
                                ]}
                                width={500}
                                height={300}
                            ></LineChart>
                        )
                    ) : (
                        <Typography>Cant load weather data!</Typography>
                    )}
                </Paper>
            )}
        </div>
    ) //<Paper elevation={6}>aaaaa</Paper>
}
export async function getWeather(
    latitude: number,
    longitude: number
): Promise<WeatherData> {
    const params = {
        latitude: latitude,
        longitude: longitude,
        current: ['temperature_2m', 'rain', 'weather_code', 'precipitation'],
        hourly: [
            'temperature_2m',
            'relative_humidity_2m',
            'precipitation_probability',
            'precipitation',
            'wind_speed_10m',
            'wind_direction_10m'
        ],
        timezone: 'auto',
        forecast_days: 3
    }
    const url = 'https://api.open-meteo.com/v1/forecast'
    const responses = await fetchWeatherApi(url, params)

    // Helper function to form time ranges
    const range = (start: number, stop: number, step: number) =>
        Array.from(
            { length: (stop - start) / step },
            (_, i) => start + i * step
        )

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0]

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds()
    const timezone = response.timezone()
    const timezoneAbbreviation = response.timezoneAbbreviation()

    const current = response.current()!
    const hourly = response.hourly()!

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
        current: {
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            temperature2m: current.variables(0)!.value(),
            rain: current.variables(1)!.value(),
            weatherCode: current.variables(2)!.value()!,
            precipitation: current.variables(3)!.value()!
        },
        hourly: {
            time: range(
                Number(hourly.time()),
                Number(hourly.timeEnd()),
                hourly.interval()
            ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
            temperature2m: hourly.variables(0)!.valuesArray()!,
            relativeHumidity2m: hourly.variables(1)!.valuesArray()!,
            precipitationProbability: hourly.variables(2)!.valuesArray()!,
            precipitation: hourly.variables(3)!.valuesArray()!,
            windSpeed10m: hourly.variables(4)!.valuesArray()!,
            windDirection10m: hourly.variables(5)!.valuesArray()!
        }
    }

    return weatherData
}
