import { Star, Info, MapPinPlusInside } from 'lucide-react'
import Information from './Information'

const SideBar = (props) => {
    const {otherForecast, locations, formSubmit, openManageLocationsModal, favLocation, forecast, timeOfDay, hour, openInfoModal, closeInfoModal, infoModal, roundedTemp } = props

    //Rendering list of elements for the sidebar list
    const cityElements = locations.map(({id}) => {
        const locData = otherForecast?.find(loc => loc.id === id)

        return (<li key={id}
            className=" flex justify-between py-2"
        >
           <p className="text-lg ml-8">{locData?.city}</p>
           <p className="text-lg">{locData?.temp}&deg;</p>
        </li>)
    })

  return (
    <div id="side-menu-container" className="flex flex-col min-h-screen p-4 text-white items-center">
        {/* Adding the city form container */}
        <div className="flex flex-col mt-5 text-left  py-4 border-b-2 border-dotted border-white/50 w-full">
            <form action={formSubmit}
                  className="flex flex-col w-full"
            >
                <label htmlFor="city" className="text-lg">
                    Add a city:
                </label>
                <input id="city" type="text" name="city" placeholder="e.g Tehran" className="p-2 rounded-md mt-1 text-gray-900"/>
            </form>
        </div>
        <div className="py-1 w-full flex flex-col items-center">
            {/* Favorite location container */}
            <div className="flex flex-col border-b-2 border-dotted border-white/50 mt-1 pb-4 w-full">
                <div className="flex justify-between items-center">
                <h2 className="flex items-center gap-1 mb-2 text-lg">
                    <Star size={22}/> Favorite Location
                </h2>
                <button className="cursor-pointer mb-1"
                        onClick={openInfoModal}
                >
                    <Info size={20}/>
                </button> 
                {infoModal && <Information 
                                closeInfoModal={closeInfoModal}/>
                }
                </div>
                {forecast &&
                <div id="favorite-location-container"
                     className="flex justify-between"
                >
                    <p className="text-2xl ml-8">
                        {favLocation}
                    </p>
                    <p className="flex items-center gap-2 text-2xl">
                        <img src={timeOfDay}
                             alt={(hour >= 6 && hour < 19) ? "Sun Icon" : "Moon Icon"} 
                             className="w-6"
                        />
                        {roundedTemp}&deg;
                    </p>
                </div>}
            </div>
            {/* Other locations container */}
            <div className="mt-4 w-full flex flex-col items-center">
                <h2 className="flex items-center self-start gap-1 mb-2 text-lg">
                   <MapPinPlusInside size={22}/>  Other Locations
                </h2>
                <ul id="added-locations" className="flex flex-col self-start list-none py-3 w-full">
                    {cityElements}
                </ul>
                {/* Manage Locations Modal */}
                <button className="bg-white/10 backdrop-blur-md rounded-2xl p-2 w-60 hover:bg-white/20 active:bg-white/30"
                        onClick={openManageLocationsModal}
                >
                    Manage Locations
                </button>
            </div>
        </div>
    </div>
  )
}

export default SideBar