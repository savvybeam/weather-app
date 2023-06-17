import apiKey from "./env.js";
import { getWordedWeekDay, getWordedMonth, formatDate } from "./datetime-helper.js";

// VARIABLE DECLARATIONS

const global = {
    coords : {
        latitude : 0.00,
        longitude : 0.00
    }
}

let localStore = [];
const apiURL = "https://api.weatherapi.com/v1";

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
const menuBtn = document.getElementById('menu-button');
const myLocImg = document.getElementById('img-span');
const timelineWrapper = document.querySelector('.timeline');

//Timeline
const timelineList = document.getElementById('timeline-body');




// GET USER COORDS AND USE THAT FOR CURRENT WEATHER

const getMyLocation = () => { //get location every 1 minute and update

    //display loader
    loader.style.display = 'block';

    navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        global.coords.latitude = latitude;
        global.coords.longitude = longitude

        let query = `${global.coords.latitude},${global.coords.longitude}`;

        // fetch data using the Weather API
        const userCurrentWeather = fetchWeatherAPIData('current', query);

        //resource for User Current Location
        userCurrentWeather.then(weather => {
            myLocImg.innerHTML = '';
            const myImgEl = document.createElement('img');
            myImgEl.classList.add('header-loc-img');
            myImgEl.src = weather.current.condition.icon;
            myLocImg.appendChild(myImgEl);
            yourCity.innerHTML = weather.location.name;
            addFontAweIconToParent(yourCity, 'fa-map-marker')
            temp_deg.innerHTML = `<span>Main: ${weather.current.temp_c}\u00B0c</span>`;
            temp_feels.innerHTML = `<span>Feels Like: ${weather.current.feelslike_c}\u00B0c</span>`;
            addFontAweIconToParent(weatherText, 'fa-map-marker')
            weatherText.innerHTML = weather.current.condition.text;
            dateTime.innerHTML = formatDate(weather.current.last_updated);

            //save location history to Local Storage
            addLocationToStorage(weather.location.name, 'history');
            
        });

        //hide loader
        loader.style.display = 'none';
        
    });

    
}



// FUNCTIONS

//Pull locationVisited history from Local Storage
const loadTimeLineItemIntoDOM = () => {

    timelineList.innerHTML = '';

    //get and parse items from Location Storage: history

    const historyFromLocalStorage = JSON.parse(getItemsFromLocalStorage('history'));

    //get each history item and spit out on timeline
    historyFromLocalStorage.forEach(result => {

        const tli = document.createElement('div');
        tli.classList.add('location-details-items');

        const tliCity = document.createElement('span');
        tliCity.classList.add('details-note');
        tliCity.appendChild(document.createTextNode(`${result.locationName}: ${result.timeStamp}`));

        tli.appendChild(tliCity);
        timelineList.appendChild(tli);

    });
}

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
    icon.classList.add('fa','fa-info-circle');
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
    addLocationToStorage(newLocation, 'favorites');
    newInput.value = ''; //set the form input to Empty after submission


    //add new Location to DOM
    updateFavoriteLocationData();

    closeForm();


}


//Add user favorite location to LocalStorage
const addLocationToStorage = (location, storeType) => {
    let locationVar;
    let itemsFromLocalStorage = getItemsFromLocalStorage(storeType);

    if (storeType === 'favorites') {
        locationVar = location;
    }

    if (storeType === 'history') {
        locationVar = {
                locationName: location,
                timeStamp: formatDate(new Date)
        }
    }

    if (itemsFromLocalStorage !== null) {
        localStore = [];
        const parsedLocation = JSON.parse(itemsFromLocalStorage);
        localStore = parsedLocation;
    }

    localStore.push(locationVar);
    localStorage.setItem(storeType, JSON.stringify(localStore));

    localStore = [];
}



//fetch items from LocalStorage: Favorite Location or History
const getItemsFromLocalStorage = (source) => {
    return localStorage.getItem(source);
}


//Update UI/DOM with User Favorite Locations 
const updateFavoriteLocationData = () => {
    let itemsFromStorage = getItemsFromLocalStorage('favorites');
    let parsedLocations = JSON.parse(itemsFromStorage);

    if (parsedLocations === null) {
        newLocationList.innerHTML = `<Span><i class="fa fa-info-circle"></i> Nothing to see. Click below to add a favorite city.</span>`;
        showCreateLocationForm();
    } else {
            //clear UI
            newLocationList.innerHTML = '';

            //Add Data to UI
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

    const closeItemDiv = document.createElement('div');
    closeItemDiv.classList.add('close-btn-div');

    const closeItemBtn = document.createElement('button');
    closeItemBtn.classList.add('close-item-btn');
    closeItemBtn.innerHTML = `<i class="fa fa-times"></i>`;
    closeItemDiv.appendChild(closeItemBtn);
    locationItemDiv.appendChild(closeItemDiv);

    const cloudDetailsDiv = document.createElement('div');
    cloudDetailsDiv.classList.add('cloud-details');

    const cloudTextParagraph = document.createElement('span');

    const newLocImg = document.createElement('img');
    newLocImg.classList.add('loc-img');
    newLocImg.src = locObject.current.condition.icon;

    const newLocDetails = document.createElement('div');
    newLocDetails.classList.add('new-loc-details');

    const locName = document.createElement('h4');
    locName.classList.add('loc-name');

    const locDetails = document.createElement('p');
    locDetails.classList.add('loc-details');

    const locTime = document.createElement('p');
    locTime.classList.add('loc-time');

    cloudTextParagraph.appendChild(document.createTextNode(locObject.current.condition.text));
    cloudDetailsDiv.appendChild(newLocImg);
    cloudDetailsDiv.appendChild(cloudTextParagraph);
    locName.appendChild(document.createTextNode(`${locObject.location.name}, ${locObject.location.country}`));
    locDetails.appendChild(document.createTextNode(locObject.current.temp_c + '\u00B0c'));
    locTime.appendChild(document.createTextNode(locObject.current.last_updated));
    newLocDetails.appendChild(locName);
    newLocDetails.appendChild(locDetails);
    newLocDetails.appendChild(locTime)
    locationItemDiv.appendChild(cloudDetailsDiv);
    locationItemDiv.appendChild(newLocDetails)
    newLocationList.appendChild(locationItemDiv);
}



//fetch Weather Data from API
const fetchWeatherAPIData = async (endpoint, query) => {
    const response = await fetch(`${apiURL}/${endpoint}.json?q=${query}&key=${apiKey}`)
    const data = await response.json();
    return data;
}

const toggleMenu = () => {
    if (menuBtn.classList.contains('closed')) {
        menuBtn.innerHTML = `<i class="fa fa-chevron-circle-left"></i>`;
        menuBtn.classList.remove('closed');
        timelineWrapper.classList.add('show');
    }
    else {
        menuBtn.innerHTML = `<i class="fa fa-chevron-circle-right"></i>`
        menuBtn.classList.add('closed');
        timelineWrapper.classList.remove('show');
    }
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

menuBtn.addEventListener('click', toggleMenu);

// ON LOAD CALLS

const init = () => {
    getMyLocation();
    updateFavoriteLocationData();
    loadTimeLineItemIntoDOM();
}

//Update Favorite Location when DOM is ready; 
document.addEventListener('DOMContentLoaded', init);

//also refresh every 30 seconds
setInterval(() => {
    getMyLocation();
    updateFavoriteLocationData();
}, 30000);

//update Location Timeline every 2 minutes
setInterval(() => {
    loadTimeLineItemIntoDOM();
}, 120000);