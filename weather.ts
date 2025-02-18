import axios from "axios";
import { Forecast, WeatherAlrerts } from "./src/types";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const BASE_URL = import.meta.env.VITE_WEATHER_API_URL

const today: string = new Date().toISOString().split("T")[0]



export const getForecast = async (city: string): Promise<Forecast | null> => {
    try {
        const response = await axios.get<Forecast>(`${BASE_URL}/forecast.json`, {
            params: {
                key: API_KEY,
                q: city,
                aqi: "yes",
                days: 7,
                dt: today
            }
        })
        return response.data
    } catch (error) {
        console.error("Error fetching weather alerts:", error)
        return null
    }
}

export const getWeatherAlerts = async (city: string): Promise<WeatherAlrerts | null> => {
    try {
        const response = await axios.get(`${BASE_URL}/alerts.json`, {
            params: {
                key: API_KEY,
                q: city,
                alerts: "yes"
            },
        })
        return response.data
    } catch (error) {
        console.error("Error fetching weather alerts:", error)
        return null
    }
}

// Helper function to validate the city by calling the weather API
export async function validateCity(cityName: string): Promise<boolean> {
    try {
      const forecastData = await getForecast(cityName)
      return forecastData !==null
    } catch {
      return false
    }
  }

