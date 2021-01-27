const windChart = [
  {
      "direction": "N",
      "degree": "348.75"
  },
  {
      "direction": "NNE",
      "degree": "11.25"
  },
  {
      "direction": "NE",
      "degree": "33.75"
  },
  {
      "direction": "ENE",
      "degree": "56.25"
  },
  {
      "direction": "E",
      "degree": "78.75"
  },
  {
      "direction": "ESE",
      "degree": "101.25"
  },
  {
      "direction": "SE",
      "degree": "123.75"
  },
  {
      "direction": "SSE",
      "degree": "146.25"
  },
  {
      "direction": "S",
      "degree": "168.75"
  },
  {
      "direction": "SSW",
      "degree": "191.25"
  },
  {
      "direction": "SW",
      "degree": "213.75"
  },
  {
      "direction": "WSW",
      "degree": "236.25"
  },
  {
      "direction": "W",
      "degree": "258.75"
  },
  {
      "direction": "WNW",
      "degree": "281.25"
  },
  {
      "direction": "NW",
      "degree": "303.75"
  },
  {
      "direction": "NNW",
      "degree": "326.25"
  }
]
const moonPhases = ['new-moon', 'waxing-crescent-moon', 'quarter-moon', 'waxing-gibbous-moon', 'full-moon', 'waning-gibbous-moon', 'last-quarter-moon', 'waning-crescent-moon']
const weathermath = {
  convertTemp: (input, output, value) => {
    if (input.toLowerCase() === 'k' || input.toLowerCase() === 'kelvin') {
      if (output.toLowerCase() === 'f' || output.toLowerCase() === 'fahrenheit') {
        return Math.floor((value - 273.15) * 9/5 + 32)
      }
    }
  },

  averageDailyPop: (array) => {
    let pops = array.map(a => a.pop)
    return (pops.reduce((a, b) => a + b, 0) / pops.length).toFixed(2) * 100
  },

  createWeatherString: (weather) => {
    return `Today is ${weather.current.weather[0].description} with a high of ${weathermath.convertTemp('k', 'f', weather.daily[0].temp.max)}° and a low of ${weathermath.convertTemp('k', 'f', weather.daily[0].temp.min)}°. There is a ${weathermath.averageDailyPop(weather.hourly).toFixed(0)}% chance of rain.`;
  },

  windDirection: (deg) => {
    let degrees = windChart.map(function (el) { return el.degree; });

    degrees.sort((a, b) => {
      return Math.abs(deg - a) - Math.abs(deg - b);
    });

    for (var i=0; i < windChart.length; i++) {
      if (windChart[i].degree === degrees[0]) {
          return windChart[i];
      }
    }
  },

  pressure: (value) => {
    return (value * 100) / 3386;
  },

  metersToMile: (meters) => {
    if (meters === 10000) {
      return 10;
    }
    return meters / 1609;
  },

  uviChart: (uvi) => {
    let intensity = '';
    let color ='';

    if (uvi < 2) {
      intensity = 'low';
      color = 'green-500';
    } else if (uvi < 5 && uvi > 2) {
      intensity = 'moderate';
      color = 'blue-500';
    } else if (uvi < 7 && uvi > 5) {
      intensity = 'high';
      color = 'yellow-500';
    } else if (uvi < 10 && uvi > 7) {
      intensity = 'very high';
      color = 'orange-500';
    } else {
      intensity = 'extreme';
      color = 'red-500';
    }

    return {intensity: intensity, color: color};
  },

  humidityChart: (value) => {
    if (value > 70) {
      return {string: 'high', emoji: '🥵'};
    } else if (value < 30) {
      return {string: 'dry', emoji: '🌵'};
    } else {
      return {string: 'normal', emoji: '🤙'}
    }
  },

  moon: (year, month, day) => {
    let c = e = jd = b = 0;

    if (month < 3) {
      year--;
      month += 12;
    }

    ++month;
    c = 365.25 * year;
    e = 30.6 * month;
    jd = c + e + day - 694039.09; // jd is total days elapsed
    jd /= 29.5305882; // divide by the moon cycle
    b = parseInt(jd); // int(jd) -> b, take integer part of jd
    jd -= b; // subtract integer part to leave fractional part of original jd
    b = Math.round(jd * 8); // scale fraction from 0-8 and round

    if (b >= 8) b = 0; // 0 and 8 are the same so turn 8 into 0
    console.log(b)
    return {phase: b, name: moonPhases[b]};
  }
}
