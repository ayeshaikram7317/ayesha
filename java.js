console.log("SkyCast is ready!");

const searchForm = document.querySelector(".search-form");

const cityInput = document.querySelector("#city-input");
const cityName = document.querySelector("#city-name");
console.log(cityName);


searchForm.addEventListener("submit",  async function(event) {
    event.preventDefault();
    const city = cityInput.value.trim();


    if (city === "") {
        document.querySelector("#error-message").textContent = "Please enter a city name!" ;
        return;
    }
    document.querySelector("#error-message").textContent = "" ;
    document.querySelector(".search-form button").textContent = "Loading...";

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;

    console.log(url);
    try {

    
    const response = await fetch(url);
    const data = await response.json();
    if(!data.results || data.results.length===0) {
        document.querySelector("#error-message").textContent = "City not found! Please try another city.";
       
        document.querySelector(".search-form button").textContent = "Search";
        return;

    }
    document.querySelector("#error-message").textContent = "";

    console.log(data);
    console.log(data.results[0].name);
    console.log(data.results[0].latitude);
    console.log(data.results[0].longitude);


    document.querySelector("#city-name").textContent =`${data.results[0].name}, ${data.results[0].country}`;
    
    
    const latitude = data.results[0].latitude;
    const longitude = data.results[0].longitude;

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,surface_pressure,weather_code,&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code`;


    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();
    const hourlyData = weatherData.hourly;
    const dailyData = weatherData.daily;
    console.log("Daily data:", dailyData);
    const dailyContainer = document.querySelector("#weekly-forecast");
    dailyContainer.innerHTML="";
    for (let i = 0; i < 7; i++) {
        dailyContainer.innerHTML += `
        <div class="day-card">
        <p>${new Date(dailyData.time[i]).toLocaleDateString("en-US", {weekday:"short"})}</p>
        <p>${dailyData.weather_code[i]=== 0 ?"☀️" :
            dailyData.weather_code[i] <=3 ?"🌤️" :
            dailyData.weather_code[i] <= 51 &&
            dailyData.weather_code[i] <=67 ? "🌧️" :
            dailyData.weather_code[i] >=71 && 
            dailyData.weather_code[i] <= 77 ? "❄️" :
            dailyData.weather_code[i] >=95 ? "⛈️" : "☁️" } </p>

        <h3>${dailyData.temperature_2m_max[i]}C</h3>
        <p>Min: ${dailyData.temperature_2m_min[i]}C</P>
        </div>
        `;

    }

    console.log("Hourly data :", hourlyData);
    console.log(hourlyData.time.slice(0,5));
    console.log(hourlyData.temperature_2m.slice(0,5));
   const hourlyContainer = document.querySelector("#hourly-forecast");
   hourlyContainer.innerHTML = "";
   for (let i = 0; i <5; i++) {
    hourlyContainer.innerHTML +=`
    <div class ="hour-card">
    <p>${hourlyData.time[i].slice(11, 16)}</p>
    <h3>${hourlyData.temperature_2m[i]}C</h3>
    </div>
    `;
   }
    console.log(hourlyData);
    

    console.log(weatherData);
    document.querySelector("#temperature").textContent=weatherData.current.temperature_2m;
    document.querySelector("#feels-like").textContent=weatherData.current.apparent_temperature;
    document.querySelector("#wind-speed").textContent=weatherData.current.wind_speed_10m;
    document.querySelector("#pressure").textContent=weatherData.current.surface_pressure;
    console.log(weatherData.current.weather_code);
    
const code = weatherData.current.weather_code;
console.log("weather code:", code);

const icon = document.querySelector(".weather-icon");
if(code===0) {
    icon.textContent="☀️";

} else if(code <=3) {
    icon.textContent ="⛅";

} else if (code >=51 && code <=67) {
    icon.textContent="🌧️";

} else if (code >=71 && code <=77) {
    icon.textContent="❄️";

} else if (code >=95) {
    icon.textContent="⛈️";

} else {
    icon.textContent="🌥️";

}
  const condition = document.querySelector("#weather-condition");
  if(code===0) {
    condition.textContent ="Clear Sky 🌞";

  } else if(code <=3) {
    condition.textContent = "Party Cloud ⛅";

  } else if (code >=51 && code <=67) {
    condition.textContent = "Rainy 🌧️";

  } else {
    condition.textContent = "Cloudy ☁️";

  }




    document.querySelector("#humidity").textContent = weatherData.current.relative_humidity_2m;
    if(city==="") {
        console.log("Please enter a city name!");
        return;

    }
    cityName.textContent = `${data.results[0].name}, ${data.results[0].country}`;

    console.log("city entered:", city);
    document.querySelector(".search-form button").textContent = "Search" ;

} catch (error) {
    document.querySelector(".serach-form button").textContent = "Search" ;

    document.querySelector("#error-message").textContent = "No internet connection. Please try again.";
    console.log("Error:", error);
    return;

}

});