
//Type for Forecast object
export type Forecast = {
    current: {
      temp_c: number
      feelslike_c: number
      air_quality: {
        "us-epa-index": number
      }
      uv: number
      humidity: number
      wind_kph: number
    }
    location: {
      name: string
      country: string
      localtime: string
    }
    forecast: {
      forecastday: {
        date: string
        day: {
          maxtemp_c: number
          mintemp_c: number
        }
        astro: {
          sunrise: string
          sunset: string
        }
        condition: {
            text: string
            icon: string
        }
      }[]
    }
  }

  
 //Type for WeatherAlrets object
 export type Alert= {
    desc: string;
 }

 export type WeatherAlrerts = {
    alerts: {
        alert: Alert[]
    }
 }
 


//Type for AQI Levels
export type AqiIndex = 1 | 2 | 3 | 4 | 5 | 6

export type AqiLevels = {
    1: string
    2: string
    3: string
    4: string
    5: string
    6: string
}

//Type for UV Index
export type UvIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export type UvLevels = {
    0: string
    1: string
    2: string
    3: string
    4: string
    5: string
    6: string
    7: string
    8: string
    9: string
    10: string
}

//Type for Locations
export type Locations = {
    id: string
    city: string
}

