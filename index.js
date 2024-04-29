function getWeather () {
    fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=-3.71&lon=-38.54&units=metric&lang=pt_br&appid=8bd7f7f371168f5aaac42a9e77876f79`)
        .then(response => response.json())
        .then(data => {

            const timezone = document.getElementById('timezone')
            timezone.innerText = data.timezone; 

            const temperature = document.getElementById('temperature')
            temperature.innerText = data.current.temp;

            const description = document.getElementById('description')
            description.innerText = data.current.weather[0].description;

            const tempmax = document.getElementById('tempmax')
            tempmax.innerText = data.daily[0].temp.max;

            const tempmin = document.getElementById('tempmin')
            tempmin.innerText = data.daily[0].temp.min;

            const windspeed = document.getElementById('windspeed')
            windspeed.innerText = data.current.wind_speed;

            const feelslike = document.getElementById('feelslike')
            feelslike.innerText = data.current.feels_like;

            const humidity = document.getElementById('humidity')
            humidity.innerText = data.current.humidity;

            console.log(data)
        })

        .catch(error => console.log(error))
}

const weatherButton = document.getElementById('PressHere').addEventListener('click', getWeather);