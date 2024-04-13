//Dom Elements
const weatherForm = document.querySelector(".weatherForm");
const myButton = document.getElementById("myButton");

//ApiKey
const apiKey = "84f57658aa07e0279bb4aefc961f5f98";

myButton.addEventListener("click", async event => {

    event.preventDefault();

    try{
        const {latitude, longitude} = await getLocation();
        const weatherData = await getWeatherData (latitude, longitude);
        console.log(weatherData);
        displayWeatherInfo(weatherData);
    }
    catch(error){
        console.error(error);
        displayError(error);
    }

});

async function getLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const { latitude, longitude } = position.coords;
                resolve({ latitude, longitude });
            },
            function(error) {
                reject(error);
            }
        );
    });
}

async function getWeatherData(latitude,longitude) {

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    const response = await fetch(apiUrl);

    if(!response.ok){
        throw new Error("Could not fetch data")
    }

    return await response.json();
}

function getDayofWeek(){
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
    return dayOfWeek;
}


function getDate() {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1
    const year = currentDate.getFullYear();
    return `${day}/${month}/${year}`;
}

function displayWeatherInfo(data){

    const descContainer = document.createElement("div");

    const { main:{temp, humidity},
	        name: city,
	        weather:[{description, id}],
	        wind:{speed}} = data;

    const cityDisplay = document.createElement("h1");
    const day = document.createElement("h2");
    const date = document.createElement("p");
    const emojiDisplay = document.createElement("p");
    const tempDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const windDisplay = document.createElement("p");

    cityDisplay.textContent = city;
    day.textContent = getDayofWeek();
    date.textContent = getDate();
    emojiDisplay.textContent = getWeatherEmoji(id);
    tempDisplay.textContent = `${((temp - 273.15)).toFixed(1)}°C`;
    descDisplay.textContent = formatText(description);
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    windDisplay.textContent = `Wind: ${speed}m/s`;

    cityDisplay.classList.add("location");
    day.classList.add("weekDay");
    date.classList.add("date");
    emojiDisplay.classList.add("weatherEmoji");
    tempDisplay.classList.add("tempDisplay");
    descDisplay.classList.add("weatherDesc");
    humidityDisplay.classList.add("humidityDisplay");
    windDisplay.classList.add("windDisplay");
    descContainer.classList.add("descContainer");

    weatherForm.appendChild(cityDisplay);
    weatherForm.appendChild(day);
    weatherForm.appendChild(date);
    weatherForm.appendChild(emojiDisplay);
    weatherForm.appendChild(tempDisplay);
    weatherForm.appendChild(descDisplay);
    weatherForm.appendChild(descContainer);
    descContainer.appendChild(humidityDisplay);
    descContainer.appendChild(windDisplay);

    myButton.style.display = "none";

}

function getWeatherEmoji(weatherId){

    switch(true){
        case (weatherId >= 200 && weatherId < 300):
            return "⛈️";
        case (weatherId >= 300 && weatherId < 400):
            return "🌩️";
        case (weatherId >= 500 && weatherId < 600):
            return "🌧️";
        case (weatherId >= 600 && weatherId < 700):
            return "🌨️";
        case (weatherId >= 700 && weatherId < 800):
            return "🌫️";
        case (weatherId === 800):
            return "☀️";
        case (weatherId >= 801 && weatherId < 810):
            return "☁️";
        default:
            return "🌈";
    }
}

function displayError(message){

    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");
    weatherForm.appendChild(errorDisplay);
}

function formatText(text){
    return text.charAt(0).toUpperCase() + text.slice(1);
}