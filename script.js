import { api } from "./env.js";
const global = {
    coords : {
        latitude : 0.00,
        longitude : 0.00
    },
    weatherResult: {}
}

const mainLocImage = document.getElementById('header-loc-img');

// when you first load app, get location details and use lat/long to get current weather

navigator.geolocation.getCurrentPosition((pos)=>{
    const { latitude, longitude } = pos.coords;
    global.coords.latitude = latitude;
    global.coords.longitude = longitude
  
    let query = `${global.coords.latitude},${global.coords.longitude}` || "birmingham";

    const userCurrentWeather = fetchWeatherAPIData('current', query);

    //resource for User Current Location
    userCurrentWeather.then(byLocation=>{
        console.log(byLocation)
        mainLocImage.src = byLocation.current.condition.icon
        console.log(byLocation.current.condition.icon);
    });

    

    

    
});

//fetch Weather Data from API
const fetchWeatherAPIData = async (endpoint, query) => {
    const response = await fetch(`${api.url}/${endpoint}.json?q=${query}&key=${api.key}`)
    const data = await response.json();
    return data;
}






