$(document).ready(function () {
  // DOM VARIABLES

  // JS VARIABLES
  var APIKey = "c120eb4512edae3031f1a647615f6499";
  var city = "Atlanta";
  var currentLat;
  var currentLong;

  // FUNCTION DEFINITIONS
  // Initialize the page

  // Display the current weather
  function displayCurrentWeather() {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=imperial&appid=" +
      APIKey;

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      // Print current weather data
      $("#city-name").text(response.name);
      $("#temperature").text(response.main.temp + "°F");
      $("#humidity").text(response.main.humidity);
      $("#wind-speed").text(
        response.wind.speed + " mph, Direction: " + response.wind.deg + "°"
      );
      getUVIndex(response.coord.lat, response.coord.lon);
    });
  }

  // Get and set the UV index
  function getUVIndex(lat, lon) {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/uvi?lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=" +
      APIKey;

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(queryURL);
      $("#uv-index").text(response.value);
    });
  }

  // FUNCTION CALLS
  displayCurrentWeather();

  // EVENT HANDLERS
});

// GIVEN a weather dashboard with form inputs
//      Start with with the weather dashboard display loaded on html
//      Display has:
//      -Navbar
//      -Sidebar with two row (search for city/ list of cities)
//      -Main with two rows (current weather for displayed city/ five day forecast)
//
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
//
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
//
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
//
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
//
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
//
// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast
