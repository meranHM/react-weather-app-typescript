import { useState, useEffect, useRef, useMemo, lazy, Suspense } from 'react'
import { getWeatherAlerts, getForecast, validateCity } from '../weather.js'
import { motion } from 'framer-motion'
import { Menu, X, MapPin, Radiation } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useMediaQuery } from 'react-responsive'
import { Forecast, AqiLevels, AqiIndex, UvIndex,
  UvLevels, Locations, WeatherAlrerts, OtherLocations } from './types.ts'
import Loader from './components/Loader.tsx'
import dayIcon from './assets/sun.png'
import nightIcon from './assets/crescent-moon.png'
import uvIcon from './assets/uv-index.png'
import humidityIcon from './assets/humidity.png'
import windIcon from './assets/wind.png'
import sunriseIcon from './assets/sunrise.png'
import sunsetIcon from './assets/sunset.png'
import useErrorHandler from './hooks/useErrorHandler.ts'


const App = () => {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [locations, setLocations] = useState<Locations[]>([])
  const [favLocation, setFavlocation] = useState<Locations>({id: "", city: ""})
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlrerts | null>(null)
  const [forecast, setForcast] = useState<Forecast | null>(null)
  const [otherForecast, setOtherForecast] = useState<OtherLocations[]>([])
  const [manageLocsModal, setManageLocsModal] = useState(false)
  const [infoModal, setInfoModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const SideBarRef = useRef<HTMLDivElement | null>(null)
  const { error, setError, handleFetchError } = useErrorHandler()

 
  //Lazy Loading certain components
  const ManageLocations = lazy(() =>  import("./components/ManageLocations.tsx"))
  const SideBar = lazy(() => import("./components/SideBar.tsx"))
  const HourlyForecast = lazy(() => import("./components/HourlyForecast.tsx"))

  //Derived Values
  const smallScreen: boolean = useMediaQuery({ maxWidth: 640 })
  const hasFavorite: boolean = favLocation.city !== ""
  const roundedValues = useMemo(() => {
    if (!forecast) {
      return null
    }
    const roundedTemp = Math.floor(forecast.current.temp_c)
    const roundedFeelTemp = Math.floor(forecast.current.feelslike_c)
    const roundedMaxTemp = Math.floor(forecast.forecast.forecastday[0].day.maxtemp_c)
    const roundedMinTemp = Math.floor(forecast.forecast.forecastday[0].day.mintemp_c)
    const localUv = Math.floor(forecast.current.uv) as UvIndex
    return {roundedTemp, roundedFeelTemp, roundedMaxTemp, roundedMinTemp, localUv}
  },[forecast])


  //Choosing icon and background based on local time
  const timeOfDay = useMemo(() => {
    if (!forecast) {
      console.error("Forecast data is not available")
      return
    }

    const localTime: string = forecast.location.localtime
    const hour: number = parseInt(localTime.split(" ")[1].split(":")[0], 10)
    let dayOrNight: string = ""
    let isDay: boolean = false

    if (hour >= 6 && hour < 19) {
        dayOrNight = dayIcon
        isDay = true
      } else {
        dayOrNight = nightIcon
        isDay = false
      }
    return {dayOrNight, isDay}
  },[forecast])



  //Handling Air Quality based on data fetched from API
  const localAqi = forecast?.current.air_quality["us-epa-index"] as AqiIndex | undefined
  const aqiLevels: AqiLevels = {
    1: "Good",
    2: "Moderate",
    3: "Unhealthy for sensitive groups",
    4: "Unhealthy",
    5: "Very Unhealthy",
    6: "Hazardous",
  }
  const aqi: string = localAqi ? aqiLevels[localAqi] : "Unknown"

  //Handling UV Index based on data fetched from API
  const uvIndex = useMemo(() => {
    if (!roundedValues) {
      return
    }
    const uvLevels: UvLevels = {
      0: "Low",
      1: "Low",
      2: "Low",
      3: "Moderate",
      4: "Moderate",
      5: "Moderate",
      6: "High",
      7: "High",
      8: "Very High",
      9: "Very High",
      10: "Very High"
    }
    const uvValue = roundedValues.localUv >= 11 ? "Extreme" : uvLevels[roundedValues.localUv] || "Unkown"

    return uvValue
  }, [forecast])


  //Handle function for opening and closing sidebar menu
  const toggleMenu = ():void => {
    setIsNavOpen(!isNavOpen)
  }

  //Handling location form submission with React 19 method
   const formSubmit = async (formData: FormData): Promise<void> => {
      const city = formData.get("city")
      const cityName: string = city ? city.toString().trim().toLocaleLowerCase() : ""
  
      if (cityName === "" || cityName === favLocation.city) {
        return
      }
      setError("")

      try {
        //Calling an API function to check if the city input is valid
        const isCityValid = await validateCity(cityName)
          if (!isCityValid) {
            setError("Invalid city name. Please enter a valid city.")
            setIsNavOpen(false)
            return
          }

        if (!hasFavorite) {
          setFavlocation({
            id: nanoid(),
            city: cityName
          })
        } else {
          setLocations(prevLocs => [...prevLocs, {
              id: nanoid(),
              city: cityName
            }])
        }
      } catch {
        setError("Failed to validate city. Please try again.")
      }
      
    }

  //Fetching weather data and alerts for favortie location from the API
  const fetchFavLocWeather = async (): Promise<void> => {
    if (!hasFavorite) {
      return
    }

    setError("")
    setWeatherAlerts(null)
    setForcast(null)
    setIsLoading(true)
    
    try {
      const forecastData = await getForecast(favLocation.city)
      const weatherAlertsData = await getWeatherAlerts(favLocation.city)

    if (forecastData) {
      setForcast(forecastData)
      setIsNavOpen(false)
    } else {
      setError("Could not fetch weather. Please try again.")
    }

    if (weatherAlertsData && weatherAlertsData.alerts) {
      setWeatherAlerts(weatherAlertsData)
    }
  } catch (error: unknown) {
    handleFetchError(error)
  } finally {
    setIsLoading(false)
  }
}

  //Fetching weather data for other locations from the API
  const fetchOtherLocsWeather = async () => {
    const lastLocation = locations[locations.length - 1].city
    const lastLocationId = locations[locations.length - 1].id
    const otherForecastData = await getForecast(lastLocation)
    
    if (otherForecastData) {
      setOtherForecast(prevData => [...prevData, {
        id: lastLocationId,
        temp: Math.floor(otherForecastData.current.temp_c),
        maxTemp: Math.floor(otherForecastData.forecast.forecastday[0].day.maxtemp_c),
        minTemp: Math.floor(otherForecastData.forecast.forecastday[0].day.mintemp_c),
        city: otherForecastData.location.name,
        country: otherForecastData.location.country,
        localTime: otherForecastData.location.localtime,
      }])
    } else {
      console.error("Could not fetch data for other locations.")
    }
  }

  //Handling favorite location function
  const toggleFavorite = (id: string) => {
    const location = locations.find(loc => loc.id === id)
    
    if (location) {
      setFavlocation({
        id: location.id,
        city: location.city
      })
      handleDelete(id)
    }
  }

  //Handling Delete function
  const handleDelete = (id: string) => {
    setLocations(prevLocs => prevLocs.filter(loc => loc.id !== id))
  }

  //Opening and Closing Modals
  const openManageLocationsModal = () => {
    setManageLocsModal(true)
  }

  const closeManageLocationsModal = () => {
    setManageLocsModal(false)
  }

  const openInfoModal = () => {
    setInfoModal(true)
  }

  const closeInfoModal = () => {
    setInfoModal(false)
  }

  //Creating an eventListener for esc button to close the modals
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      closeInfoModal()
      closeManageLocationsModal()
    }
  }

  useEffect(() => {
    if (infoModal || manageLocsModal) {
      window.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [infoModal, manageLocsModal])

  //Detecting if user clicked outside the SideBar
  useEffect(() => { 
    const handleClickOutside = (e: MouseEvent) => {
      if (SideBarRef.current && !SideBarRef.current.contains(e.target as Node)) {
        setIsNavOpen(false)
      }
    }
    if (isNavOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isNavOpen])

  //Calling fetch functions
  useEffect(() => {
    if (favLocation.city) {
      fetchFavLocWeather()
    }
  }, [favLocation])

  useEffect(() => {
      if (locations.length > 0) {
          fetchOtherLocsWeather()
        }
  }, [locations])


  return (
    <main className={`min-h-screen transition-all duration-500 ${timeOfDay?.isDay ? "bg-day-sky" : "bg-night-sky"}`}>
      <div className="relative min-h-screen max-w-3xl mx-auto overflow-hidden">
        {isLoading ? (
          <motion.div 
            initial={{opacity: 0.5, scale: 0.8}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 0.8, repeat: Infinity, repeatType: "reverse"}}
            className="flex justify-center items-center h-screen"
          >
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
          </motion.div>
        ) : (
        <>
          <motion.div
              animate={{x: isNavOpen ? (smallScreen ? "18rem" : "24rem") : "0rem"}}
              transition={{type: "spring", stiffness: 80}}
              className="p-1"
            >
              <button 
                className="absolute top-4 left-2 sm:left-4 bg-white/10 backdrop-blur-md text-white rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={toggleMenu}
                aria-expanded={isNavOpen}
                aria-label={isNavOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
              >
                {isNavOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {error && 
                <motion.p 
                  initial={{y: -30, opacity: 0}}
                  animate={{y: 0, opacity: 1}}
                  exit={{y: -30, opacity: 0}}
                  transition={{type: "spring", stiffness: 100}}
                  className="bg-white/10 backdrop-blur-md rounded-lg p-5 shadow-lg border border-white/20 h-16 w-96 text-center text-white mx-auto mt-20"
                >
                  {error}
                </motion.p>}

              {forecast && (
                <motion.div 
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  transition={{duration: 1, ease: "easeOut"}}
                  id="weather-info" 
                  className="flex flex-col items-center text-white w-full py-14 sm:py-10 px-5 sm:px-10"
                >
                  <div id="temp" className="w-11/12 sm:px-10" role="region" aria-labelledby="location-title">
                    <h2 id="location-title" className="sr-only">
                      Weather Information for {forecast.location.name}
                    </h2>
                    <div className="flex justify-between items-center w-full">
                      <div className="flex flex-col items-end">
                      {roundedValues && ( 
                        <motion.p 
                          initial={{opacity: 0, scale: 0.9}}
                          animate={{opacity: 1, scale: 1}}
                          transition={{duration: 0.5}}
                          className="text-5xl self-start mb-5"
                        >
                          {roundedValues.roundedTemp}&deg;
                        </motion.p>
                        )}
                        <p className="flex items-center text-2xl sm:text-4xl gap-3 text-nowrap">  
                          {forecast.location.name} <MapPin size={30} />
                        </p>
                      </div>
                      {timeOfDay && (
                        <motion.img
                          initial={{rotate: 0}}
                          animate={{rotate: 360}}
                          transition={{duration: 2, repeat: 1, delay: 1, repeatDelay: 1}} 
                          src={timeOfDay.dayOrNight} 
                          alt={timeOfDay.isDay ? "Sun Icon" : "Moon Icon"}
                          className="w-20 sm:w-28" 
                        />
                      )}
                    </div>
                    <div className="mt-5 text-left text-sm font-normal leading-6">
                      {roundedValues && (
                        <p className="tracking-wider">
                        {roundedValues.roundedMaxTemp}&deg; / {roundedValues.roundedMinTemp}&deg; Feels like {roundedValues.roundedFeelTemp}&deg;
                      </p>
                    )}
                      <p className="tracking-wider">
                        {forecast.location.localtime}
                      </p>
                    </div>
                  </div>
                  <Suspense fallback={<Loader />}>
                    <HourlyForecast
                        forecast={forecast}
                    />
                  </Suspense>
                  <div id="sunrise-sunset" className="flex justify-evenly items-center bg-white/10 backdrop-blur-md rounded-lg p-5 mt-2 shadow-lg border border-white/20 w-11/12 text-center">
                    <div id="sunrise" className="w-1/2 flex flex-col items-center">
                      <h3>Sunrise</h3>
                      <p>{forecast.forecast.forecastday[0].astro.sunrise}</p>
                      <img src={sunriseIcon} alt="sunrise icon"  className="w-20 mt-2"/>
                    </div>
                    <div id="sunset" className="w-1/2 flex flex-col items-center">
                      <h3>Sunset</h3>
                      <p>{forecast.forecast.forecastday[0].astro.sunset}</p>
                      <img src={sunsetIcon} alt="sunset icon" className="w-20 mt-2"/>
                    </div>
                  </div>
                  <div id="weather-conditions" className="flex justify-evenly items-center bg-white/10 backdrop-blur-md rounded-lg p-5 mt-2 shadow-lg border border-white/20 w-11/12 text-center">
                    <div id="uv-index" className="flex flex-col items-center justify-evenly gap-1 w-1/3">
                      <img src={uvIcon} alt="uv index icon"  className="w-10 mb-1"/>
                      <h3 className="text-center font-semibold">UV index</h3>
                      <p className="text-gray-200/85">{uvIndex}</p>
                    </div>
                    <div id="humidity" className="flex flex-col items-center justify-evenly gap-1 border-x border-white/20 w-1/3">
                      <img src={humidityIcon} alt="humidity icon"  className="w-10 mb-1"/>
                      <h3 className="text-center font-semibold">Humidity</h3>
                      <p className="text-gray-200/85">{forecast.current.humidity}%</p>
                    </div>
                    <div id="wind" className="flex flex-col items-center justify-evenly gap-1 w-1/3">
                      <img src={windIcon} alt="wind icon"  className="w-10 mb-1"/>
                      <h3 className="text-center font-semibold">Wind</h3>
                      <p className="text-gray-200/85">{forecast.current.wind_kph} km/h</p>
                    </div>
                  </div>
                  <div id="aqi" className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-lg p-5 mt-2 shadow-lg border border-white/20 w-11/12 text-center sm:px-16" >
                    <p className="flex gap-2"><Radiation/>AQI</p>
                    <p className="text-nowrap">{aqi}</p>
                  </div>
                  {weatherAlerts ? weatherAlerts.alerts.alert[0]  && (
                    <div id="alerts" className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-lg p-5 mt-10 shadow-lg border border-white/20 w-11/12 text-center">
                      <p className="text-center tracking-wider text-lg">
                        {weatherAlerts.alerts.alert[0].desc}
                      </p>
                    </div>
                  ) : null}
                </motion.div>
              )}
            </motion.div>

            <motion.div
              ref={SideBarRef}
              initial={{x: "-100%"}}
              animate={{x: isNavOpen ? "0%" : "-100%"}}
              transition={{type: "spring", stiffness: 80, delayChildren: 0.2, staggerChildren: 0.1}}
              className="absolute top-0 left-0 bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg border border-white/20 h-full sm:w-96 w-72 text-center"

            >
              <motion.div
                initial={{x: -30, opacity: 0}} animate={{x: 0, opacity: 1}}
              >
                <Suspense fallback={<Loader />}>
                  <SideBar 
                      locations={locations}
                      forecast={forecast}
                      otherForecast={otherForecast}
                      timeOfDay={timeOfDay}
                      infoModal={infoModal}
                      roundedValues={roundedValues}
                      openManageLocationsModal={openManageLocationsModal}
                      openInfoModal={openInfoModal}
                      closeInfoModal={closeInfoModal}
                      formSubmit={formSubmit}
                  />
                </Suspense>
              </motion.div>
          </motion.div>
          {manageLocsModal && (
            <Suspense fallback={<Loader />}>
              <ManageLocations
                infoModal={infoModal}
                forecast={forecast}
                otherForecast={otherForecast}
                locations={locations}
                favLocation={favLocation.city}
                roundedValues={roundedValues}
                timeOfDay={timeOfDay}
                closeManageLocationsModal={closeManageLocationsModal}
                openInfoModal={openInfoModal}
                closeInfoModal={closeInfoModal}
                toggleFavorite={toggleFavorite}
                handleDelete={handleDelete}
              />
            </Suspense>
            )}
          </>
          )}
      </div>
    </main>
  )
}

export default App