$(document).ready(function () {
  // DOM VARIABLES

  // JS VARIABLES
  var APIKey = "c120eb4512edae3031f1a647615f6499";
  var city = "";
  var currentLat;
  var currentLong;
  var searchedCities = JSON.parse(localStorage.getItem("searchedCities")) || [];

  // FUNCTION DEFINITIONS
  // Initialize the page
  function init() {
    if (searchedCities[0] !== undefined) {
      city = searchedCities[0];
      displayCurrentWeather();
    }
  }

  // Display the current weather
  function displayCurrentWeather() {
    $("#current-weather").removeClass("d-none");
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=imperial&appid=" +
      APIKey;

    // Perform the API query
      $.ajax({
      url: queryURL,
      method: "GET",
    }).then(
      function (response) {
        //Empty the section
        $("#current-weather").empty();

        //Clear 404 errors
        $("#message-404").addClass("d-none");

        // Add city to array or reorder, the display the buttons
        addCityToList(city);
        displaySearchButtons();

        // Add array to localStorage
        localStorage.setItem("searchedCities", JSON.stringify(searchedCities));

        // Print current weather data
        // Create and append heading
        var h1El = $("<h1>");
        var date = new Date(response.dt * 1000);
        var dateString = "(" + date.toLocaleDateString() + ")";
        h1El.text(response.name + " " + dateString);
        var imgEl = $("<img>");
        imgEl.attr(
          "src",
          "https://openweathermap.org/img/wn/" +
            response.weather[0].icon +
            "@2x.png"
        );
        h1El.append(imgEl);
        $("#current-weather").append(h1El);
        var hrEL = $("<hr>");
        $("#current-weather").append(hrEL);

        //Create and append temperature
        var tempEl = $("<p>");
        tempEl.text("Temperature: " + Math.floor(response.main.temp) + "°F");
        $("#current-weather").append(tempEl);

        //Create and append humidity
        var humidityEl = $("<p>");
        humidityEl.text("Humidity: " + response.main.humidity);
        $("#current-weather").append(humidityEl);

        //Create and append wind speed
        var windSpeedEl = $("<p>");
        windSpeedEl.text(
          "Wind Speed " +
            response.wind.speed +
            " mph, Direction: " +
            response.wind.deg +
            "°"
        );
        $("#current-weather").append(windSpeedEl);

        //Call function to create and append UV index
        getUVIndex(response.coord.lat, response.coord.lon);
        displayForecast(response.coord.lat, response.coord.lon);
      },
      function (response) {
        var responseText = JSON.parse(response.responseText);
        if (responseText.cod === "404") {
          $("#message-404").removeClass("d-none");
        }
      }
    );
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

    // Perform the API query
      $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      var UVIndex = response.value;
      var UVEl = $("<p>");
      UVEl.text("UV Index: ");
      var UVSpan = $("<span>");
      UVSpan.text(UVIndex);
      UVSpan.addClass("p-2 rounded");
      if (UVIndex < 3) {
        UVSpan.attr("id", "uv-green");
      } else if (UVIndex < 6) {
        UVSpan.attr("id", "uv-yellow");
      } else if (UVIndex < 8) {
        UVSpan.attr("id", "uv-orange");
      } else if (UVIndex < 11) {
        UVSpan.attr("id", "uv-red");
      } else {
        UVSpan.attr("id", "uv-purple");
      }
      UVEl.append(UVSpan);
      $("#current-weather").append(UVEl);
    });
  }

  function displayForecast(lat, lon) {
    // Clear the div
    $("#forecast-section").empty();

    var queryURL =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&exclude=current,minutely,hourly,alerts&units=imperial&appid=" +
      APIKey;

    // Perform the API query  
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      // Create and append the title row
      // Create and append the h1
      var titleRow = $("<div>");
      titleRow.addClass("row");
      var h1El = $("<h2>");
      h1El.text("5-day Forecast:");
      titleRow.append(h1El);
      $("#forecast-section").append(titleRow);

      // Add the second row
      var forecastRow = $("<div>");
      forecastRow.addClass("row");

      // In a for loop
      for (var i = 1; i < 6; i++) {
        // Create the column
        var colEl = $("<div>");
        colEl.addClass("col bg-primary mx-2 text-white shadow rounded mb-2");
        colEl.attr("style","max-width: 10.5rem");
        // Create and append the h3
        var date = new Date(response.daily[i].dt * 1000);
        var h3El = $("<h3>").text(date.toLocaleDateString());
        colEl.append(h3El);
        // Create and append the img icon
        var imgEl = $("<img>");
        imgEl.attr(
          "src",
          "https://openweathermap.org/img/wn/" +
            response.daily[i].weather[0].icon +
            ".png"
        );
        colEl.append(imgEl);
        //Create and append the temp <p>
        var tempMaxEl = $("<p>");
        tempMaxEl.text("High: " + Math.floor(response.daily[i].temp.max) + "°F");
        colEl.append(tempMaxEl);
        var tempMinEl = $("<p>");
        tempMinEl.text("Low: " + Math.floor(response.daily[i].temp.min) + "°F");
        colEl.append(tempMinEl);
        //Create and append the humidity <p>
        humidityEl = $("<p>");
        humidityEl.text("Humidity: " + response.daily[i].humidity);
        colEl.append(humidityEl);
        //Append the column
        forecastRow.append(colEl);
      }

      //Append the row
      $("#forecast-section").append(forecastRow);
    });
  }

  function searchCity(event) {
    event.preventDefault();
    city = $("#search-input").val();
    displayCurrentWeather();
  }

  // Add new cities to the searchedCities array
  function addCityToList(city) {
    //Check to see if the city is in the list
    if (searchedCities.indexOf(city.toLowerCase()) === -1) {
      // Check to see if the list has ten 10 entries
      if (searchedCities.length === 10) {
        // Remove the last item then add the current city to the beginning of the array
        searchedCities.pop();
        searchedCities.unshift(city.toLowerCase());
      } else {
        searchedCities.unshift(city.toLowerCase());
      }
    } else {
      // Remove the item from the list and put it at the beginning
      var index = searchedCities.indexOf(city.toLowerCase());
      searchedCities.splice(index, 1);
      searchedCities.unshift(city.toLowerCase());
    }
  }

  // Display the previous searches section
  function displaySearchButtons() {
    // Unhide the section
    $("#previous-searches").removeClass("d-none");
    $("#search-buttons").empty();

    // Print the list
    for (var i = 0; i < searchedCities.length; i++) {
      // Create button
      var buttonEl = $("<button>");
      // Add button parameter and text
      buttonEl.attr("type", "button");
      buttonEl.addClass("list-group-item list-group-item-action");
      //Convert lowercase city names to title case
      var city = searchedCities[i];
      var citySplit = city.split(" ");
      for (var j = 0; j < citySplit.length; j++) {
        citySplit[j] = citySplit[j][0].toUpperCase() + citySplit[j].substr(1);
      }
      city = citySplit.join(" ");
      buttonEl.text(city);
      // Append the button
      $("#search-buttons").append(buttonEl);
    }
  }

  function displayPreviousSearch() {
    city = $(this)[0].innerText;
    displayCurrentWeather();
  }

  // FUNCTION CALLS
  init();

  // EVENT HANDLERS
  $("#search").on("submit", searchCity);
  $("#search-buttons").on("click", "button", displayPreviousSearch);
});
