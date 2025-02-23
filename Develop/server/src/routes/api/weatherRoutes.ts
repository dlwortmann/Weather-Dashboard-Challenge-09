import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  const { namedCity } = req.body
  console.log('POST route', req.body, namedCity)
  // TODO: GET weather data from city name
  try {
    const weatherData = await WeatherService.getWeatherForCity(namedCity)
    res.json(weatherData)
  } catch (err) {
    console.error('Error with weather data fetch', err)
    res.status(500).send({ err: 'Error with weather data fetch' })
  }
  // TODO: save city to search history
  try {
    await HistoryService.addCity(namedCity)
  } catch (err) {
    console.error('Error', err)
    res.status(500).send({ err: 'City not added to history' })
  }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities()
    res.json(cities)
  } catch (err) {
    console.error('Error', err)
    res.status(500).send({ err: 'Error fetching cities from history'})
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
    res.status(500).send({ err: 'Failed to remove city'})
  }
});

export default router;
