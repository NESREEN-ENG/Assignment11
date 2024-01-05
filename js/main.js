// Displaying data
let content = document.getElementById('content');

function get_day(index) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    return daysOfWeek[index];
}

function get_month(index) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[index];
}

function get_wind_direction(char) {
    const directions = ["East", "North", "South", "West"];
    
    for (let index = 0; index < 4; index++){
      
        if (directions[index].startsWith(char)) {
            console.log(char);
            return directions[index];
        }
    }
}

function display_today(location, info) {
    let date = new Date();
    content.innerHTML = `<div class="today item col col-lg-4 text-white px-0">
                        <div class="header d-flex justify-content-between fs-5 px-2 py-2">
                            <span class="day">${get_day(date.getDay())}</span>
                            <span class="date">${date.getDay()} ${get_month(date.getMonth())}</span>
                        </div>

                        <div class="body px-4  py-2">
                        <div class="location fs-3 fw-bolder"><i class="fa-solid fa-location-dot"></i> ${location.name}</div>
                        <div class="temp fs-1 fw-bold d-flex flex-wrap gap-3 align-items-center ">
                            <span class="degree">${info.temp_c} &#8451;</span>
                            <figure>
                                <img src="${info.condition.icon}" alt="image describes the weather status " class="w-25 ">
                            </figure>
                            </div>
                        
                        <span class="status fs-5 fw-bold">${info.condition.text}</span>
                        </div>

                        <div class="footer px-2 py-2 text-black d-flex justify-content-center gap-5 ">
                            <span class="fs-5">
                            <i class="fa-solid fa-droplet"></i>
                                ${info.humidity}%
                            </span>
                            <span class="fs-5 ">
                                <i class="fa-solid fa-wind"></i>
                                ${info.wind_kph}Km/h
                            </span>

                            <span class="fs-5">
                                <i class="fa-solid fa-location-crosshairs"></i>
                                ${get_wind_direction(info.wind_dir[0])}
                            </span>

                        </div>
                    </div>`;
}

function display_other_days(forecastDay) {
    let days = '';

    for (let index = 1; index < forecastDay.length; index++){
        let date = new Date(forecastDay[index].date);

        days += ` <div class="tomorrow item col col-lg-4 text-white px-0 text-center d-flex flex-column">
        <div class="header fs-5 px-2 py-2 ">
            <div class="day">${get_day(date.getDay())}</div>
        </div>

        <div class="body px-2 py-2 flex-grow-1 d-flex flex-column justify-content-center align-items-center ">
         
           <div class="temp-max fs-1 fw-bold">${forecastDay[index].day.maxtemp_c} &#8451; </div>
           <div class="temp-min fs-5 fs-bold"> ${forecastDay[index].day.mintemp_c} &#8451;</div>
           <figure class="my-3">
            <img src="${forecastDay[index].day.condition.icon}" alt="image descripes the weather status " class="w-25">
           </figure>

           <div class="status fs-5 fw-bold">${forecastDay[index].day.condition.text}</div>
        </div>
    </div>`;
    }

    content.innerHTML += days;
}


// Calling the weather API to get the data

async function call_API(location) {
    const API_KEY = '35fbebe3f7f6481ab90130505240201';
    const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(location)}&days=3&aqi=no&alerts=no`
    let response = await fetch(API_URL);

    if (response.status == 200) {
        let data = await response.json();

        display_today(data.location, data.current);
        display_other_days(data.forecast.forecastday);
    }
    else {
        throw ("API Calling Failed");
    }
    
}


// Handling searching for a location
const searchInput = document.getElementById('search-input');

searchInput.addEventListener('keyup', function (e) {
    let search = this.value.replace(/\W/g, '');
    if(search)call_API(search);
});

// Getting the user location
let userLocation;
async function get_user_location() {
    return new Promise((resolve)=>{
        async function show_position(position) {
            const latitude = position.coords.latitude,
                longitude = position.coords.longitude;
        
        
            const LOCATION_API = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`;
            let response = await fetch(LOCATION_API);
            
            if (response.status == 200) {
                let data = await response.json();
           
                userLocation = data.city;
                resolve();
            }
           
         
        }
        
        function show_error(error) {
            throw error;
        }
        
        if ("geolocation" in navigator) {
           navigator.geolocation.watchPosition(show_position, show_error);
        }
   })
  
}

get_user_location().then(function () {
    console.log(userLocation);
    call_API(userLocation.replace(/\W/g,' '));
});


