$(function() {   // when document is ready
	$("#signupform").submit(createUser);
});

//Utility function for writing alert messages
function writeAlertMessage(result) {
  $("#message").css('color', 'green');
  $("#message").empty();
  $("#message").append("<p>"+result+"</p>");
}

//Creates a new user in the system
function createUser() {
  var myurl = "/signup";
  var user = $("#username2").val();
  var pass = $("#password2").val();
  var favorites = [];
  favorites[0] = "movieName";
  var watchList = [];
  watchList[0] = "movieName";
  var screenname = $("#screenname2").val();
  $.ajax({
    url: myurl,
    contentType: 'application/x-www-form-urlencoded',
    data: {
      'username' : user,
      'password' : pass,
      'screenname' : screenname,
      'favorites' : favorites,
      'watchList' : watchList
    },
    type: 'PUT',
    success: function(result) {
      // Do something with the result
      writeAlertMessage(result);
    }
  });
  return false;
}