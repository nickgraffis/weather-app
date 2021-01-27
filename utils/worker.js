const aqiChart = [
  {
      "title": "o3",
      "ranges": [
        {
          "high": 0.124,
          "low": 0,
          "aqi_low": 0,
          "aqi_high": 50
        },
        {
          "high": 0.164,
          "low": 0.125,
          "aqi_low": 101,
          "aqi_high": 150
        },
        {
          "high": 0.204,
          "low": 0.165,
          "aqi_low": 151,
          "aqi_high": 200
        },
        {
          "high": 0.404,
          "low": 0.205,
          "aqi_low": 201,
          "aqi_high": 300
        },
        {
          "high": 0.504,
          "low": 0.405,
          "aqi_low": 301,
          "aqi_high": 400
        },
        {
          "high": 0.604,
          "low": 0.505,
          "aqi_low": 401,
          "aqi_high": 500
        }
      ]
  },
  {
      "title": "no2",
      "ranges": [
        {
          "high": 0.053,
          "low": 0,
          "aqi_low": 0,
          "aqi_high": 50
        },
        {
          "high": 0.1,
          "low": 0.054,
          "aqi_low": 51,
          "aqi_high": 100
        },
        {
          "high": 0.360,
          "low": 0.101,
          "aqi_low": 101,
          "aqi_high": 150
        },
        {
          "high": 0.649,
          "low": 0.361,
          "aqi_low": 151,
          "aqi_high": 200
        },
        {
          "high": 1.249,
          "low": 0.650,
          "aqi_low": 201,
          "aqi_high": 300
        },
        {
          "high": 1.649,
          "low": 1.250,
          "aqi_low": 301,
          "aqi_high": 400
        },
        {
          "high": 2.049,
          "low": 1.650,
          "aqi_low": 401,
          "aqi_high": 500
        },
      ]
  },
  {
      "title": "co",
      "ranges": [
        {
          "high": 4.4,
          "low": 0,
          "aqi_low": 0,
          "aqi_high": 50
        },
        {
          "high": 9.4,
          "low": 4.5,
          "aqi_low": 51,
          "aqi_high": 100
        },
        {
          "high": 12.4,
          "low": 9.5,
          "aqi_low": 101,
          "aqi_high": 150
        },
        {
          "high": 15.4,
          "low": 12.5,
          "aqi_low": 151,
          "aqi_high": 200
        },
        {
          "high": 30.4,
          "low": 15.5,
          "aqi_low": 201,
          "aqi_high": 300
        },
        {
          "high": 40.4,
          "low": 30.5,
          "aqi_low": 301,
          "aqi_high": 400
        },
        {
          "high": 50.4,
          "low": 40.5,
          "aqi_low": 401,
          "aqi_high": 500
        },
      ]
  },
  {
      "title": "pm25",
      "ranges": [
        {
          "high": 12,
          "low": 0,
          "aqi_low": 0,
          "aqi_high": 50
        },
        {
          "high": 35.4,
          "low": 12.1,
          "aqi_low": 51,
          "aqi_high": 100
        },
        {
          "high": 55.4,
          "low": 35.5,
          "aqi_low": 101,
          "aqi_high": 150
        },
        {
          "high": 150.4,
          "low": 55.5,
          "aqi_low": 151,
          "aqi_high": 200
        },
        {
          "high": 250.4,
          "low": 150.5,
          "aqi_low": 201,
          "aqi_high": 300
        },
        {
          "high": 350.4,
          "low": 250.5,
          "aqi_low": 301,
          "aqi_high": 400
        },
        {
          "high": 500.4,
          "low": 350.5,
          "aqi_low": 401,
          "aqi_high": 500
        },
      ]
  },
]

function mmToIn(value) {
  return value / 25.4;
}

// Converts numeric degrees to radians
    function toRad(Value)
    {
        return Value * Math.PI / 180;
    }

function calcCrow(lat1, lon1, lat2, lon2)
{
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d;
}

function aqiStringify (value) {
  if (value <= 50) {
    return "good";
  } else if (value <= 100) {
    return "moderate";
  } else if (value <=150) {
    return "unhealthy for sensitive groups";
  } else if (value <= 200) {
    return "unhealthy";
  } else if (value <= 300) {
    return "very unhealthy";
  } else {
    return "hazardous";
  }
}

function aqiEmojify (value) {
  if (value <= 50) {
    return "🙂";
  } else if (value <= 100) {
    return "😐";
  } else if (value <=150) {
    return "☹️";
  } else if (value <= 200) {
    return "😷";
  } else if (value <= 300) {
    return "😷";
  } else {
    return "😷";
  }
}

function findAQI (data) {
  let highestAQI = 0;
  let aqi;
  for (let i = 0; i < data.length; i++) {
    console.log(data[i].parameter)
    for (let j = 0; j < aqiChart.length; j++) {
      if (aqiChart[j].title === data[i].parameter) {
        for (let k = 0; k < aqiChart[j].ranges.length; k++) {
            console.log(data[i].value);
          if (data[i].value > aqiChart[j].ranges[k].low && data[i].value < aqiChart[j].ranges[k].high) {
            let aqiValue = (((aqiChart[j].ranges[k].aqi_high - aqiChart[j].ranges[k].aqi_low) / (aqiChart[j].ranges[k].high - aqiChart[j].ranges[k].low)) * (data[i].value - aqiChart[j].ranges[k].low)) + aqiChart[j].ranges[k].aqi_low;
            let aqiString = aqiStringify(aqiValue);
            let aqiEmoji = aqiEmojify(aqiValue);
            if (highestAQI < aqiValue) {
              highestAQI = aqiValue;
              aqi = {parameter: data[i].parameter, value: aqiValue, emoji: aqiEmoji, string: aqiString};
            }
          }
        }
      }
    }
  }
  return aqi;
}

function findAQ (lat, lon, iq) {
  var shortestCrow;
  let shortestCoordinates;
  let shortestCity;
  let shortestData;
  for (let i = 0; i < iq.results.length; i++) {
    if(iq.results[i].coordinates) {
      let crow = calcCrow(lat, lon, iq.results[i].coordinates.latitude, iq.results[i].coordinates.longitude);
      if (i === 0) {
        shortestCrow = crow;
        shortestCity = iq.results[i].city;
        shortestData = iq.results[i].measurements;
        shortestCoordinates = {latitude: iq.results[i].coordinates.latitude, longitude: iq.results[i].coordinates.longitude};
      } else {
        if (crow < shortestCrow) {
          console.log(crow);
          console.log(iq.results[i].city);
          shortestCrow = crow;
          shortestCity = iq.results[i].city;
          shortestData = iq.results[i].measurements;
          shortestCoordinates = {latitude: iq.results[i].coordinates.latitude, longitude: iq.results[i].coordinates.longitude};
          console.log(shortestCoordinates);
        }
      }
    }
  }
  return findAQI(shortestData);
}

const func = async (lat, lon, country) => {
  return new Promise((resolve, reject) => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        resolve(findAQ(lat, lon, JSON.parse(xhttp.responseText)));
      }
    };
    xhttp.open("GET", `https://api.openaq.org/v1/latest?country=${country}&limit=5000`, true);
    xhttp.send();
  })
}

onmessage = async (e) => {
  try {
    let aqi = await func(e.data[0], e.data[1], e.data[2])
    postMessage({aqi});
  } catch (err) {
    console.log(err)
    return
  }
}
