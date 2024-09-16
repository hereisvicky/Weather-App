const userTab = document.querySelector('[data-userWeather]');
const searchTab = document.querySelector('[data-searchWeather]');
const userContainer = document.querySelector('.weather-container');

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loading = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//initially 
let oldTab = userTab;
const API_KEY = "68cddfbfc934d38ece27677271d8cccc";
oldTab.classList.add("current-tab");
getfromSessionStorage();


function switchTab(newTab){
  if(newTab != oldTab){
    oldTab.classList.remove("current-tab");
    oldTab = newTab;
    oldTab.classList.add("current-tab");

    if(!searchForm.classList.contains("active")){
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    }
    else{
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      //ab main your weather tab me aagya hu toh weather bhi display karna padega
      getfromSessionStorage();
    }
  }
}
userTab.addEventListener("click", ()=>{
  switchTab(userTab);
});
searchTab.addEventListener("click", ()=>{
  switchTab(searchTab);
});

//check if coordinates are already present in session storage
function getfromSessionStorage(){
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if(!localCoordinates){
    //agar local coordinates nahi mile
    grantAccessContainer.classList.add("active");
  }
  else{
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates){
  const {lat,lon} = coordinates;
  //make grantcontainer invisible
  grantAccessContainer.classList.remove("active");
  //make loader visible
  loading.classList.add("active");

  //api call
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data = await response.json();

    loading.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (error) {
    loading.classList.remove("active");
    //hw
  }
}

function renderWeatherInfo(weatherInfo){
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  //
  cityName.innerText = weatherInfo?.name;
  
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = `${weatherInfo?.main?.temp} °C`;
  windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    //show an alert for no geolocation
    console.log("Geolocation is not supported by this browser.");
  }
}

function showPosition(position){
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  }

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  let cityName = searchInput.value;

  if(cityName === ""){
    return;
  }
  else{
    fetchSearchWeatherInfo(cityName);
  }
})

async function fetchSearchWeatherInfo(city){
  loading.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try {
  
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        
  const data = await response.json();
  
    loading.classList.remove("active");
    userInfoContainer.classList.add("active");
    
    renderWeatherInfo(data);

  } catch (error) {
    
}

}




































// function renderWeatherInfo(data){
//     let newPara = document.createElement('p');
//     newPara.textContent = `${data?.main?.temp.toFixed(2)} C`;
    
//     document.body.appendChild(newPara);
// }

// async function fetchWeatherDetails(){

//     try {
//         const city = "goa";
        
        // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        
        // const data = await response.json();
//         console.log("Weather data ->" ,data);
        
//         renderWeatherInfo(data);
        
//     } catch (error) {
//         //handle error
//     }
// }

// function getLocation() {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(showPosition);
//     } else {
//       console.log("Geolocation is not supported by this browser.");
//     }
//   }

// function showPosition(position){
//     let lat = position.coords.latitude;
//     let longi = position.coords.longitude;

//     console.log(lat);
//     console.log(longi);
// }