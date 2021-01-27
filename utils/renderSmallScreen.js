const weatherTitle = document.getElementsByTagName('weather-title')[0]
const weatherExtras = document.getElementsByTagName('weather-extras')[0]
const weatherHourly = document.getElementsByTagName('weather-hourly')[0]
const weatherDaily = document.getElementsByTagName('weather-daily')[0]
const weatherInDepth = document.getElementsByTagName('weather-indepth')[0]
const weatherRaining = document.getElementsByTagName('weather-raining')[0]

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const formatterYYYY = new Intl.DateTimeFormat('en-us', {
  year: 'numeric'
});

const formatterMM = new Intl.DateTimeFormat('en-us', {
  month: 'numeric'
});

const formatterDD = new Intl.DateTimeFormat('en-us', {
  day: 'numeric'
});

const formatterDDDD = new Intl.DateTimeFormat('en-us', {
  weekday: 'long'
});

const formatterTime = new Intl.DateTimeFormat('en-us', {
  hour: 'numeric',
  minute: 'numeric'
});

const getYear = (date) => {
  let dt = new Date(date)
  return formatterYYYY.format(dt)
}

const getMonth = (date) => {
  let dt = new Date(date)
  return formatterMM.format(dt)
}

const getDay = (date) => {
  let dt = new Date(date)
  return formatterDD.format(dt)
}

const getDayOfWeek = (date) => {
  let dt = new Date(date)
  return formatterDDDD.format(dt)
}

const getTime = (date) => {
  let dt = new Date(date)
  return formatterTime.format(dt)
}

const createTitle = (weather, tod, city) => {
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
    <div class="place-self-center text-center flex flex-col pt-4 w-screen">
    <span class="color-600 text-2xl py-2 font-extrabold tracking-widest uppercase">${city}</span>
    <span class="color-600 text-md py-2 font-semibold tracking-widest uppercase">${dateTimeString}</span>
    <p class="color-500 text-lg">It's <strong class="color-600">${weather.current.weather[0].description}
      <img class="inline-block align-middle h-10 w-10" src="icons/${findWeatherIcon(weather.current.weather[0], tod)}.png" /></strong></p>
    <div class="flex justify-between items-center px-8">
      <span class="color-500 text-xl text-semibold">${weathermath.convertTemp('k', 'f', weather.daily[0].temp.eve)}</span>
      <span class="color-500 text-3xl text-semibold">${weathermath.convertTemp('k', 'f', weather.daily[0].temp.max)}</span>
      <span class="color-500 text-6xl text-extrabold justify-self-center">${weathermath.convertTemp('k', 'f', weather.current.temp)}°</span>
      <span class="color-500 text-3xl text-semibold">${weathermath.convertTemp('k', 'f', weather.daily[0].temp.min)}</span>
      <span class="color-500 text-xl text-semibold">${weathermath.convertTemp('k', 'f', weather.daily[0].temp.morn)}</span>
    </div>
    </div>
  `
}

const createInDepth = (weather) => {
  return `<p class="border-t-2 border-b-2 border-600 color-600 font-semibold p-4">${weathermath.createWeatherString(weather)}</p>`
}

const loopExtras = async (weather) => {
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
    let loaders = weatherExtras.querySelectorAll('.loading-box')
    let loader = loaders[i]
    if (loader) {
      loader.parentNode.replaceChild(card, loader)
    }
    weatherExtras.prepend(card)
    i++
  }
  let loaders = weatherExtras.querySelectorAll('.loading-box')
  loaders.forEach((l) => l.remove())
}

const loopHours = (weather) => {
  weather.hourly.forEach((element, i) => {
  if (i === 0) {

    } else {
      let tod = findTimeOfDay(element, weather.current.sunrise, weather.current.sunset)
      let card = document.createElement('DIV')
      card.classList = `flex flex-col text-center color-600 font-semibold items-center mx-2 p-4 w-24 hour-card`
      card.innerHTML =
      `
      <span class="text-md w-24">${i === 0 ? 'NOW' : getTime(element.dt * 1000)}</span>
      ${element.weather[0].icon ? `<img class="inline-block align-middle h-10 w-10" src="icons/${findWeatherIcon(weather.current.weather[0], tod)}.png" />` : ''}
      </span>
      <span class="text-md w-24">${weathermath.convertTemp('k', 'f', element.temp)}° ${element.pop > .1 ? `/ <span class="color-500">${(element.pop * 100).toFixed(0)}%</span>` : ''}</span>
      `
      let loaders = weatherHourly.querySelectorAll('.loading-box')
      loaders.forEach((l) => l.remove())
      let loader = loaders[i]
      if (loader) {
        loader.classList.add('hidden')
      }
      weatherHourly.append(card)
    }
  })
  let loaders = weatherHourly.querySelectorAll('.loading-box')
  loaders.forEach((l) => l.classList.add('hidden'))
}

const loopDays = (weather) => {
  weather.daily.forEach(async (element, i) => {
    if (i === 0) {

    } else {
      let tod = findTimeOfDay(element, weather.current.sunrise, weather.current.sunset)
      let card = document.createElement('DIV')
      card.classList = `flex justify-between color-500 font-semibold items-center w-full day-card`
      card.innerHTML =
        `
        <span class="text-md text-center uppercase tracking-wider">
          ${getDayOfWeek(element.dt * 1000)}
        </span>
        <span class="text-md flex-grow flex items-center justify-center">
        ${element.weather[0].icon ? `<img class="justify-self-center h-10 w-10" src="icons/${findWeatherIcon(weather.current.weather[0], tod)}.png" />` : ''} ${element.pop > .1 ? `<span>${(element.pop * 100).toFixed(0)}%</span>` : ''}</span>
        <p class="text-mdtext-center"><span class="font-bold color-600">${weathermath.convertTemp('k', 'f', element.temp.max)}°</span>&nbsp&nbsp&nbsp${weathermath.convertTemp('k', 'f', element.temp.min)}°</p>
      `
      let loaders = weatherDaily.querySelectorAll('.loading-box')
      loaders.forEach((l) => l.remove())
      let loader = loaders[i]
      if (loader) {
        loader.classList.add('hidden')
      }
      weatherDaily.append(card)
    }
  })
  let loaders = weatherDaily.querySelectorAll('.loading-box')
  loaders.forEach((l) => l.classList.add('hidden'))
}

const renderSmallScreen = (weather, tod, city) => {
  weatherTitle.innerHTML = createTitle(weather, tod, city)
  weatherInDepth.innerHTML = createInDepth(weather)
  weatherExtras.querySelectorAll('.extra-card').forEach((c) => c.remove())
  weatherExtras.querySelectorAll('.loading-box').forEach((lb) => lb.classList.remove('hidden'))
  loopExtras(weather)
  weatherHourly.querySelectorAll('.hour-card').forEach((c) => c.remove())
  weatherHourly.querySelectorAll('.loading-box').forEach((lb) => lb.classList.remove('hidden'))
  loopHours(weather)
  weatherDaily.querySelectorAll('.day-card').forEach((c) => c.remove())
  weatherDaily.querySelectorAll('.loading-box').forEach((lb) => lb.classList.remove('hidden'))
  loopDays(weather)
  console.log(weather.minutely)
  if (weather.current.rain && weather.minutely) {
    weatherRaining.innerHTML =
    `
    <span class="text-sm color-500 font-semibold text-right px-4 w-full z-50" style="flex: 0 0 auto; ">Next Hour Precipitation</span>
    <div class="rain-graph h-24 rain-graph pb-4 flex items-end">
    <div class="flex items-end overflow-hidden">
      ${weather.minutely.map(function(min, i) {
        if (i === 0 || i % 2 === 0) {
          return `
          <div class="flex flex-col">
            <span class="text-xs color-500">${min.precipitation.toFixed(0)}</span>
            <span class="w-2 rounded-sm bg-500" style="margin-right: 2px; margin-left: 2px; height: ${min.precipitation * 20}px"></span>
          </div>
          `;
        }
      }).join('')}
    </div>
    </div>
    `
  } else {
    weatherRaining.innerHTML = ''
  }
}
