const units = {
    'temperature': `ºC`,
    'windspeed': `km/h`,
    'humidity': `%`
}

const temperatureIds = ['temperature', 'tempmax', 'tempmin', 'feelslike'];

function getUpdateComponents(id, value) {
    const unit = temperatureIds.includes(id) ? units['temperature'] : units[id] ? units[id] : '';

    if (temperatureIds.includes(id)) {
        value = Math.round(value);
    }

    if (id === 'description') {
        value = value.charAt(0).toUpperCase() + value.slice(1);
    }
    document.getElementById(id).innerText = value + unit;
}

function getWeather() {
    fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=-3.71&lon=-38.54&units=metric&lang=pt_br&appid=f3e92ada55e1ce50d221bc184ed88bfb`)
        .then(response => response.json())
        .then(data => {

            getUpdateComponents('timezone', data.timezone);
            getUpdateComponents('temperature', data.current.temp);
            getUpdateComponents('description', data.current.weather[0].description);
            getUpdateComponents('tempmax', data.daily[0].temp.max);
            getUpdateComponents('tempmin', data.daily[0].temp.min);
            getUpdateComponents('windspeed', data.current.wind_speed);
            getUpdateComponents('feelslike', data.current.feels_like);
            getUpdateComponents('humidity', data.current.humidity);

            console.log(data);
        })

        .catch(error => console.log(error));
}

const weatherButton = document.getElementById('PressHere').addEventListener('click', getWeather);
