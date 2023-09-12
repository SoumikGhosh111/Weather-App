let container1 = document.querySelector(".container-1");
let container2 = document.querySelector(".container-2");
let fetchDataButton = container1.querySelector("#container-1-button");
let long = container2.querySelector(".long span");
let lat = container2.querySelector(".lat span");
let mapDiv = container2.querySelector(".map"); 


let loc = container2.querySelector(".location span"); 
let windspeed = container2.querySelector(".wind-spedd span"); 
let humi = container2.querySelector(".Humidity span"); 
let timeZone = container2.querySelector(".Time-Zone span"); 
let press = container2.querySelector(".Pressure span"); 
let windDir = container2.querySelector(".Wind-direction span"); 
let UVindex = container2.querySelector(".UV-index span"); 
let feels = container2.querySelector(".feels-like span");
let temp = container2.querySelector(".tempareture span");  
let weatherDesc = container2.querySelector(".weather-desc span"); 
let visible = container2.querySelector(".visibility span"); 
let sunR = container2.querySelector(".sun-rise span"); 
let sunS = container2.querySelector(".sun-set span"); 
let searchButon = container2.querySelector(".search-bar button"); 
let searchStr = container2.querySelector(".seach-input input"); 
let footerElements = container2.querySelector(".footer-element-2"); 



fetchDataButton.addEventListener("click", () => {
  fetchGeolocation();
  container1.classList.add("d");
  container2.classList.remove("show-container-2");
})

searchButon.addEventListener("click", ()=>{ 
  fetchWeatherDataForCity(searchStr.value);
  setTimeout(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, 1000);
}); 
searchStr.addEventListener("keydown", function(e){ 
 if(e.key === 'Enter' || e.keyCode === 13){ 
  fetchWeatherDataForCity(searchStr.value);
  setTimeout(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, 1000);
 }
});

const apiKey = "cb51427ff69958e095b6ad1f702b2499";
// const apiKey = "0d37d999b4705308cc960c47e35d754d"; 
const baseUrl = "https://api.openweathermap.org/data/2.5/";
 

// fetching geo location
function fetchGeolocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      
      lat.innerHTML = `Lat: ${latitude}`
      long.innerHTML = `Long: ${longitude}`;    

      fetchWeatherData(latitude, longitude);
      fetchUVindex(latitude, longitude); 
      createMap(latitude, longitude); 

    },function (error) {
      // Handle geolocation error
      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.log("User denied the request for geolocation.");
          break;
        case error.POSITION_UNAVAILABLE:
          console.log("Location information is unavailable.");
          break;
        case error.TIMEOUT:
          console.log("The request to get user location timed out.");
          break;
        case error.UNKNOWN_ERROR:
          console.log("An unknown error occurred.");
          break;
      } 

    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}


// Data Inserting
function printWeatherData(data){ 
  const location = data.name;
  const windSpeed = Math.ceil(data.wind.speed); 
  const humidity = data.main.humidity;
  const timezone = convertTimezoneOffsetToGMT(data.timezone);
  const pressure = pascalsToAtmospheres(data.main.pressure);
  const windDirection = degreesToWindDirection(data.wind.deg); 
  // const uvIndex = data.uv || 'Not available'; // UV index may not always be present
  const feelsLike = Math.ceil(kelvinToCelsius(data.main.feels_like));
  const Temp = Math.ceil(kelvinToCelsius(data.main.temp)); 
  const weatherD = data.weather[0].description; 
  const visibility = visibilityToKm(data.visibility); 
  const sunrise = sunRise(data.sys.sunrise); 
  const sunset = sunSet(data.sys.sunset); 

  loc.innerHTML = `Location: ${location}`; 
  windspeed.innerHTML = `Wind Speed: ${windSpeed * 3.6} kmph`; 
  humi.innerHTML = `Humidity: ${humidity}`; 
  timeZone.innerHTML = `Time Zone: ${timezone}`; 
  press.innerHTML = `Pressure: ${pressure} atm`; 
  windDir.innerHTML = `Wind Direction: ${windDirection}`; 
  feels.innerHTML = `Feels Like: ${feelsLike}°`; 
  temp.innerHTML = `Temparature: ${Temp}°`; 
  weatherDesc.innerHTML = `Weather: ${weatherD}`; 
  visible.innerHTML = `Visibility: ${visibility}`; 
  sunR.innerHTML = `Sun Rise At : ${sunrise}`; 
  sunS.innerHTML = `Sun Set At : ${sunset}`; 
}

function printUvIndex(data){ 
  const UV = data.value; 
  UVindex.innerHTML = `UV Index: ${UV}`; 
}

function printCityWeatherData(weatherData, UvData){ 
 
  const location = weatherData.name;
  const windSpeed = Math.ceil(weatherData.wind.speed); 
  const humidity = weatherData.main.humidity;
  const timezone = convertTimezoneOffsetToGMT(weatherData.timezone);
  const pressure = pascalsToAtmospheres(weatherData.main.pressure);
  const windDirection = degreesToWindDirection(weatherData.wind.deg); 
  // const uvIndex = data.uv || 'Not available'; // UV index may not always be present
  const feelsLike = Math.ceil(kelvinToCelsius(weatherData.main.feels_like));
  const Temp = Math.ceil(kelvinToCelsius(weatherData.main.temp)); 
  const weatherD = weatherData.weather[0].description; 
  const visibility = visibilityToKm(weatherData.visibility); 
  const sunrise = sunRise(weatherData.sys.sunrise); 
  const sunset = sunSet(weatherData.sys.sunset); 

  const UV = UvData.value; 
  // UVindex.innerHTML = `UV Index: ${UV}`;

  const row = document.createElement("div"); 
  row.className = "row"; 
  row.innerHTML = `
  <div class="weather-elements">
  <h3 class="weather-desc">
      <span> Weather: ${weatherD}</span>
  </h3>
</div>
<div class="weather-elements">
  <h3 class="wind-spedd">
      <span> wind Speed: ${windSpeed} Kmph</span>
  </h3>
</div>
<div class="weather-elements">
  <h3 class="Humidity">
      <span>Humidity: ${humidity}</span>
  </h3>
</div>
<div class="weather-elements">
  <h3 class="visibility">
      <span>Visibility: ${visibility}</span>
  </h3>
</div>
<div class="weather-elements">
  <h3 class="Time-Zone">
      <span>Timezone: ${timezone}</span>
  </h3>
</div>
<div class="weather-elements">
  <h3 class="sun-rise">
      <span>Sun Rise At: ${sunrise}</span>
  </h3>
</div>
<div class="weather-elements">
  <h3 class="sun-set">
      <span>Sun Set At: ${sunset}</span>
  </h3>
</div>
<div class="weather-elements">
  <h3 class="Pressure">
      <span>Pressure: ${pressure} atm</span>
  </h3>
</div>
<div class="weather-elements">
  <h3 class="Wind-direction">
      <span>Wind Direction: ${windDirection}</span>
  </h3>
</div>
<div class="weather-elements">
  <h3 class="UV-index">
      <span>UV Index: ${UV}</span>
  </h3>
</div>
<div class="weather-elements">
  <h3 class="tempareture">
      <span>Tempareture: ${Temp}°</span>
  </h3>
</div>
<div class="weather-elements">
  <h3 class="feels-like">
      <span>Feels Like: ${feelsLike}°</span>
  </h3>
</div> 
  `;
  footerElements.innerHTML = `
  <h1>${location}</h1> 
  ` 
  footerElements.appendChild(row); 
}


// data fetching...
async function fetchWeatherData(a, b) {
  const endPoint = `${baseUrl}/weather?lat=${a}&lon=${b}&appid=${apiKey}`;
  try {
    const response = await fetch(endPoint);
    const result = await response.json();
    console.log(result); 
    printWeatherData(result);
  }
  catch (error) {
    console.error(error);
  }

}
async function fetchUVindex(a, b){ 
  const endPoint = `${baseUrl}/uvi?lat=${a}&lon=${b}&appid=${apiKey}`;
  try{ 
    const response = await fetch(endPoint); 
    const result = await response.json(); 
    printUvIndex(result); 
  }
  catch(e){ 
    console.error(e); 
  }
}
async function fetchCityUVindex(a, b){ 
  const endPoint = `${baseUrl}/uvi?lat=${a}&lon=${b}&appid=${apiKey}`;
  try{ 
    const response = await fetch(endPoint); 
    const result = await response.json();  
    return result; 
  }
  catch(e){ 
    console.error(e); 
  }
}

async function fetchWeatherDataForCity(searchData){ 
  const endpoint = `${baseUrl}weather?q=${searchData}&appid=${apiKey}`; 
  try{ 
    const response = await fetch(endpoint); 
    const result = await response.json(); 
    if(result.cod == "404"){ 
      alert(result.message); 
    }
    const lat = result.coord.lat; 
    const long = result.coord.lon;

    const uvObject = await fetchCityUVindex(lat, long);
    // console.log(uvObject);  
    
    printCityWeatherData(result, uvObject); 
  }
  catch(e){ 
    console.error(e);  
  }
}

// convert raw data to readable data


function degreesToWindDirection(degrees) {
  if (degrees >= 337.5 || degrees < 22.5) {
    return 'North';
  } else if (degrees >= 22.5 && degrees < 67.5) {
    return 'Northeast';
  } else if (degrees >= 67.5 && degrees < 112.5) {
    return 'East';
  } else if (degrees >= 112.5 && degrees < 157.5) {
    return 'Southeast';
  } else if (degrees >= 157.5 && degrees < 202.5) {
    return 'South';
  } else if (degrees >= 202.5 && degrees < 247.5) {
    return 'Southwest';
  } else if (degrees >= 247.5 && degrees < 292.5) {
    return 'West';
  } else if (degrees >= 292.5 && degrees < 337.5) {
    return 'Northwest';
  } else {
    return 'Unknown';
  }
}

function convertTimezoneOffsetToGMT(offsetSeconds) {
  const offsetHours = Math.floor(Math.abs(offsetSeconds) / 3600);
  const offsetMinutes = Math.floor((Math.abs(offsetSeconds) % 3600) / 60);
  const sign = offsetSeconds >= 0 ? '+' : '-';

  const gmtFormat = `GMT ${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;
  return gmtFormat;
}

function pascalsToAtmospheres(milibars) {
  const atm = milibars / 1013.25;
  return atm;
}

function kelvinToCelsius(kelvin) {
  const celsius = kelvin - 273.15;
  return celsius;
}



function createMap(lat, long){  
  const latitude = lat; 
  const longitude = long; 
  const url = `https://maps.google.com/maps/?q=${latitude},${longitude}&output=embed`; 
  mapDiv.innerHTML = `<iframe src=${url} width="100%" height="100%" frameborder="0" style="border:0"></iframe>`;
}

function visibilityToKm(data){ 
  const kilometers = data/1000; 
  return `${ kilometers.toFixed(1)}Km`; 
}
function sunRise(data){  
  const sunriseDate = new Date(data * 1000);
  return sunriseDate.toLocaleTimeString();
}
function sunSet(data){ 
  const sunsetDate = new Date(data * 1000);
  return sunsetDate.toLocaleTimeString();
}