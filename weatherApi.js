const fetch = require('node-fetch');

const getWeather = function(url) {
    return new Promise((resolve, reject) => {
        fetch(url).then(blob => blob.json()).then((json) => {
                resolve(json);
            })
            .catch(e => console.log(e))
    })
}

const buildWeather = function(json) {

    const weather = {
        avrTemp: "",
        clouds: "",
        wind: "",
        humidity: "",
        city: "",
    }

    weather.city = json.name;
    weather.avrTemp = Math.round(((json.main.temp_max - 273.15) + (json.main.temp_min - 273.15)) / 2);
    weather.humidity = json.main.humidity;
    weather.clouds = json.weather[0].description;
    weather.wind = Math.round(json.wind.speed * 3.6);

    return `

    Weather in *${weather.city}:*
    *Temprature*: ${weather.avrTemp} °C
    *Wind*: ${weather.wind} km/h
    *Humidity*: ${weather.humidity} %
    *Sky status*: ${weather.clouds}

    `;
}


module.exports = {
    finalWeather(city, code) {
        return getWeather(`https://api.openweathermap.org/data/2.5/weather?q=${city},${code}&APPID=f937eb1f1cdd5f16dccbc0fe7e956e0f`).then(weather => buildWeather(weather)).then(weather => weather)
    }
}
