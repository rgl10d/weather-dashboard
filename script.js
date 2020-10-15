$(document).ready(function(){
    var searchBtn = $("#search-button");
    var searchAside = $("#aside-row");
    var now = moment().format("MM/DD/YYYY");
    var nextFive = [moment().add(1, "days").format("MM/DD/YYYY"),
                    moment().add(2, "days").format("MM/DD/YYYY"),
                    moment().add(3, "days").format("MM/DD/YYYY"),
                    moment().add(4, "days").format("MM/DD/YYYY"),
                    moment().add(5, "days").format("MM/DD/YYYY")
                    ];

    //On click event on the search button
    $(searchBtn).on("click", function getweather (){
        var cityName = $("#search-bar").val();
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="
                       + cityName + "&units=imperial&appid=c683bc51fb96f85dead080d9ec469b07";
        localStorage.setItem("City", cityName);

        //Creates buttons from previous search entries
        var pastSearchEl = $("<div>").attr("class", "col-sm-12");
        var pastSearchBtn = $("<button>").attr("class", "past-search").text(cityName);
        searchAside.append(pastSearchEl);
        pastSearchEl.append(pastSearchBtn);

        //AJAX API call to retrieves the weather data
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){

            //Defining variables
            var iconImg = $("<img src= https://openweathermap.org/img/wn/" + response.weather[0].icon + ".png>");
            var latitude = response.coord.lat;
            var longitude = response.coord.lon;
            var uvURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" 
                         + latitude + "&lon="
                         + longitude + "&appid=c683bc51fb96f85dead080d9ec469b07";
            var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?q="
                             + cityName + "&units=imperial&appid=c683bc51fb96f85dead080d9ec469b07";
            
            //Populating the elements with the searched city name's weather
            $("#city-name").html("<h3>" + response.name + " (" + now + ")</h3>");
            $("#city-name").append(iconImg);
            $("#temperature").text("Temperature: " + response.main.temp + " °F");
            $("#humidity").text("Humidity: " + response.main.humidity + "%");
            $("#wind-speed").text("Wind Speed: " + response.wind.speed + " MPH");

            $.ajax({
                url: uvURL,
                method: "GET"
            }).then(function(response){
                $("#uv-index").html("UV Index: <span id='uv-num'>" + response.value + "</span>");
                var uvParse = JSON.parse(response.value);

                // If else statement to determine background color of the uv index
                if(uvParse < 3){
                    $("#uv-num").css("background-color", "green")
                } else if (uvParse >= 3.00 && uvParse < 6.00){
                    $("#uv-num").css("background-color", "yellow")
                } else if (uvParse >= 6.00 && uvParse < 8.00){
                    $("#uv-num").css("background-color", "orange")
                } else if (uvParse >= 8.00 && uvParse <= 10.00){
                    $("#uv-num").css("background-color", "red")
                }
            })


            //Five Day Forecast AJAX API call
            $.ajax({
                url: fiveDayURL,
                method: "GET"
            }).then(function(response){

                //Clears out the boxes when another search occurs
                $("#five-day").empty();

                //The "5-Day Forecast" text
                var forecastRow = $("#five-day");
                var fiveTitleEl = $("<div>").attr({
                    "class": "col-sm-12",
                    "id": "five-day-title"
                });
                var fiveHeader = $("<h4>").text("5-Day Forecast:");

                forecastRow.append(fiveTitleEl);
                fiveTitleEl.append(fiveHeader);

                //Function to create the forecast boxes
                function forecastRender(){
                    for(var i = 0; i < 5; i++){
                        var boxID = "box" + i;
                        var forecastBox = $("<div>")
                        .attr({
                            "class": "forecast-box",
                            "id": boxID
                        });
                        var forecastDate = $("<h5>").attr("class", "forecast-date").text(nextFive[i]);
                        var forecastIcon = $("<img src=http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + ".png>");
                        var forecastTemp = $("<p>").attr("class", "forecast-details").text("Temp: " + response.list[i].main.temp + " °F");
                        var forecastHumid = $("<p>").attr("class", "forecast-details").text("Humidity: " + response.list[i].main.humidity + "%");
            
            
                        forecastRow.append(forecastBox);
                        forecastBox.append(forecastDate);
                        forecastBox.append(forecastIcon);
                        forecastBox.append(forecastTemp);
                        forecastBox.append(forecastHumid);
            
                    }
                }
                //Forecast box function call
                forecastRender();
            })
        })
    })

    $()
})