import dropIcon from './../assets/drop.png';


const HourlyForcast = ({forecast}) => {
    const hourlyData = forecast?.forecast.forecastday[0].hour
  
    const hourlyElements = hourlyData.map((data, index) => {
      const hour = data.time.substring(11, 16);
      const roundedTemp = Math.floor(data.temp_c)

      return (
        <div key={index}
             className="flex flex-col w-1/6 min-w-[16%] items-center justify-center p-2"
        >
          <h4>{hour}</h4>
          <img src={data.condition.icon} alt="weather condition" />
          <p className="text-center">{roundedTemp}&deg;</p>
          <p className="flex items-center mt-1 mr-2">
            <img src={dropIcon} className="w-3 h-3" alt="drop icon" />{data.humidity}%
          </p>
        </div>
      )
})

    
  return (
    <div id="hourly-forecast"
         className="flex overflow-x-auto gap-1 scrollbar-thin scroll-smooth scrollbar-thumb-white/30 scrollbar-track-transparent scrollbar-thumb-rounded-full snap-x snap-mandatory space-x-4 justify-evenly items-center bg-white/10 backdrop-blur-md rounded-lg p-5 mt-5 shadow-lg border border-white/20 w-11/12 text-center"
         onWheel={(e) => {e.currentTarget.scrollLeft += e.deltaY * 2.5}}
    >
      {hourlyElements}
    </div>
  )
}

export default HourlyForcast