import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;

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
  private baseURL = 'https://api.openweathermap.org/data/2.5/forecast?lat={latitude}&lon={longitude}&appid={APIkey}'
  private APIKey = '43b34f5c183fb0c1cc9887e1123dbd0b'
  private namedCity!: string

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    try {
      const response = await fetch(query)
      const dataLocation = await response.json()
      console.log('Location Data:', dataLocation)
      return dataLocation 
    } catch (err) {
      console.error('Error with fetching location data:', err)
      //return null
    }
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    return {
      latitude: locationData.latitude,
      longitude: locationData.longitude      
    }
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geo/1.0/direct?q=${this.namedCity}&limit=1&appid=${this.APIKey}`
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.APIKey}`
  }
  // TODO: Create fetchAndDestructureLocationData method.
  private async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery())
    if(Array.isArray(locationData) && locationData.length > 0) {
      return this.destructureLocationData(locationData[0])
    } else {
      console.error(`No location data available.`)
      return null
    }
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates))
    const data = await response.json()
    return data
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const city = this.namedCity
    const date = new Date(response.list[0].dt * 1000).toLocaleDateString()
    const icon = response.list[0].weather[0].icon
    const iconDescription = response.list[0].weather[0].iconDescription
    const tempF = ((response.list[0].main.tempF - 273.15) * 9)/5 + 32
    const windSpeed = response.list[0].main.windSpeed
    const humidity = response.list[0].main.humidity
    return new Weather(city, date, icon, iconDescription, tempF, windSpeed, humidity)
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArr = []
    forecastArr.push(currentWeather);

    for(let i = 1; i < weatherData.length; i++) {
      const city = this.namedCity
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
    this.namedCity = city
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
