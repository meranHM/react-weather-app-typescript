import { motion } from "framer-motion"
import { ChevronLeft} from 'lucide-react'

const Information = ({closeInfoModal}) => {
  return (
    <div id="modal-overlay"
         className="absolute top-0 left-0 w-screen h-screen bg-black/50 flex justify-center items-center z-50"
    >
      <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }} 
          className="flex flex-col absolute top-0 left-0 w-screen h-screen bg-black z-50"
      >
        <div id="modal-header" className="flex items-center text-2xl p-2 gap-5 mt-5">
            <button onClick={closeInfoModal}>
                <ChevronLeft size={30}/>
            </button>
            <h2>Favorite Location</h2>
        </div>
        <div className="p-5">
          <p className="text-left">
              Your favorite location will be used to provide weather information in the main page.<br/> You can change your favorite location in "Manage Locations" section.
            </p>
        </div>
      </motion.div> 
    </div>
  )
}

export default Information