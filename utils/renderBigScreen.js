const bigWeatherTitle = document.getElementsByTagName('big-weather-title')[0]
const bigWeatherExtras = document.getElementsByTagName('big-weather-extras')[0]
const bigWeatherDaily = document.getElementsByTagName('big-weather-daily')[0]
const bigWeatherWeekly = document.getElementsByTagName('big-weather-weekly')[0]
const bigWeatherInDepth = document.getElementsByTagName('big-weather-indepth')[0]
const bigWeatherRaining = document.getElementsByTagName('big-weather-raining')[0]

const createBigTitle = (weather, tod, city, img) => {
  let dateTimeString = formatter.formatToParts(weather.current.dt).map(({type, value}) => {
    switch (type) {
      case 'weekday': return `${value} | `
      case 'month': return `${value} `
      case 'hour': return `${value}:`
      case 'minute': return `${value} `
      case 'day': return `${value} | `
      case 'literal': return ''
      default : return value
    }
  }).join('');

  return `
    <div id="searchBig" class="flex flex-col p-4 mb-4 rounded-3xl text-blue-600 absolute z-10 mt-12" style="width: 400px;">
      <div class="grid grid-cols-8 self-start">
        <span onclick="searchBig()" class="place-self-center text-md justify-self-start mx-4"><i class="fas fa-search"></i></span>
        <input placeholder="Search for cities..." class="searchInputBig place-self-center appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none justify-self-stretch col-span-6" id="searchInputBig" type="text" placeholder="">
        <div onclick="showHistoryBig()" class="place-self-center col-span-1 h-10 w-10 rounded-full justify-self-start flex justify-center items-center hover:bg-blue-100">
          <span class="text-md"><i class="fas fa-th-list"></i></span>
        </div>
      </div>
      <big-weather-history class="overflow-scroll"></big-weather-history>
  </div>
  <div class="flex flex-col justify-between p-4 items-center h-full">
    <div class="flex flex-col items-center w-full" style="margin-top: 300px;">
      <span class="color-500 text-6xl text-extrabold place-self-start" style="font-size: 100px;">${weathermath.convertTemp('k', 'f', weather.current.temp)}°</span>
      <p class="color-500 text-lg place-self-start p-4 border-b-2 border-gray-300 w-full"><strong class="color-600">${dateTimeString}</strong></p>
      <div class="place-self-start p-4">
        ${weather.current.weather.map(i => {
          return `  <p class="color-500 text-lg">It's <strong class="color-600">${i.description} ${i.icon ? `<img class="inline-block align-middle h-10 w-10" src="/icons/${findWeatherIcon(i, tod)}.png" />` : ''}</strong></p>`
        }).join('')}
      </div>
    </div>
    <div class="flex items-center justify-center h-40 w-full rounded-3xl m-4" style="background: url('${img}'); background-size: cover; background-repeat: no-repeat;">
      <span class="text-white text-4xl text-bold">${city[0].toUpperCase() + city.substring(1)}</span>
    </div>
  </div>
  `
}

const loopBigHours = (weather, tod) => {
  weather.hourly.forEach((element, i) => {
  if (i === 0) {

    } else {
      let tod = findTimeOfDay(element, weather.current.sunrise, weather.current.sunset)
      let card = document.createElement('DIV')
      card.classList = `mx-4 px-4`
      card.style = 'flex: 0 0 auto;'
      card.innerHTML =
      `
        <div class="bg-gray-300 rounded-xl text-right p-2 shadow-lg extra flex flex-col items-center text-center px-4">
          <span class="text-lg text-gray-700 font-semibold">${getTime(element.dt * 1000)}</span>
          <span class="text-lg text-gray-700"><img class="justify-self-center h-12 w-12" src="/icons/${findWeatherIcon(element.weather[0], tod)}.png" /></span>
          <span class="text-lg text-gray-700 font-semibold">${weathermath.convertTemp('k', 'f', element.temp)}°</span>
        </div>
      `
      bigWeatherWeekly.append(card)
    }
  })
}

const loopBigDays = (weather, tod) => {
  weather.daily.forEach((element, i) => {
  if (i === 0) {

    } else {
      let tod = findTimeOfDay(element, weather.current.sunrise, weather.current.sunset)
      let card = document.createElement('DIV')
      card.classList = `mx-4 px-4`
      card.style = 'flex: 0 0 auto;'
      card.innerHTML =
      `
        <div class="bg-gray-300 rounded-xl w-32 text-right p-2 shadow-lg extra flex flex-col items-center text-center px-8">
          <span class="text-lg text-gray-600 font-semibold">${getDayOfWeek(element.dt * 1000)}</span>
          <span class="text-lg text-gray-600"><img class="justify-self-center h-12 w-12" src="/icons/${findWeatherIcon(element.weather[0], tod)}.png" /></span>
          <div class="flex justify-between flex-1 self-stretch">
            <span class="text-lg text-gray-700 font-semibold">${weathermath.convertTemp('k', 'f', element.temp.max)}</span>
            <span class="text-lg text-gray-400 font-semibold">${weathermath.convertTemp('k', 'f', element.temp.min)}</span>
          </div>
        </div>
      `
      bigWeatherWeekly.append(card)
    }
  })
}

const displayBigWeatherTime = (weather, tod, type) => {
  bigWeatherWeekly.innerHTML = ''
  if (type == 'hourly') {
    loopBigHours(weather, tod)
  } else {
    loopBigDays(weather, tod)
  }
}

const loopBigWeatherExtras = (weather, tod, city) => {
  bigWeatherExtras.innerHTML = ''
  let extras = weather.hourly[0]
  extras.moon_phase =
  weathermath.moon(getYear(weather.current.dt * 1000), getMonth(weather.current.dt * 1000), getDay(this.weather.current.dt * 1000)).name
  let i = 0
  for (const [key, value] of Object.entries(weather.hourly[0])) {
    let extra = weather.hourly[0]
    if (['dt', 'temp', 'wind_speed', 'weather', 'pop', 'rain'].includes(key)) continue
    let card = document.createElement('DIV')
    card.classList = 'flex flex-col text-center mx-4 extra-card'
    card.style.flex = '0 0 auto;'
    card.innerHTML =
    `
      <div class="bg-gray-300 rounded-xl w-32 text-right p-2 shadow-lg extra">
        <div class="flex justify-between">
          <span class="text-xs text-gray-600">
            ${key === 'moon_phase' ? `<img class="justify-self-center h-6 w-6" src="icons/${extra.moon_phase}.png" />` : `<img class="justify-self-center h-6 w-6" src="icons/${key}.png" />`}
          </span>
          <div class="flex flex-col">
            ${key === 'wind_deg' || key === 'wind_speed' ? `<span class="text-xs text-gray-600">wind</span>` : ''}
            ${key === 'uvi' || key === 'pressure'|| key === 'visibility' || key === 'humidity' ? `<span class="text-xs text-gray-600">${key}</span>` : ''}
            ${key === 'clouds' ? `<span class="text-xs text-gray-600">cloudiness</span>` : ''}
            ${key === 'feels_like' ? `<span class="text-xs text-gray-600">feels like</span>` : ''}
            ${key === 'dew_point' ? `<span class="text-xs text-gray-600">dew point</span>` : ''}
            ${key === 'wind_deg' || key === 'wind_speed' ? `<span class="text-xs text-gray-700 font-semibold">${weathermath.windDirection(extra.wind_deg).direction} ${extra.wind_speed} mph</span>` : ''}
            ${key === 'pressure' ? `<span class="text-xs text-gray-700 font-semibold">${weathermath.pressure(extra.pressure).toFixed(2)} inHg</span>` : ''}
            ${key === 'visibility' ? `<span class="text-xs text-gray-700 font-semibold">${weathermath.metersToMile(extra.visibility).toFixed(2)} mi</span>` : ''}
            ${key === 'uvi' ? `<span class="text-xs text-gray-700 font-semibold">${extra.uvi} is ${weathermath.uviChart(extra.uvi).intensity} <i class="fas fa-circle ${weathermath.uviChart(extra.uvi).color}"></i></span>` : ''}
            ${key === 'humidity' ? `<span class="text-xs text-gray-700 font-semibold">${extra.humidity}% is ${weathermath.humidityChart(extra.humidity).string} ${weathermath.humidityChart(extra.humidity).emoji}</span>` : ''}
            ${key === 'clouds' ? `<span class="text-xs text-gray-700 font-semibold">${extra.clouds}%</span>` : ''}
            ${key === 'feels_like' ||  key === 'dew_point'? `<span class="text-xs text-gray-700 font-semibold">${weathermath.convertTemp('k', 'f', value)}°</span>` : ''}
            ${key === 'moon_phase' ? `<span class="text-xs text-gray-700 font-semibold">${extra.moon_phase}</span>` : ''}
          </div>
        </div>
      </div>
    `
    bigWeatherExtras.prepend(card)
    i++
  }
}

const renderBigScreen = (weather, tod, city, img) => {
  bigWeatherTitle.innerHTML = createBigTitle(weather, tod, city, img)
  displayBigWeatherTime(weather, tod, 'hourly')
  loopBigWeatherExtras(weather, tod, city)
}
