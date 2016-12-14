$(document).ready(function() {

var lat;
var long;
var iata;
var queryURL;
var nextSat = moment().endOf("week");
var nextSun = moment(nextSat).add(1, "d");
var startD;
var endD;
var nameOfCity;
//Button event listener
$(document).on("click", "#searchBtn", runButton);
//Function for button action
function runButton() {
  findDate();
  getLocation();
  findLocale();
  //Add format of returned data 
  showTable();
}
// Show the divs for flight results once submit button is clicked.
function showTable() {
    $("#flightResults").show();
}
//Calculates the date based on when the button is pressed.
function findDate() {
  startD = moment(nextSat).format("YYYY-MM-DD");
  endD = moment(nextSun).format("YYYY-MM-DD");
}
//Feeds in lat and long values from getLocation()
function findLocale(position) {
  if (position.coords != undefined) {
  lat = position.coords.latitude;
  long = position.coords.longitude;
  } else {
    lat = 29;
    long = -95;
  }
  //AJAX call for SkyScanner API
  $.ajax({url:"/api/skyscanner/US/en-us/" + lat + "," + long + "-latlong/anywhere/USD/" + startD + "/" + endD, method:"get"}).done(function(response){
    console.log(response);
   //Loops through all the responses
   $.each(response.Quotes, function (key, value) {
      findCityName(response.Places, value.OutboundLeg.DestinationId, value.MinPrice);
    });
  }).fail(function(error){
    console.log(error);
    $('.console').html("<h1>Ooops! Something went wrong, check the console!</h1>");
  });
};
//After city id is pulled, runs through "Places" to identify and convert into words.
function findCityName(data, cityId, price) {//Have to pass new variables here to add...
  console.log("my city id is: " + cityId);
  var cityName = "Not found.";

  $.each(data, function(key, value){
    var arrID = Number(value.PlaceId);
    var mycID = Number(cityId);
    if (arrID === mycID) {
    var nameOfCity = value.Name;
      var flight = '<li><a href="#">' + nameOfCity + ' $' + price + '</a></li>'; //Add to here.
      $('#myFlights').append(flight);
    }
  }, function(){
    return cityName;  
  });
}
//HTML5 geolocation function
function getLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(findLocale);
  } else { 
      var log = "Geolocation is not supported by this browser.";
      console.log(log);
  }
}

$(".eventsButton").on("click", findEvents);
function findEvents() {
   var oArgs = {
      app_key: "WLzwCkPfBxvFrMHm",
      q: nameOfCity,
      locaction: nameOfCity,
      "date": startD + "00-" + endD + "00",
      page_size: 6,
      sort_order: "popularity",
   };

   EVDB.API.call("/events/search", oArgs, function(oData) {
    var response = oData.events;

    console.log(oData.events);
    
    function eventsDetails() {
      for (i = 0; i < oData.events.event.length; i++) {
        console.log(response.event[i].title);
        console.log("Location: " + response.event[i].venue_name);
        console.log("Be there by: " + response.event[i].start_time);
        if (response.event[i].description != null) {
        console.log(response.event[i].description);
        }
        console.log("visit: " + response.event[i].venue_url);
        console.log("-----------");
      }
    }

    eventsDetails();
    });

}
})
