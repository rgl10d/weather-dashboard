$(document).ready(function(){

    //DOM Variables
    var searchBtn = $("#search-button");
    //JS Variables
    var now = moment().format("MM/DD/YYYY");
    var nextFive = [moment().add(1, "days").format("MM/DD/YYYY"),
                    moment().add(2, "days").format("MM/DD/YYYY"),
                    moment().add(3, "days").format("MM/DD/YYYY"),
                    moment().add(4, "days").format("MM/DD/YYYY"),
                    moment().add(5, "days").format("MM/DD/YYYY")
                ];
    //Function Definitons
   
    //Function Calls
    
    //Event Listeners

    $(searchBtn).on("click", function(){
        var cityName = $("#search-bar").val();
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="
                       + cityName + "&units=imperial&appid=c683bc51fb96f85dead080d9ec469b07";
        
        
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            console.log(response);
            var iconImg = $("<img src=http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png>");
            var latitude = response.coord.lat;
            var longitude = response.coord.lon;
            var uvURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" 
                         + latitude + "&lon="
                         + longitude + "&appid=c683bc51fb96f85dead080d9ec469b07";
            var fiveDayURL = "http://api.openweathermap.org/data/2.5/forecast?q="
                             + cityName + "&units=imperial&appid=c683bc51fb96f85dead080d9ec469b07";
            console.log(iconImg);
            $("#city").html("<h3>" + response.name + " (" + now + ") " + iconImg + "</h3>");
            $("#temperature").text("Temperature: " + response.main.temp + " °F");
            $("#humidity").text("Humidity: " + response.main.humidity + "%");
            $("#wind-speed").text("Wind Speed: " + response.wind.speed + " MPH");
            $("#uv-index").text("UV Index: " + response);

            $.ajax({
                url: uvURL,
                method: "GET"
            }).then(function(response){
                $("#uv-index").text("UV Index: " + response.value);
            })

            $.ajax({
                url: fiveDayURL,
                method: "GET"
            }).then(function(response){
                console.log(response);
                function forecastRender(){
                    for(var i = 0; i < 5; i++){
                        var boxID = "box" + i;
                        var forecastRow = $("#five-day");
                        var forecastBox = $("<div>")
                        .attr({
                            "class": "forecast",
                            "id": boxID
                        });
                        var forecastDate = $("<h5>").attr("class", "forecast-date").text(nextFive[i]);
                        // var forecastIcon;
                        var forecastTemp = $("<p>").attr("class", "forecast-details").text("Temperature: " + response.list[i].main.temp + " °F");
                        var forecastHumid = $("<p>").attr("class", "forecast-details").text("Humidity: " + response.list[i].main.humidity + "%");
            
            
                        forecastRow.append(forecastBox);
                        forecastBox.append(forecastDate);
                        forecastBox.append(forecastTemp);
                        forecastBox.append(forecastHumid);
            
                    }
                }


                forecastRender();
            })

            

        })

    
    })


})