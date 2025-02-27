import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;

}
// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(
    city: string,
    date: string,
    icon: string,
    iconDescription: string,
    tempF: number,
    windSpeed: number,
    humidity: number,
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL?: string
  private APIKey?: string
  constructor() {
    this.baseURL = process.env.API_BASE_URL || ""
    this.APIKey = process.env.API_KEY || ""
  } 
  private cityName!: string
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates[]> {
    try {
      const response: Coordinates[] = await fetch(query).then((res) => res.json())
      return response;
    } catch (err) {
      console.error('Error with fetching location data:', err);
      throw err;
    }
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates[]): Coordinates {
    return {
      lat: locationData[0].lat,
      lon: locationData[0].lon      
    }
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.APIKey}`
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.APIKey}`
  }
  // TODO: Create fetchAndDestructureLocationData method.
  private async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery())
    if(Array.isArray(locationData) && locationData.length > 0) {
      return this.destructureLocationData(locationData)
    } else {
      console.error(`No location data available.`)
      return null
    }
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const response = await fetch(this.buildWeatherQuery(coordinates))
    const data = await response.json()
    return data
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const city = this.cityName
    const date = new Date(response.dt * 1000).toLocaleDateString()
    const icon = response.list[0].weather[0].icon
    const iconDescription = response.list[0].weather[0].iconDescription
    const tempF = ((response.list[0].main.tempF - 273.15) * 9)/5 + 32
    const windSpeed = response.list[0].main.windSpeed
    const humidity = response.list[0].main.humidity
    return new Weather(city, date, icon, iconDescription, tempF, windSpeed, humidity)
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    const forecastArr = []
    forecastArr.push(currentWeather);

    for(let i = 1; i < weatherData.length; i++) {
      const city = this.cityName
      const date = new Date(weatherData[i].dt * 1000).toLocaleDateString()
      const icon = weatherData[i].weather[0].icon
      const iconDescription = weatherData[i].weather[0].iconDescription
      const tempF = ((weatherData[i].main.tempF - 273.15) * 9)/5 + 32
      const windSpeed = weatherData[i].main.windSpeed
      const humidity = weatherData[i].main.humidity
      forecastArr.push(new Weather(city, date, icon, iconDescription, tempF, windSpeed, humidity))
    } return forecastArr
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city
    const coordinates = await this.fetchAndDestructureLocationData()
    if(!coordinates) {
      throw new Error (`Coordinates not available`)
    }
    const weatherData = await this.fetchWeatherData(coordinates)
    const currentWeather = this.parseCurrentWeather(weatherData)
    const forecastArr = this.buildForecastArray(currentWeather, weatherData.list)
    console.log({ currentWeather, forecastArr })
    return { currentWeather, forecastArr }
  }
}

export default new WeatherService();
