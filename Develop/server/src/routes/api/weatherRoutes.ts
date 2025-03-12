import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
//import WeatherService from '../../service/weatherService.js';
//import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: any, res: any) => {
  const { cityName } = req.body
  console.log('POST route', req.body, cityName)
  // try {
  //   const weatherData = await WeatherService.getWeatherForCity(cityName)
  //   res.json(weatherData)
  // } catch (err) {
  //   console.error('Error fetching weather data', err)
  //   res.status(500).send({err: 'Error fetching weather data'})
  // }
  // try {
  //   await HistoryService.addCity(cityName)
  // } catch (err) {
  //   console.error("Error with history", err)
  //   res.status(500).send({err: "Error with history"})
  // }

  // TODO: GET weather data from city name

  try {
   const geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=43b34f5c183fb0c1cc9887e1123dbd0b`)
   const geoData = await geoResponse.json()
    if (geoData.length === 0) {
     return res.status(404).json({ message: 'No city found' })
    }
    const lat = geoData[0].lat;
    const lon = geoData[0].lon;

    const forecast = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=43b34f5c183fb0c1cc9887e1123dbd0b`)
    const forecastJson = await forecast.json()
    const forecastJsonData = []
    for (let i = 0; i < forecastJson.list.length; i += 7) {
      forecastJsonData.push(forecastJson.list[i])
    }
    const weatherDataArray = forecastJsonData.map((forecast: {
     dt: number; weather: {
       icon: any; iconDescription: any;
      }[]; main: { temp: number; windSpeed: any; humidity: any; };
      }) => {
      
     return {
       city: cityName,
       date: new Date(forecast.dt * 1000).toLocaleDateString(),
       icon: forecast.weather[0].icon,
       iconDescription: forecast.weather[0].iconDescription,
       tempF: ((forecast.main.temp - 273.15) * 9) / 5 + 32,
       windSpeed: forecast.main.windSpeed,
       humidity: forecast.main.humidity
      }
    }
    )
  

    //save city history here
    try {
     await HistoryService.addCity(cityName)
    } catch (err) {
     console.error('Error saving city to history', err)
     res.status(500).send({ err: 'City not added to history' })
    }

    res.json(weatherDataArray)
  } catch (err) {
    console.error('Error with weather data fetch', err)
    res.status(500).send({ err: 'Error with weather data fetch' })
  }
});


// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities()
    res.json(cities)
  } catch (err) {
    console.error('Error', err)
    res.status(500).send({ err: 'Error fetching cities from history' })
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    await HistoryService.removeCity(id)
    res.status(204).send('City removed successfully')
  } catch (err) {
    console.error('Error removing city:', err)
    res.status(500).send({ err: 'Failed to remove city' })
  }
});

export default router;
