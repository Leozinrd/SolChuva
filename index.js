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

function getWeather(lat, lon) {
    fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=f3e92ada55e1ce50d221bc184ed88bfb`)
        .then(response => response.json())
        .then(data => {

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

function getLatLong(city) {
    fetch(`https://geocode.maps.co/search?q=${city}&api_key=6630683e00c08787426813fzr4f09d4`)
        .then(response => response.json())
        .then(data => {

            const lat = data[0].lat;
            const lon = data[0].lon;
            console.log(data[0]);

            const displayName = data[0].display_name.split(',')[0];
            getUpdateComponents('city', displayName);

            getWeather(lat, lon);
        })
        .catch(error => console.log(error));
}

const searchButton = document.querySelector('.SearchInput img');
searchButton.addEventListener('click', () => {
    const city = document.querySelector('.SearchInput input').value;
    getLatLong(city);
});
