import fs from 'fs-extra'
// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string

  constructor(name:string, id:string) {
    this.name = name,
    this.id = id
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private path: string = './db/searchHistory.json'
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readJson(this.path)
      return data as City[];
    } catch (err) {
      console.log(err)
      return []
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeJson(this.path, cities)// { spaces: 2 }
        console.log('Data file written successfully.')
    } catch (err) {
      console.log(err)
    }
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return this.read()
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string): Promise<void> {
    try {
      const cities = await this.getCities()
      const newCity = new City(city, `${Date.now()}`)
      cities.push(newCity)
      await this.write(cities)
    } catch (err) {
      console.log(err)
    }
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    try {
      const cities = await this.getCities()
      const removedCities = cities.filter(city => city.id !== id)
      await this.write(removedCities)
    } catch (err) {
      console.log(err)
    }
  }
}

export default new HistoryService();
