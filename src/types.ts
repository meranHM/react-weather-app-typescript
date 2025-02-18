
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
        hour: {
          time: string
          temp_c: number
          humidity: number
          condition: {
            icon: string
          }
        }[]
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

//Type for Locations object
export type Locations = {
    id: string
    city: string
}

//Type for Other Locations object
export type OtherLocations = {
    id: string
    temp: number
    maxTemp: number
    minTemp: number
    city: string
    country: string
    localTime: string
}

//Type for SideBar props object
export type SideBarProps = {
  formSubmit: (formData: FormData) => void
  locations: Locations[]
  forecast: Forecast | null
  otherForecast: OtherLocations[]
  timeOfDay: {dayOrNight: string, isDay: boolean} | undefined
  infoModal: boolean
  roundedValues: {
    roundedTemp: number;
    roundedFeelTemp: number;
    roundedMaxTemp: number;
    roundedMinTemp: number;
    localUv: UvIndex;
  } | null
  openManageLocationsModal: () => void
  openInfoModal: () => void
  closeInfoModal: () => void
}

//Type for ManageLocations props object
export type ManageLocationsProps = {
  infoModal: boolean
  forecast: Forecast | null
  otherForecast: OtherLocations[]
  locations: Locations[]
  favLocation: string
  roundedValues: {
    roundedTemp: number;
    roundedFeelTemp: number;
    roundedMaxTemp: number;
    roundedMinTemp: number;
    localUv: UvIndex;
  } | null
  timeOfDay: {dayOrNight: string, isDay: boolean} | undefined
  closeManageLocationsModal: () => void
  openInfoModal: () => void
  closeInfoModal: () => void
  toggleFavorite: (id: string) => void
  handleDelete: (id: string) => void
}

//Type for Information Props Object
export type InformationProps = {
  closeInfoModal: () => void
}

//Type for HourlyForecast Props Object
export type HourlyForecastProps = {
  forecast: Forecast | null
}

//Type for Error handler
export type ErrorHandler = {
  error: string
  setError: React.Dispatch<React.SetStateAction<string>>
  handleFetchError: (error: unknown) => void
}