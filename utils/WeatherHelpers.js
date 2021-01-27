const formatterKK = new Intl.DateTimeFormat('en-us', {
  hour: 'numeric',
  hour12: false
});

const getKK = (date) => {
  let dt = new Date(date)
  return formatterKK.format(dt)
}

const findTimeOfDay = (weather, sunRise, sunSet) => {
  let sunrise = getKK(sunRise * 1000)
  let sunset =  getKK(sunSet * 1000)
  if (getKK(weather.dt * 1000) > sunrise
  &&  getKK(weather.dt * 1000) < sunset) {
    return 'day'
  } else {
    return 'night'
  }
}
