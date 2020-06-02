$(document).ready(function (){
    let displayWeatherInfo = function (cityName) {
        let queryUrl1 = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=37f10959e63cca1227d7847c5a47a2eb";
        $.ajax({
            url: queryUrl1,
            method: "GET"
        }).then(function (response) {
            let longitude = response.coord.lon;
            let latitude = response.coord.lat;
            function getUVindex() {
                let queryURL = `https://api.openweathermap.org/data/2.5/uvi?appid=37f10959e63cca1227d7847c5a47a2eb&lat=${latitude}&lon=${longitude}`
                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).then(function (data) {
                    let currentUV = $("<p>").text(`UV Index: ${data.value} `);
                    $("#current-weather").append(currentUV);
                })
            }
            let currentDate = new Date(response.dt * 1000).toLocaleDateString("en-US")
            let currentIcon = $(`<img src="https://api.openweathermap.org/img/w/${response.weather[0].icon}.png"/>`)
            let currentCity = $(`<h4> ${response.name} (${currentDate}) </h4>`)
            currentCity.append(currentIcon);
            let currentTemp = $(`<p> Temperature: ${Math.floor((response.main.temp - 273.15) * 1.80 + 32)} F </p>`);
            let currentWindSpeed = $(`<p> Wind Speed: ${response.wind.speed} MPH </p>`);
            let currentHumidity = $(`<p> Humidity: ${response.main.humidity} % </p>`);
            $("#current-weather").empty();
            $("#current-weather").append(currentCity, currentTemp, currentHumidity, currentWindSpeed);
            getUVindex();
        });
        let queryUrl2 = "https://api.openweathermap.org/data/2.5/forecast/?q=" + cityName + "&units=imperial&APPID=37f10959e63cca1227d7847c5a47a2eb";
        $.ajax({
            url: queryUrl2,
            method: "GET"
        }).then(function (response) {
            let forecastArray = [];
            for (let i = 0; i < response.list.length; i += 8) {
                forecastArray.push(response.list[i]);
            };
            $("#five-day-forecast").empty();
            $.each(forecastArray, function (index, forecast) {
                let forecastDiv = $(`<div class="card p-2 text-white bg-primary"></div>`);
                let forecastDate = $("<h5>").text(new Date(forecast.dt * 1000).toLocaleDateString("en-US"));
                let forecastTemp = $(`<p> Temp:${forecast.main.temp} </p>`);
                let forecastIcon = $(`<img src="https://api.openweathermap.org/img/w/${forecast.weather[0].icon}.png"/>`)
                let forecastHumidity = $(`<p> Humidity:${forecast.main.humidity}% </p>`);
                forecastDiv.append(forecastDate, forecastTemp, forecastIcon, forecastHumidity);
                $("#five-day-forecast").append(forecastDiv);
            });
        })
    };
    let createCityButtons = function (cityName) {
        let searchHistory = `<button type="button" class="btn btn-light btn-block">${cityName}</button>`
        $(".search-history").append(searchHistory);
    };
    let cityArr = JSON.parse(localStorage.cityStorage) || [];
    let storeSearchHistory = function () {
        let chosenCity = $("#city").val().trim();
        cityArr.push(chosenCity);
        localStorage.cityStorage = JSON.stringify(cityArr);
    };
    let retrieveSearchHistory = function () {
        $.each(cityArr, function (index, city) {
            createCityButtons(city);
        });
    }
    $("button").on("click", function (event) {
        event.preventDefault()
        let chosenCity = $("#city").val().trim();
        displayWeatherInfo(chosenCity);
        storeSearchHistory();
    });
    $(".search-history").on("click", "button", function (event) {
        event.preventDefault();
        let city = $(this).text();
        displayWeatherInfo(city);
    })
    retrieveSearchHistory(); 
    displayWeatherInfo(cityArr[cityArr.length - 1])
    });