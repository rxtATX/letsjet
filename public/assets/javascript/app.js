$(document).ready(function() {

var lat = 29;
var long = -95;
var iata; //ScyScannerAPI
var queryURL;
var destination; //EventfulAPI
var nextSat = moment().endOf("week");
var nextSun = moment(nextSat).add(1, "d");
var startD;
var endD;
//caution
$(document).on("click", "#searchBtn", runButton);//Check syntax for correctness
//caution

function runButton() {
  // findLocale();  CAUTION
  findDate();
  getLocation();
  //Add format of returned data
  
  
}

function findDate() {
  startD = moment(nextSat).format("YYYY-MM-DD");
  endD = moment(nextSun).format("YYYY-MM-DD");
}
//CAUTION
function findLocale(position) { //Assign findLocale to button press
  lat = position.coords.latitude;
  long = position.coords.longitude;

  $.ajax({url:"/api/skyscanner/US/en-us/" + lat + "," + long + "-latlong/anywhere/USD/" + startD + "/" + endD, method:"get"}).done(function(response){
    console.log(response);
   $.each(response.Quotes, function (key, value) {
     findCityName(response.Places, value.OutboundLeg.DestinationId, value.MinPrice);
       
    });
  }).fail(function(error){
    console.log(error);
  $('.console').html("<h1>Ooops! Something went wrong, check the console!</h1>");
  });

  console.log(lat);
  console.log(long);
};


function findCityName(data, cityId, price) {
  console.log("my city id is: " + cityId);
  var cityName = "Not found.";

  $.each(data, function(key, value){
    var arrID = Number(value.PlaceId);
    var mycID = Number(cityId);
    if (arrID === mycID) {
      // alert('Hello World');
    var nameOfCity = value.Name;
      var flight = '<li><a href="#">' + nameOfCity + ' $' + price + '</a></li>';
      $('#myFlights').append(flight);
    }
    console.log("my city id is: " + cityId);
     console.log(value.Name);
     console.log(value.PlaceId);
  }, function(){
    return cityName;  
  });
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(findLocale);
    } else { 
        var log = "Geolocation is not supported by this browser.";
        console.log(log);
    }
}

//Caution



})
