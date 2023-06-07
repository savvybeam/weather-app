import { api } from "./env.js";

// VARIABLE DECLARATIONS

const global = {
    coords : {
        latitude : 0.00,
        longitude : 0.00
    },
    weatherResult: {}
}

const mainLocImage = document.getElementById('header-loc-img');



// GET USER COORDS AND USE THAT FOR CURRENT WEATHER

navigator.geolocation.getCurrentPosition((pos)=>{
    const { latitude, longitude } = pos.coords;
    global.coords.latitude = latitude;
    global.coords.longitude = longitude
  
    let query = `${global.coords.latitude},${global.coords.longitude}`;

    // fetch data using the Weather API
    const userCurrentWeather = fetchWeatherAPIData('current', query);

    //resource for User Current Location
    userCurrentWeather.then(byLocation=>{
        console.log(byLocation)
        mainLocImage.src = byLocation.current.condition.icon
        
    });

    

    

    
});

//fetch Weather Data from API
const fetchWeatherAPIData = async (endpoint, query) => {
    const response = await fetch(`${api.url}/${endpoint}.json?q=${query}&key=${api.key}`)
    const data = await response.json();
    return data;
}






