const appId = '4253ae682bded8fe54667e18d996e279'
const unsplashKey = '7MZwsnhmpaHSUgesJtEf4SVPh8nLbxAgdh1pIh03g3Q'
const MyOpenWeather = new OpenWeather(appId)
const application = document.querySelector('#application')
const smallWrapper = document.querySelector('#small-wrapper')
const bigWrapper = document.querySelector('#big-wrapper')
const loader = document.querySelector('#loader')
const myWorker = new Worker('./utils/worker.js')
var searchShowing = false
var BigSearchShowing = false
var screenSize = ''
var city = ''
var tod = ''
let img = ''
let bigDisplayType = 'hourly'
var weather = {}

const ready = (callback) => {
  if (document.readyState != "loading") callback()
  else document.addEventListener("DOMContentLoaded", callback)
}

const init = async () => {
  showLoading()
  screenSize = determineScreenSize()
  if (screenSize == 'small') {
    showSmallScreen()
    let offset = (window.innerWidth - 550) / 8
    let el = document.querySelector('.content')
    el.style.paddingTop = 75 - offset + '%'
  }
  else showBigScreen()
  if (getCitiesArray().length > 0) city = queryFavoriteCity().name
  else city = 'Long Beach'
  img = await getImage(city)
  img = img.results[Math.floor(Math.random() * Math.floor(img.results.length))].urls.full
  await getWeather()
}

/*
* Get the image for a certain city
*/
const getImage = (city) => {
  let params = {
    client_id: unsplashKey
  }
  return axios.get('https://api.unsplash.com/search/photos?page=1&query=' + city + '&orientation=landscape&client_id=', {
    params
  }).then((response) => {
    return response.data
  }).catch((err) => {
    return err
  })
}

/*
* Toggle the loading screen
*/
const showLoading = () => {
  if (loader.classList.contains('hidden')) {
    loader.classList.remove('hidden')
  }
  return true
}

const hideLoading = () => {
  if (!loader.classList.contains('hidden')) {
    loader.classList.add('hidden')
  }
  return true
}

/*
* Show the template for the porper screensize
*/
const showSmallScreen = () => {
  if (!bigWrapper.classList.contains('hidden')) {
    bigWrapper.classList.add('hidden')
  }
  if (smallWrapper.classList.contains('hidden')) {
    smallWrapper.classList.remove('hidden')
  }

  return true
}

const showBigScreen = () => {
  if (bigWrapper.classList.contains('hidden')) {
    bigWrapper.classList.remove('hidden')
  }
  if (!smallWrapper.classList.contains('hidden')) {
    smallWrapper.classList.add('hidden')
  }

  return true
}

/*
* Get the weather of the current location, time of day, and screensize
*/
const getWeather = async () => {
  try {
    await MyOpenWeather.location(city).current()
    if (MyOpenWeather.weather == undefined) {
      console.log('Couldn\'t find that city')
      return
    }
    MyOpenWeather.country = MyOpenWeather.weather.sys.country
    MyOpenWeather.location({
      lon: MyOpenWeather.weather.coord.lon,
      lat: MyOpenWeather.weather.coord.lat
    })
    myWorker.postMessage([
      MyOpenWeather.weather.lat,
      MyOpenWeather.weather.lon,
      MyOpenWeather.weather.sys.country
    ]);
  } catch (err) {
    console.log(err)
    return false
  }
  await MyOpenWeather.oneCall()
  weather = MyOpenWeather.weather
  tod = findTimeOfDay(weather.current, weather.current.sunrise, weather.current.sunset)
  hideLoading()
  screenSize == 'big' ? renderBigScreen(weather, tod, city, img) : renderSmallScreen(weather, tod, city)
  determineMood(tod)

  return true
}

myWorker.onmessage = function(e) {
  let data = e.data
  if (e.data.aqi) {
    document.getElementsByTagName('weather-extras')[0].innerHTML +=
    `
    <div class="flex flex-col text-center mx-4">
      <div class="bg-gray-300 rounded-xl w-32 text-right p-2 shadow-lg extra">
        <div class="flex justify-between">
          <span class="text-xs text-gray-600">
            <img class="justify-self-center h-6 w-6" src="./icons/dust.png" />
          </span>
          <div class="flex flex-col">
            <span class="text-xs text-gray-600">Air Quality</span>
            <span class="text-xs text-gray-700 font-semibold">${data.aqi.value.toFixed(2)} is ${data.aqi.string} &nbsp; ${data.aqi.emoji}</span>
          </div>
        </div>
      </div>
    </div>
    `
  }
}

const searchBig = async (newCity = null) => {
  if ((document.querySelector('#searchInputBig').value === ''
    && !newCity)
    || (document.querySelector('#searchInputBig').value === ' '
    && !newCity)
  ) {
    showHistory()
    return
  } else {
    let str = document.querySelector('#searchInputBig').value ?
      document.querySelector('#searchInputBig').value : newCity
    let tempCity = city
    city = str
    let update = await getWeather()
    if (!update) {
      if (searchShowing) {
        showHistory()
      }
      document.querySelector('#searchInputBig').value = ''
      return
    }
    if (!queryFavoriteCity()) {
      createCityObject(createCityId(), str, true);
    } else {
      createCityObject(createCityId(), str);
    }
    if (searchShowing) {
      showHistory()
    }
    document.querySelector('#searchInputBig').value = ''
  }
}

const search = async (newCity = null) => {
  if ((document.querySelector('#searchInput').value === ''
    && !newCity)
    || (document.querySelector('#searchInput').value === ' '
    && !newCity)
  ) {
    showSearchBar()
    return
  } else {
    let str = document.querySelector('#searchInput').value ?
      document.querySelector('#searchInput').value : newCity
    let tempCity = city
    city = str
    let update = await getWeather()
    if (!update) {
      if (searchShowing) {
        showSearchBar()
      }
      document.querySelector('#searchInput').value = ''
      return
    }
    if (!queryFavoriteCity()) {
      createCityObject(createCityId(), str, true);
    } else {
      createCityObject(createCityId(), str);
    }
    if (searchShowing) {
      showSearchBar()
    }
    document.querySelector('#searchInput').value = ''
  }
}

const showSearchBar = () => {
  if (searchShowing) {
    document.querySelector('#nav-bar').classList.remove('h-screen', 'bg-opacity-20', 'pt-20');
    document.querySelector('#nav-bar').classList.remove('h-screen', 'bg-opacity-20', 'pt-20');
  } else {
    document.querySelector('#nav-bar').classList.add('h-screen', 'bg-opacity-20', 'pt-20');
    document.querySelector('#nav-bar').classList.add('h-screen', 'bg-opacity-20', 'pt-20');
  }
  searchShowing = !searchShowing;
}

const showHistory = () => {
  let historyItems = getCitiesArray()
  document.getElementsByTagName('weather-history')[0].innerHTML = ''
  if (searchShowing) {
    document.querySelector('#nav-bar').classList.remove('h-screen', 'bg-opacity-20', 'pt-20');
    document.querySelector('#nav-bar').classList.remove('h-screen', 'bg-opacity-20', 'pt-20');
    let items = document.querySelectorAll('.history')
    items.forEach(i => i.remove())
  } else {
    document.querySelector('#nav-bar').classList.add('h-screen', 'bg-opacity-20', 'pt-20');
    document.querySelector('#nav-bar').classList.add('h-screen', 'bg-opacity-20', 'pt-20');
    historyItems.forEach(async (i, index) => {
      try {
        let itemWeather = new OpenWeather(appId)
        itemWeather.location(i.name)
        let $weather = await itemWeather.current()
        $weather = $weather.weather
        console.log($weather)
        let div = document.createElement('DIV');
        div.classList = 'flex justify-between';
        div.innerHTML =
        `
        <div class="history h-16 flex items-center justify-between w-screen my-2 px-2 border-b border-500">
          <div class="mr-4">
            <div class="star ${i.favorite ? 'favorite' : 'not'} h-6 w-6 rounded-full hover:bg-gray-300 flex justify-center items-center" onclick="changeFavorite('${i.id}', event)">
              <span style="color: ${i.favorite ? '#3182ce' : '#e2e8f0'};"><i class="fas fa-star"></i></span>
            </div>
          </div>
          <div onclick="search('${i.name}')" class="flex justify-between flex-grow">
            <div class="flex justify-between flex-grow items-center">
              <span class="text-lg font-semibold color-500">&nbsp${i.name}&nbsp</span>
              ${$weather.weather[0].icon ? `<img class="h-10 w-10" src="icons/${findWeatherIcon($weather.weather[0], tod)}.png" />` : ''}
              ${$weather.pop ? `<span class="text font-semibold color-500"> &nbsp${$weather.pop}</span>` : ''}
            </div>
            <div class="">
              <span class="text-2xl font-semibold color-500">${weathermath.convertTemp('k', 'f', $weather.main.temp)}°</span>
            </div>
          </div>
          <div class="ml-4 flex items-center justify-center" onclick="deleteCity('${i.id}')">
            <div class="h-6 w-6 rounded-full text-gray-500 bg-gray-300 flex justify-center items-center" onclick="deleteThisCity('${i.id}', event)">
              <i class="fas fa-trash"></i>
            </div>
          </div>
        </div>
        `
        let loaders = document.getElementsByTagName('weather-history')[0].querySelectorAll('.loading-box')
        let loader = loaders[i]
        if (loader) {
          loader.remove()
        }
        document.getElementsByTagName('weather-history')[0].append(div);
      } catch (err) {
        console.log(err)
      }
    })
  }
  searchShowing = !searchShowing;
  let loaders = document.getElementsByTagName('weather-history')[0].querySelectorAll('.history-loader')
  loaders.forEach((l) => l.remove())
}

window.changeFavorite = (id, event) => {
  let favorite = document.querySelector('.favorite');
  favorite.classList.remove('favorite');
  favorite.innerHTML = '<span style="color:#e2e8f0;"><i class="fas fa-star"></i></span>';
  let star = event.currentTarget;
  console.log(event.currentTarget);
  star.classList.add('favorite');
  star.innerHTML = '<span style="color: #3182ce;"><i class="fas fa-star"></i></span>';
  updateFavoriteCity(id);
}

window.deleteThisCity = function (id, event) {
  let target = event.currentTarget;
  let parent = target.parentElement;
  let grandparent = parent.parentElement;
  grandparent.remove();
  deleteCity(id)
}

document.querySelector('#searchInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    search()
  }
})

const changeScreenSize = () => {
  let currentScreenSize = determineScreenSize();
  if (screenSize == currentScreenSize) return
  console.log('changing')
  document.querySelector('#loader').classList.remove('hidden')
  if (currentScreenSize == 'small') {
    document.querySelector('#small-wrapper').classList.remove('hidden')
    document.querySelector('#big-wrapper').classList.add('hidden')
  }
  else if (currentScreenSize == 'big') {
    document.querySelector('#small-wrapper').classList.add('hidden')
    document.querySelector('#big-wrapper').classList.remove('hidden')
  }
  currentScreenSize == 'big' ? renderBigScreen(weather, tod, city, img) : renderSmallScreen(weather, tod, city)
  document.querySelector('#loader').classList.add('hidden')
  screenSize = currentScreenSize
}

const changeDisplay = () => {
  if (bigDisplayType == 'hourly') {
    bigDisplayType = 'daily'
    displayBigWeatherTime(weather, tod, 'daily')
    document.querySelector('#today').classList.remove('text-gray-800', 'border-b-2', 'border-gray-800')
    document.querySelector('#week').classList.add('text-gray-800', 'border-b-2', 'border-gray-800')
  } else {
    bigDisplayType = 'hourly'
    displayBigWeatherTime(weather, tod, 'hourly')
    document.querySelector('#week').classList.remove('text-gray-800', 'border-b-2', 'border-gray-800')
    document.querySelector('#today').classList.add('text-gray-800', 'border-b-2', 'border-gray-800')
  }
}

const showHistoryBig = () => {
  let historyItems = getCitiesArray()
  document.getElementsByTagName('weather-history')[0].innerHTML = ''
  if (BigSearchShowing) {
    document.querySelector('#searchBig').classList.remove('h-screen', 'bg-opacity-20');
    document.querySelector('#searchBig').classList.remove('h-screen', 'bg-opacity-20');
    let items = document.querySelectorAll('.history')
    items.forEach(i => i.remove())
  } else {
    document.querySelector('#searchBig').classList.add('h-screen', 'bg-opacity-20');
    document.querySelector('#searchBig').classList.add('h-screen', 'bg-opacity-20');
    historyItems.forEach(async (i, index) => {
      try {
        let itemWeather = new OpenWeather(appId)
        itemWeather.location(i.name)
        let $weather = await itemWeather.current()
        $weather = $weather.weather
        console.log($weather)
        let div = document.createElement('DIV');
        div.classList = 'flex justify-between';
        div.innerHTML =
        `
        <div class="history h-16 flex items-center justify-between w-screen my-2 px-2 border-b border-500">
          <div class="mr-4">
            <div class="star ${i.favorite ? 'favorite' : 'not'} h-6 w-6 rounded-full hover:bg-gray-300 flex justify-center items-center" onclick="changeFavorite('${i.id}', event)">
              <span style="color: ${i.favorite ? '#3182ce' : '#e2e8f0'};"><i class="fas fa-star"></i></span>
            </div>
          </div>
          <div onclick="search('${i.name}')" class="flex justify-between flex-grow">
            <div class="flex justify-between flex-grow items-center">
              <span class="text-lg font-semibold color-500">&nbsp${i.name}&nbsp</span>
              ${$weather.weather[0].icon ? `<img class="h-10 w-10" src="icons/${findWeatherIcon($weather.weather[0], tod)}.png" />` : ''}
              ${$weather.pop ? `<span class="text font-semibold color-500"> &nbsp${$weather.pop}</span>` : ''}
            </div>
            <div class="">
              <span class="text-2xl font-semibold color-500">${weathermath.convertTemp('k', 'f', $weather.main.temp)}°</span>
            </div>
          </div>
          <div class="ml-4 flex items-center justify-center" onclick="deleteCity('${i.id}')">
            <div class="h-6 w-6 rounded-full text-gray-500 bg-gray-300 flex justify-center items-center" onclick="deleteThisCity('${i.id}', event)">
              <i class="fas fa-trash"></i>
            </div>
          </div>
        </div>
        `
        let loaders = document.getElementsByTagName('big-weather-history')[0].querySelectorAll('.loading-box')
        let loader = loaders[i]
        if (loader) {
          loader.remove()
        }
        document.getElementsByTagName('big-weather-history')[0].append(div);
      } catch (err) {
        console.log(err)
      }
    })
  }
  BigSearchShowing = !BigSearchShowing
}

window.addEventListener('resize', () => {
  changeScreenSize()
});

ready(() => {
  init()
})
