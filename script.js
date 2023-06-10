import { api } from "./env.js";

// VARIABLE DECLARATIONS

const global = {
    coords : {
        latitude : 0.00,
        longitude : 0.00
    },
    weatherResult: {},
    addedLocations : [
    {
        city: 'London',
        temp: 9,
        img: '//cdn.weatherapi.com/weather/64x64/night/122.png'
    },{
        city: 'Bournemouth',
        temp: 15,
        img: '//cdn.weatherapi.com/weather/64x64/night/122.png'
    
    },{
        city: 'Leeds',
        temp: 16,
        img: '//cdn.weatherapi.com/weather/64x64/night/122.png'
    
    },{
        city: 'Edinburgh',
        temp: 16,
        img: '//cdn.weatherapi.com/weather/64x64/night/122.png'
    
    },{
        city: 'Milton Kynes',
        temp: 12,
        img: '//cdn.weatherapi.com/weather/64x64/night/122.png'
    
    }
]
}

const mainLocImage = document.getElementById('header-loc-img');
const yourCity = document.getElementById('city-ticker');
const temp_deg = document.getElementById('temp');
const temp_feels = document.getElementById('temp_feels');
const weatherText = document.getElementById('weather-text');
const dateTime = document.getElementById('date-time');
const loader = document.getElementById('loader');
const showAddBtn = document.getElementById('add-new-btn');
const newLocationList = document.querySelector('#new-location-list');
const createLocationDiv = document.getElementById('create-new-location-wrapper');



//display loader
const showLoader = () =>{
        loader.classList.add('show')
        console.log(loader)
}

const removeLoader = () =>{
        loader.classList.remove('show');
        console.log(loader)
}


// GET USER COORDS AND USE THAT FOR CURRENT WEATHER



setInterval(()=>{ //get location every 1 minute and update
    
showLoader();

navigator.geolocation.getCurrentPosition((pos)=>{
    const { latitude, longitude } = pos.coords;
    global.coords.latitude = latitude;
    global.coords.longitude = longitude
  
    let query = `${global.coords.latitude},${global.coords.longitude}`;

    // fetch data using the Weather API

    
    
    

    const userCurrentWeather = fetchWeatherAPIData('current', query);

    //resource for User Current Location
    userCurrentWeather.then(weather=>{
        console.log(weather)
        mainLocImage.src = weather.current.condition.icon;
        yourCity.innerHTML = weather.location.name;
        addFontAweIconToParent(yourCity, 'fa-map-marker')
        temp_deg.innerHTML = `<span>${weather.current.temp_c}&deg;c</span>`;
        temp_feels.innerHTML = `<span>${weather.current.feelslike_c}&deg;c</span>`;
        addFontAweIconToParent(weatherText, 'fa-map-marker')
        weatherText.innerHTML = weather.current.condition.text;
        dateTime.innerHTML = formatDate(weather.current.last_updated);

        removeLoader();

    });

})}, 60000);



// FUNCTIONS



//Added Font Awesome Icon to an Element
const addFontAweIconToParent = (parent, iconClass) =>{
    const pin = document.createElement('i');
    const spaceXter = document.createTextNode(' ');
    pin.classList.add('fa');
    pin.classList.add(iconClass);
    parent.appendChild(spaceXter)
    parent.appendChild(pin);
}

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


//Fetch User Added Location Array

const getAddedLocations = () =>{
    
        if(global.addedLocations.length === 0){
            newLocationList.innerHTML = `<Span>Nothing to Show</span>`;
        }else{
            global.addedLocations.forEach(weather=>{
                addLocationToDOM(weather);
            })
        }

}

// Create Location Elements and Add to DOM
const addLocationToDOM = (locObject) =>{

    const locationItemDiv = document.createElement('div');
    locationItemDiv.classList.add('location-item');

    const newLocImg = document.createElement('img');
    newLocImg.classList.add('loc-img');
    newLocImg.src = locObject.img;

    const newLocDetails = document.createElement('div');
    newLocDetails.classList.add('new-loc-details');

    const locName = document.createElement('h4');
    locName.classList.add('loc-name');

    const locDetails = document.createElement('p');
    locDetails.classList.add('loc-details')


    locName.appendChild(document.createTextNode(locObject.city));
    locDetails.appendChild(document.createTextNode(locObject.temp));
    newLocDetails.appendChild(locName);
    newLocDetails.appendChild(locDetails);
    locationItemDiv.appendChild(newLocImg);
    locationItemDiv.appendChild(newLocDetails)

    newLocationList.appendChild(locationItemDiv);

}

const showCreateLocationForm = () =>{
    newLocationList.classList.add('hide');
    console.log(newLocationList);
    createLocationDiv.classList.add('show');
}


// EVENT LISTENERS

showAddBtn.addEventListener('click', showCreateLocationForm);



// ON LOAD CALLS

getAddedLocations();

