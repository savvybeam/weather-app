import { api } from "./env.js";
import { getWordedWeekDay, getWordedMonth, formatDate } from "./datetime-helper.js";

// VARIABLE DECLARATIONS

const global = {
    coords : {
        latitude : 0.00,
        longitude : 0.00
    }
}

let localStore = [];

const mainLocImage = document.getElementById('header-loc-img');
const yourCity = document.getElementById('city-ticker');
const temp_deg = document.getElementById('temp');
const temp_feels = document.getElementById('temp_feels');
const weatherText = document.getElementById('weather-text');
const dateTime = document.getElementById('date-time');
const loader = document.getElementById('loader');
const showAddBtn = document.getElementById('add-new-btn');
const locationFrm = document.getElementById('newLocationForm');
const newLocationList = document.querySelector('#new-location-list');
const createLocationDiv = document.getElementById('create-new-location-wrapper');
const formCloseBtn = document.getElementById('close-add-form-btn');
const newInput = document.getElementById('new-loc-input');
const alertWrapper = document.getElementById('alert-wrapper');



//display loader





// GET USER COORDS AND USE THAT FOR CURRENT WEATHER

setInterval(()=>{ //get location every 1 minute and update
    

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

const showCreateLocationForm = () =>{
    newLocationList.classList.add('hide');
    showAddBtn.style.display = 'none';
    createLocationDiv.classList.add('show');
}


const closeForm = () => {
    createLocationDiv.classList.remove('show');
    newLocationList.classList.remove('hide');
    showAddBtn.style.display = 'block';
}


const createAlert = (message, className = 'error') => {
    const div = document.createElement('div');
    div.classList.add('alert', className);
    const icon = document.createElement('i');
    icon.classList.add('fa','fa-info');
    div.appendChild(icon);
    div.appendChild(document.createTextNode(message));
    alertWrapper.appendChild(div);
}

const submitNewLocation = (e) => {
    e.preventDefault();

    let myForm = new FormData(locationFrm);

    let newLocation = myForm.get('new-location-input');

    if (newLocation === '') {
        createAlert(' Input a City to continue');
        alertWrapper.classList.add('show');
        setTimeout(() => {
            alertWrapper.classList.remove('show');
            alertWrapper.firstElementChild.remove();
        }, 4000);

        return;
    }

    //add new Location to Local Storage
    addLocationToStorage(newLocation);
    newInput.value = ''; //set the form input to Empty after submission


    //add new Location to DOM
    updateUIData();

    closeForm();


}


const addLocationToStorage = (location) => {

    let itemsFromLocalStorage = getItemsFromLocalStorage();

    if (itemsFromLocalStorage !== null) {
        localStore = [];
        const parsedLocation = JSON.parse(itemsFromLocalStorage);
        localStore = parsedLocation;
    }

    localStore.push(location);
    localStorage.setItem('locations', JSON.stringify(localStore));

}


    //fetch items from local store
const getItemsFromLocalStorage = () => {


    return localStorage.getItem('locations');

}


//Fetch User Added Location Array

const updateUIData = () => {

    let itemsFromStorage = getItemsFromLocalStorage();

    let parsedLocations = JSON.parse(itemsFromStorage);

    if (parsedLocations === null) {
        newLocationList.innerHTML = `<Span><i class="fa fa-info"></i> Nothing to see here. Click below to add a favorite city.</span>`;
        showCreateLocationForm();
    } else {
        parsedLocations.forEach(query => {
            let cityWeatherObj = fetchWeatherAPIData('current', query);
            cityWeatherObj.then((obj) => addLocationToDOM(obj))
        });
    }

}

// Create Location Elements and Add to DOM
const addLocationToDOM = (locObject) => {

    const locationItemDiv = document.createElement('div');
    locationItemDiv.classList.add('location-item');

    const newLocImg = document.createElement('img');
    newLocImg.classList.add('loc-img');
    newLocImg.src = locObject.current.condition.icon;

    const newLocDetails = document.createElement('div');
    newLocDetails.classList.add('new-loc-details');

    const locName = document.createElement('h4');
    locName.classList.add('loc-name');

    const locDetails = document.createElement('p');
    locDetails.classList.add('loc-details')


    locName.appendChild(document.createTextNode(locObject.location.name));
    locDetails.appendChild(document.createTextNode(locObject.current.temp_c));
    newLocDetails.appendChild(locName);
    newLocDetails.appendChild(locDetails);
    locationItemDiv.appendChild(newLocImg);
    locationItemDiv.appendChild(newLocDetails)

    newLocationList.appendChild(locationItemDiv);

}



//fetch Weather Data from API
const fetchWeatherAPIData = async (endpoint, query) => {
    const response = await fetch(`${api.url}/${endpoint}.json?q=${query}&key=${api.key}`)
    const data = await response.json();
    return data;
}


// EVENT LISTENERS

locationFrm.addEventListener('submit', submitNewLocation);

showAddBtn.addEventListener('click', showCreateLocationForm);

formCloseBtn.addEventListener('click', closeForm);

newInput.addEventListener('focus', () => {
    createLocationDiv.style.boxShadow = '0px 5px 5px 0px';
})

newInput.addEventListener('blur', () => {
    createLocationDiv.style.boxShadow = '';
})

// ON LOAD CALLS

document.addEventListener('DOMContentLoaded', updateUIData());

