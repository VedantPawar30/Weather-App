const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const errorContainer = document.querySelector(".error-container");
const apiKey = "d5c9dd7c6fde8f251b7f149850e6bae8";

for (const sheet of document.styleSheets) {
  try {
    const rules = sheet.cssRules;
    // Do something with rules
  } catch (e) {
    if (e.name !== 'SecurityError') throw e;
    // Skip cross-origin stylesheets
  }
}
let currentTab = userTab;
currentTab.classList.add("current-tab");
getFromSessionStorage();


//fucntion to switch tabs

function switchTab(selectedTab){
    if(selectedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = selectedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            errorContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            errorContainer.classList.remove("active");
            getFromSessionStorage(); //to check local storage for coordinates
        }
    }
    
    
    
}
userTab.addEventListener("click",()=>{
    switchTab(userTab);
})

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
})

function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
        
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    errorContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        if(!response.ok) throw new Error("Weather data not found");
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        errorContainer.classList.add("active");
        userInfoContainer.classList.remove("active");
        console.error(err.message);
    }
}

function renderWeatherInfo(weatherInfo){
    // we have to fetch elements
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDescription]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    cityName.textContent = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/w320/${weatherInfo?.sys?.country?.toLowerCase()}.png`;
    desc.textContent = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.textContent = `${weatherInfo?.main?.temp}   °C`;
    windSpeed.textContent = `${weatherInfo?.wind?.speed} m/s`;
    humidity.textContent = `${weatherInfo?.main?.humidity} %`;
    cloudiness.textContent = `${weatherInfo?.clouds?.all}  %`;

}
const grantAccessBtn = document.querySelector("[data-grantAccess]");
function showPosition(position){
    const userCoord={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoord));
    fetchUserWeatherInfo(userCoord);
    console.log(userCoord);
}
grantAccessBtn.addEventListener("click",()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Geolocation is not supported by this browser.");
    }
})
const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(searchInput.value === "") return;

    fetchSearhWeatherInfo(searchInput.value);

})

async function fetchSearhWeatherInfo(city){
    loadingScreen.classList.add("active");
    errorContainer.classList.remove("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        if(!response.ok) throw new Error("City not found");
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        errorContainer.classList.add("active");
        userInfoContainer.classList.remove("active");
        console.error(err.message);
    }
}




