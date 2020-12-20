$(document).ready(function () {
  // DOM VARIABLES

  // JS VARIABLES
  var APIKey = "c120eb4512edae3031f1a647615f6499";
  var city = "Atlanta";
  var currentLat;
  var currentLong;
  var searchedCities = [];

  // FUNCTION DEFINITIONS
  // Initialize the page

  // Display the current weather
  function displayCurrentWeather() {

    $("#current-weather").empty();
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=imperial&appid=" +
      APIKey;

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      //Unhide the section
      $("#current-weather").removeClass("d-none");

      // Add city to array or reorder
      addCityToList(city);
      
      // Print current weather data
      // Create and append heading
      var h1El = $("<h1>");
      var date = new Date(response.dt * 1000);
      var dateString = "(" + date.toLocaleDateString() + ")";
      h1El.text(response.name + " " + dateString);
      var imgEl = $("<img>");
      imgEl.attr(
        "src",
        "http://openweathermap.org/img/wn/" +
          response.weather[0].icon +
          "@2x.png"
      );
      h1El.append(imgEl);
      $("#current-weather").append(h1El);
      var hrEL = $("<hr>");
      $("#current-weather").append(hrEL);

      //Create and append temperature
      var tempEl = $("<p>");
      tempEl.text("Temperature: " + response.main.temp + "°F");
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

      $("#temperature").text(response.main.temp + "°F");
      $("#humidity").text(response.main.humidity);
      $("#wind-speed").text(
        response.wind.speed + " mph, Direction: " + response.wind.deg + "°"
      );
      getUVIndex(response.coord.lat, response.coord.lon);
      displayForecast(response.coord.lat, response.coord.lon);
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
      var UVIndex = response.value;
      var UVEl = $("<p>");
      UVEl.text("UV Index: ");
      var UVSpan = $("<span>");
      UVSpan.text(UVIndex);
      UVSpan.addClass("shadow p-2");
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

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      //add the title row
      // add the h1
      // append the title row
      var titleRow = $("<div>");
      titleRow.addClass("row");
      var h1El = $("<h1>");
      h1El.text("5-day Forecast:");
      titleRow.append(h1El);
      $("#forecast-section").append(titleRow);

      // add the second row
      var forecastRow = $("<div>");
      forecastRow.addClass("row");

      // In a for loop
      for (var i = 1; i < 6; i++) {
        //Create the column
        var colEl = $("<div>");
        colEl.addClass("col bg-primary mx-2 text-white rounded");
        //Create and append the h3
        var date = new Date(response.daily[i].dt * 1000);
        var h3El = $("<h3>").text(date.toLocaleDateString());
        colEl.append(h3El);
        //Create and append the img icon
        var imgEl = $("<img>");
        imgEl.attr(
          "src",
          "http://openweathermap.org/img/wn/" +
            response.daily[i].weather[0].icon +
            "@2x.png"
        );
        colEl.append(imgEl);
        //Create and append the temp <p>
        var tempMaxEl = $("<p>");
        tempMaxEl.text("High: "+response.daily[i].temp.max + "°F")
        colEl.append(tempMaxEl);
        var tempMinEl = $("<p>");
        tempMinEl.text("Low: "+response.daily[i].temp.min + "°F")
        colEl.append(tempMinEl);
        //Create and append the humidity <p>
        humidityEl = $("<p>");
        humidityEl.text("Humidity: "+response.daily[i].humidity)
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

  function addCityToList(city) {
    //Check to see if the city is in the list
    if(searchedCities.indexOf(city.toLowerCase()) === -1) {
      // Check to see if the list has ten 10 entries
      if(searchedCities.length === 10) {
        // Remove the last item then add the current city to the beginning of the array
        searchedCities.pop();
        searchedCities.unshift(city.toLowerCase());
      } else {
        searchedCities.unshift(city.toLowerCase());
      }
    } else {
      // Remove the item from the list and put it at the beginning
      var index = searchedCities.indexOf(city.toLowerCase());
      searchedCities.splice(index,1);
      searchedCities.unshift(city.toLowerCase());
    }
    console.log(searchedCities);
  }



  // FUNCTION CALLS
  //displayCurrentWeather();

  // EVENT HANDLERS
  $("#search").on("submit",searchCity);

});

// GIVEN a weather dashboard with form inputs
//      Start with with the weather dashboard display loaded on html
//      Display has:
//      -Navbar
//      -Two columns
//          -Sidebar with two row (search for city/ list of cities)
//          -Main with two rows (current weather for displayed city/ five day forecast)
//
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
//      Create a function to handle the search
//          Create and id for the search field and search button
//          Create and event listener for form submission (on the form or the button??)
//          Create a callback function for the event listener
//          Prevent default submit behavior
//          Get the text from the input field
//          Store the text in an array of previously searched cities
//          Store the text in localStorage as the last searched city
//
//
//
//
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
//
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
//
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
//      Create a function to display the five-day forecast
//          Generate the query URL
//          Get the object values for each forecast block
//
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
//      Create a text area and button
//      Take input from text area and store in array for searched cities
//      Check to make sure item is not already in array (toLowerCase!!!)
//      Call display weather with user input as parameter
//      Create new button for search history with user input as the text
//      Prepend the button
//      For search list:
//          Create class for buttons
//          Create an event listener to look for a click on these buttons
//          Call display weather function with the city
// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast
//      Array of cities are stored as a single key/ value in local storage
//      When page is loaded, if there's nothing in local storage set
//      ex: var storedCities = JSON.parse(localStorage.getItem("something")) || [];
//      Call function to create the buttons:
//          Check the length of the array and remove items if limit reached
//          .shift() to remove first item, .push() adds to end, .pop() removes last element, unshift() adds to the beginning
//
