import { lazy, Suspense } from 'react'
import { Info, MapPin, ChevronLeft, Trash2, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { ManageLocationsProps } from '../types.ts'
import Loader from './Loader.tsx'


const ManageLocations: React.FC<ManageLocationsProps>  = (props) => {
    const { closeManageLocationsModal, infoModal, openInfoModal, closeInfoModal, toggleFavorite, handleDelete, forecast, otherForecast, locations, favLocation, roundedValues , timeOfDay } = props

    //Lazy Loading Information component
    const Information = lazy(() => import("../components/Information.tsx"))

      //Rendering "Manage Locations" Modal Elements seperately
      const modalElements = locations.map(({city, id}) => {
        const locData = otherForecast?.find(loc => loc.id === id)
        
        if (!locData) {
            console.error("Location data is not found.")
            return
        }

        return (<div 
                key={id} 
                className="p-5 bg-gray-800 mx-4 mb-2 rounded-2xl flex justify-between items-center group"
            >
            <div className="flex flex-col w-1/3">
                    <p className="flex items-center gap-2 mb-1">
                        <MapPin size={15}/> {locData.city}
                    </p>
                <div className="flex flex-col text-xs text-white/50 text-left text-nowrap">
                    <p className="overflow-hidden text-ellipsis">{locData.city} / {locData.country}</p>
                    <p>{locData.localTime}</p>
                </div>
            </div>
            <div className="flex justify-center gap-1 w-1/3">
                <button className="hidden group-hover:block group-focus-within:block"
                        onClick={() =>toggleFavorite(id)}
                >
                    <Star size={20} className={favLocation === city ? "text-yellow-400" : "text-white"}/>
                </button>
                <button onClick={() => handleDelete(id)}>
                    <Trash2 size={20}/>
                </button>
            </div>
            <div className="flex justify-end gap-3 w-1/3">
                <div className="flex flex-col items-center">
                    <p className="font-bold text-lg">{locData.temp}</p>
                    <p className="text-xs text-white/50 ">
                        {locData.maxTemp}&deg; / {locData.minTemp}&deg;
                    </p>
                </div>
            </div>
        </div>)
    })

  return (
        <div id="modal-overlay"
             className="absolute top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50"
        >
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col absolute top-0 left-0 items-left w-full h-full bg-black z-[100] text-white"
            >
                <div id="modal-header" className="flex items-center text-2xl p-2 gap-5 mt-5">
                    <button onClick={closeManageLocationsModal}>
                        <ChevronLeft size={30}/>
                    </button>
                    <h2>Manage locations</h2>
                </div>
                <div className="flex justify-between px-5 mt-2 mb-1">
                    <h4 className="text-sm font-semibold text-white/50">Favorite location</h4>
                    <button className="cursor-pointer mb-1"
                            onClick={openInfoModal}
                    >
                            <Info size={18}/>
                    </button>
                    {infoModal && (
                        <Suspense fallback={<Loader />} >
                            <Information 
                                closeInfoModal={closeInfoModal}
                            />
                        </Suspense>
                    )}
                </div>
                
                {forecast &&
                <div className="p-5 bg-gray-800 rounded-2xl flex justify-between mx-4 ">
                    <div className="flex flex-col">
                        <p className="flex items-center gap-2 mb-1">
                            <MapPin size={15}/>
                            {forecast.location.name}
                        </p>
                        <div className="flex flex-col text-xs text-white/50 text-left">
                            <p>{forecast.location.name} / {forecast.location.country}</p>
                            <p>{forecast.location.localtime}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div>
                            <img 
                                src={timeOfDay?.dayOrNight} 
                                alt={timeOfDay?.isDay ? "Sun Icon" : "Moon Icon"} 
                                className="w-10"
                            />
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="font-bold text-lg">{roundedValues?.roundedTemp}</p>
                            <p className="text-xs text-white/50">{roundedValues?.roundedMaxTemp}&deg; / {roundedValues?.roundedMinTemp}&deg;</p>
                        </div>
                    </div>
                </div>}
                <h4 className="text-sm font-semibold text-white/50 text-left px-5 mt-2 mb-1">Other locations</h4>
                {modalElements}
            </motion.div>
        </div>
  )
}

export default ManageLocations