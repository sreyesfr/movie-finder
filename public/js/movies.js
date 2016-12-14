//Using gracenote OnConnect Data Delivery API
//Link: http://developer.tmsapi.com/docs/data_v1_1/

$(function() {   // when document is ready
    $("#f1").submit(getMovies);
});

//Utility function for writing alert messages
function writeAlertMessage(result) {
  $("#message").css('color', 'green');
  $("#message").empty();
  $("#message").append("<p>"+result+"</p>");
}

//Gets movies from the API
function getMovies() {
    // construct the url with parameter values
    var apikey = "u7puhqn6extmbqkau38bhunh";
    var baseUrl = "https://data.tmsapi.com/v1.1";
    var showtimesUrl = baseUrl + '/movies/showings';
    var zipCode = $("#zip").val();
    var d = new Date();
    var today = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
    try {
        $.ajax({
      url: showtimesUrl,
          data: { startDate: today,
              zip: zipCode,
              jsonp: "dataHandler",
              api_key: apikey
             },
      dataType: "jsonp"
      });
      return false;
    } catch (e) {console.log(e.description);}
}

// callback to handle the results of the API call and returned JSONP
function dataHandler(data) {
    // Remove any content from a previous search
    $("#movieArea").empty();
    // Basic header information
    $("#movieArea").append('<h3 class="text-success">Found ' + data.length + ' movies within 5 miles of ' + $("#zip").val() +'!</h3>');
    $("#movieArea").append('<h4>Click on a movie to learn more.</h4></br>');
    var counter = 0;
    var rows = [];
    $.each(data, function(index, movie) {
        // Want to make a new row, with 4 movies listed
        if (counter % 3 == 0) {
            rows.push("<div class='row'>");
        }
        var movieData = "<div class='col-md-3 portfolio-item'>";
        var movieDescription = "No Description Available";
        // Sometimes there isn't a movie description returned in the JSON
        if (movie.longDescription) {
            movieDescription = movie.longDescription.replace(/'/g, '');
        }
        //Store the data-description in the html tag as an attribute with data so it is hidden to users
      movieData += "<h4 data-description='" + movieDescription + "'>" + movie.title + "</h4>";
      movieData += "</div>";
      rows[Math.floor(counter / 3)] += movieData;
        counter += 1;
    });
    for (i = 0; i < rows.length; i++) { 
    rows[i] += "</div>"
    $("#movieArea").append(rows[i]);
    }
    // Tested our ability to use chaining and also a nice way of getting around a problem with our CSS working properly...
    $(".portfolio-item").css("height", "60px").css("border-style", "solid").css("border-width", "1px").css("background-color", "#e8ebef").css("border-color", "#c5c8cc").css("margin-left", "40px").css("margin-right", "40px");
}

// Adds a movie to favorites using an ajax POST request
function addToFavorites(movie){
    var myurl = "/addfavorite";
    var username = $("#username").attr('data-username');
    var password = $("#password").attr('data-password');
    var favoritesStr = $("#favorites").attr('data-favorites');
    var favorites = favoritesStr.split(',');

    favorites.push(movie);
    $("#favorites").attr('data-favorites', favorites);
    $.ajax({
        url: myurl,
        contentType: 'application/x-www-form-urlencoded',
        data: {
            find: {
                "username" : username,
                "password": password
            },
            update: {
                "$set" : {
                    "favorites" : favorites
                }
            }
        },  
        type: 'POST',
        success: function(result) {
            // Do something with the result
            writeAlertMessage(result);
        }
    });
    return false;
}

function addToWatchList(movie){
    var myurl = "/addwatchlist";
    var username = $("#username").attr('data-username');
    var password = $("#password").attr('data-password');
    var watchListStr = $("#watchList").attr('data-watchlist');
    var watchList = watchListStr.split(',');

    watchList.push(movie);
    $("#watchList").attr('data-watchlist', watchList);
    $.ajax({
        url: myurl,
        contentType: 'application/x-www-form-urlencoded',
        data: {
            find: {
                "username" : username,
                "password": password
            },
            update: {
                "$set" : {
                    "watchList" : watchList
                }
            }
        },  
        type: 'POST',
        success: function(result) {
            // Do something with the result
            writeAlertMessage(result);
        }
    });
    return false;
}

//Displays Favorites
function displayFavorites(){
    $('#favoritesArea').empty();
    var favoritesStr = $("#favorites").attr('data-favorites');
    var favorites = favoritesStr.split(',');
    favorites.shift();
    var favoritesSet = new Set(favorites);
    $('#favoritesArea').append('<ul>');
    for (let item of favoritesSet){
        $('#favoritesArea').append('<li>' + item + '</li>');
    }
    $('#favoritesArea').append('</ul>');
}

//Displays WatchList
function displayWatchList(){
    $('#watchListArea').empty();
    var watchListStr = $("#watchList").attr('data-watchlist');
    var watchList = watchListStr.split(',');
    watchList.shift();
    var watchListSet = new Set(watchList);
    $('#watchListArea').append('<ul>');
    for (let item of watchListSet){
        $('#watchListArea').append('<li>' + item + '</li>');
    }
    $('#watchListArea').append('</ul>');
}

//Other JQuery methods
$(document).ready(function(){
    displayFavorites();
    displayWatchList();
    //Fades out movieArea when you hover over it
    $('#movieArea').on('mouseenter', '.portfolio-item', function(){
        $(this).fadeTo("fast", 0.5);
    });
    //Opens up movie area when you click on it and displays description and favorite button
    $('#movieArea').on('click', '.portfolio-item', function(){
        $(this).fadeTo("fast", 1.0);
        $(this).css("height", "100%");
        $(this).find("p").remove();
        $(this).find("button").remove();
        $(this).append("<p>" + $(this).find('h4').attr('data-description') + "</p>");
        $(this).append("<button id='favoriteButton' data-movie='" + $(this).find('h4').text() + "' class='btn btn-primary', style='margin-bottom:10px; margin-right: 10px;'>Favorite!</button>");
        $("#favoriteButton").on('click', function(){
            addToFavorites($(this).attr('data-movie'));
            displayFavorites();
        });
        $(this).append("<button id='watchlistButton' data-movie='" + $(this).find('h4').text() + "' class='btn btn-secondary', style='margin-bottom:10px'>Add to Watchlist!</button>");
        $("#watchlistButton").on('click', function(){
            addToWatchList($(this).attr('data-movie'));
            displayWatchList();
        });

    });
    //Closes movie area when mouse leaves
    $('#movieArea').on('mouseleave', '.portfolio-item', function(){
        $(this).fadeTo("fast", 1.0);
        $(this).css("height", "60px")
        $('#movieArea p').remove();
        $('#movieArea button').remove();
    });
})
