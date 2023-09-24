async function search() {
    const phrase = document.querySelector('input[type="text"]').value;
    if(Boolean(phrase) == true) {
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${phrase}&limit=5&appid=${key}`);
        const data = await response.json();
        const ul = document.querySelector('ul');
        ul.innerHTML = '';
        for (let i = 0; i < data.length; i++) {
            const {name, lat, lon, country} = data[i];
            ul.innerHTML += `<li 
                    data-lat="${lat}" 
                    data-lon="${lon}" 
                    data-name="${name}">${name} <span>${country}</span></li>`
        }
    } else {
        const ul = document.querySelector('ul');
        document.getElementById('weather-data').style.display = 'none';
        ul.innerHTML = '';
    }
}

async function showWeather(lat, lon, city) {
    const respone = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`);
    const data = await respone.json();
    const icon = data.weather[0].icon;
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const humidity = Math.round(data.main.humidity);
    const wind = Math.round(data.wind.speed);
    

    document.getElementById('icon').src = `https://openweathermap.org/img/wn/${icon}@4x.png`;
    document.getElementById('city').innerHTML = city;
    document.getElementById('degrees').innerHTML = `${temp}<span>&#8451;</span>`;

    document.getElementById('windValue').innerHTML = `${wind}<span>km/h</span>`
    document.getElementById('feelsLikeValue').innerHTML = `${feelsLike}<span>&#8451;</span>`
    document.getElementById('humidityValue').innerHTML = `${humidity}<span>%</span>`

    document.getElementById('weather-data').style.display = 'flex';
}

document.body.addEventListener('click', ev => {
    const {lat, lon, name} = ev.target.dataset;
    if (!lat) {
        return;
    }
    showWeather(lat, lon, name);
})

const debouncedSearch = _.debounce(() => {
    search();
}, 600)

document.querySelector('input[type="text"]').addEventListener('keyup', debouncedSearch)