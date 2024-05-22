let weather = {
    apiKey: "aba6ff9d6de967d5eac6fd79114693cc",
    fetchWeather: function (city) {
        fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`
        )
        .then((response) => {
            if (!response.ok) {
                alert("No weather data found.");
                throw new Error("No weather data found.");
            }
            return response.json();
        })
        .then((data) => this.displayWeather(data))
        .catch((error) => console.error("Error:", error));
    },
    displayWeather: function (data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;

        // Update weather information display
        document.getElementById("weatherInfo").innerHTML = `
            <h2>${name}</h2>
            <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${description}">
            <p>${description}</p>
            <p>Temperature: ${temp}°C</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${speed} m/s</p>
        `;

        // Change background based on weather condition
        this.changeBackground(description);
    },
    changeBackground: function (description) {
        let backgroundUrl;

        // Set background image based on weather description
        if (description.includes("clear")) {
            backgroundUrl = "url('clear.jpg')";
        } else if (description.includes("clouds")) {
            backgroundUrl = "url('cloudy.jpg')";
        } else if (description.includes("rain") || description.includes("drizzle")) {
            backgroundUrl = "url('rainy.jpg')";
        } else if (description.includes("thunderstorm")) {
            backgroundUrl = "url('thunder.jpg')";
        } else if (description.includes("snow")) {
            backgroundUrl = "url('snowy.jpg')";
        } else {
            backgroundUrl = "linear-gradient(to right, #7f7f7f, #beb20c)"; // Default background
        }

        document.body.style.backgroundImage = backgroundUrl;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
    },
    search: function () {
        this.fetchWeather(document.getElementById("locationInput").value);
    }
};

document.getElementById("searchLocation").addEventListener("click", function () {
    weather.search();
});

document.getElementById("locationInput").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        weather.search();
    }
});

document.getElementById("getLocation").addEventListener("click", function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${weather.apiKey}`
            )
            .then((response) => {
                if (!response.ok) {
                    alert("No weather data found.");
                    throw new Error("No weather data found.");
                }
                return response.json();
            })
            .then((data) => weather.displayWeather(data))
            .catch((error) => console.error("Error:", error));
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});
