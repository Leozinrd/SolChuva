let isCelsius = true;

function convertTemperature(value, toCelsius) {
    if (toCelsius) {
        return (value - 32) * 5 / 9; // Fahrenheit para Celsius
    } else {
        return (value * 9 / 5) + 32; // Celsius para Fahrenheit
    }
}

function toggleTemperatureUnit() {
    isCelsius = !isCelsius;

    const temperatureElements = ['temperature', 'tempmax', 'tempmin', 'feelslike'];
    temperatureElements.forEach(id => {
        const element = document.getElementById(id);
        const currentValue = parseFloat(element.innerText);
        const newValue = convertTemperature(currentValue, isCelsius);
        element.innerText = Math.round(newValue) + (isCelsius ? 'ºC' : 'ºF');
    });

    const forecastElements = document.querySelectorAll('.forecast-temp');
    forecastElements.forEach(element => {
        const currentValue = parseFloat(element.innerText);
        const newValue = convertTemperature(currentValue, isCelsius);
        element.innerText = Math.round(newValue) + (isCelsius ? 'ºC' : 'ºF');
    });

    const windspeedElement = document.getElementById('windspeed');
    const currentWindspeed = parseFloat(windspeedElement.innerText);
    if (isCelsius) {
        windspeedElement.innerText = Math.round(currentWindspeed * 1.60934) + ' km/h'; // milhas/h para km/h
    } else {
        windspeedElement.innerText = Math.round(currentWindspeed / 1.60934) + ' mph'; // km/h para milhas/h
    }
}

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

            updateForecast(data.daily);

            console.log(data);
        })

        .catch(error => console.log(error));
}

function updateForecast(dailyForecast) {
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';

    let displayedDays = 0; // Variável para controlar o número de dias exibidos

    dailyForecast.forEach((day, index) => {
        if (displayedDays >= 5) return; // Pára após 5 dias exibidos

        if (index === 0) return; // Pula o primeiro dia, pois é o dia atual

        const forecastElement = document.createElement('div');
        forecastElement.classList.add('Forecast');

        const date = new Date(day.dt * 1000);
        const options = { weekday: 'short', day: 'numeric', month: 'numeric' };
        const formattedDate = date.toLocaleDateString('pt-BR', options);

        const tempMax = isCelsius ? Math.round(day.temp.max) : Math.round(convertTemperature(day.temp.max, false));
        const tempMin = isCelsius ? Math.round(day.temp.min) : Math.round(convertTemperature(day.temp.min, false));

        forecastElement.innerHTML = `
            <p>${formattedDate}</p>
            <p class="forecast-temp">${tempMax}${isCelsius ? 'ºC' : 'ºF'} / ${tempMin}${isCelsius ? 'ºC' : 'ºF'}</p>
            <p>${day.weather[0].description}</p>
        `;

        forecastContainer.appendChild(forecastElement);
        displayedDays++; // Incrementa o contador de dias exibidos
    });
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

document.getElementById('toggleUnit').addEventListener('click', toggleTemperatureUnit);

document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Isso impede que a página seja recarregada
    var city = document.querySelector('.SearchInput input[type="search"]').value;
    getLatLong(city);
});

document.getElementById('searchInput').addEventListener('focus', function () {
    document.getElementById('searchIcon').style.display = 'none'; // Esconde a imagem quando o input está focado
});

document.getElementById('searchInput').addEventListener('blur', function () {
    document.getElementById('searchIcon').style.display = 'block'; // Mostra a imagem quando o input perde o foco
});


getLatLong('Fortaleza')