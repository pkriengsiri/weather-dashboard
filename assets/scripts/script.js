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
      // Print current weather data
      console.log(queryURL);
      console.log(response);
      
      // Create and append heading
      var h1El = $("<h1>");
      var date = new Date(response.dt * 1000);
      var dateString = "(" + date.toLocaleDateString() + ")";
      h1El.text(response.name+ " "+dateString);
      var imgEl = $("<img>");
      imgEl.attr(
        "src",
        "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png"
      );
      h1El.append(imgEl);
      $("#current-weather").append(h1El);

      //Create and append temperature
      var tempEl = $("<p>")
      tempEl.text("Temperature: "+response.main.temp + "°F");
      $("#current-weather").append(tempEl);
      
      //Create and append humidity
      var humidityEl = $("<p>")
      humidityEl.text("Humidity: "+response.main.humidity);
      $("#current-weather").append(humidityEl);

      //Create and append wind speed
      var windSpeedEl = $("<p>")
      windSpeedEl.text("Wind Speed "+response.wind.speed + " mph, Direction: " + response.wind.deg + "°");
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
      console.log(queryURL);

      var UVIndex = response.value;
      var UVEl = $("<p>")
      UVEl.text("UV Index: ");
      var UVSpan = $("<span>");
      UVSpan.text(UVIndex);
      UVSpan.addClass("shadow p-2");
      if(UVIndex < 3) {
        UVSpan.attr("id","uv-green");
      } else if (UVIndex < 6) {
        UVSpan.attr("id","uv-yellow");
      } else if (UVIndex < 8) {
        UVSpan.attr("id","uv-orange");
      } else if (UVIndex < 11) {
        UVSpan.attr("id","uv-red");
      } else {
        UVSpan.attr("id","uv-purple");
      }
      UVEl.append(UVSpan);
      $("#current-weather").append(UVEl);
      
    });
  }

  function displayForecast(lat, lon) {
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
      console.log(queryURL);
      console.log(response);
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
