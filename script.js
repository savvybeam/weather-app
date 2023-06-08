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
const YourCity = document.getElementById('city-ticker');
const temp_deg = document.getElementById('temp');
const temp_feels = document.getElementById('temp_feels');
const dateTime = document.getElementById('date-time');



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
        mainLocImage.src = byLocation.current.condition.icon;
        YourCity.innerHTML = byLocation.location.name;
        temp_deg.innerHTML = `<span>${byLocation.current.temp_c}&deg;c</span>`;
        temp_feels.innerHTML = `<span>${byLocation.current.feelslike_c}&deg;c</span>`;
        let lastDate = new Date(byLocation.current.last_updated)
        dateTime.innerHTML = formatDate(lastDate);
    });

    

    

    
});


// FUNCTIONS


//fetch Weather Data from API
const fetchWeatherAPIData = async (endpoint, query) => {
    const response = await fetch(`${api.url}/${endpoint}.json?q=${query}&key=${api.key}`)
    const data = await response.json();
    return data;
}

const formatDate = (aDate) =>{

    let sd = new Date(aDate);

  
    let formatedDate = `${sd.getHours()}:${sd.getMinutes()}, ${getWordedWeekDay(sd.getDay())}, ${getWordedMonth(sd.getMonth())} ${sd.getDate()}, ${sd.getFullYear()}`



    return formatedDate;

}

const getWordedWeekDay = (weekIndex) =>{

    let wordedDayOfWeek;

    switch(weekIndex){
        case 0:
            wordedDayOfWeek = 'Sun'
            break;
        case 1:
            wordedDayOfWeek = 'Mon'
            break;
        case 2:
            wordedDayOfWeek = 'Tue'
            break;
        case 3:
            wordedDayOfWeek = 'Wed'
        case 4:
            wordedDayOfWeek = 'Thur'
            break;
        case 5:
            wordedDayOfWeek = 'Fri'
            break;
        case 6:
            wordedDayOfWeek = 'Sat'
            break;
    }

    return wordedDayOfWeek;
}


const getWordedMonth = (monthIndex) =>{

    let wordedMonth;

    switch (monthIndex){
        case 0:
            wordedMonth = 'Jan'
            break;
        case 1:
            wordedMonth = 'Feb'
            break;
        case 2:
            wordedMonth = 'Mar'
            break;
        case 3:
            wordedMonth = 'Apr'
            break;
        case 4:
            wordedMonth = 'May'
            break;
        case 5:
            wordedMonth = 'Jun'
            break;
        case 6:
            wordedMonth = 'Jul'
            break;
        case 7:
            wordedMonth = 'Aug'
            break;
        case 8:
            wordedMonth = 'Sep'
            break;
        case 9:
            wordedMonth = 'Oct'
            break;
        case 10:
            wordedMonth = 'Nov'
            break;
        case 11:
            wordedMonth = 'Dec'
            break;
    }

    return wordedMonth;

}



// EVENT LISTENERS






