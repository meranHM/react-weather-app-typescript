import { useState } from "react"
import { ErrorHandler } from "../types"


const useErrorHandler = (): ErrorHandler => {
    const [error, setError] = useState("")

    const handleFetchError = (error: unknown) => {
        if (error instanceof Error) {
            //Handling Network Errors
            if(error.message === "Network Error") {
                setError("Network error. PLease check your internet connection.")
                return
            }

            //Handling API Limit or Unauthorized Errors
            if (error.message === "403") {
                setError("API limit reached or unauthorized request. Please try again later.")
                return
            }

            //Handling Unexpected Errors
            console.error("Unexpected error:", error)
            setError("Unexpected error occured. PLease try again")
        } else {
            console.error("Unkown error type:", error)
            setError("An unkown error occured.")
        }
    }
    return {error, setError, handleFetchError}
}

export default useErrorHandler
