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
$("#searchBtn").on("click", runButton);//Check syntax for correctness
//caution

function runButton() {
  // findLocale();  CAUTION
  findDate();
  
  $.ajax({url:"/api/skyscanner/US/en-us/" + lat + "," + long + "-latlong/anywhere/USD/" + startD + "/" + endD, method:"get"}).done(function(response){
    console.log(response);
  }).fail(function(error){
    console.log(error);
  $('.console').html("<h1>Ooops! Something went wrong, check the console!</h1>");
  });
}

function findDate() {
  startD = moment(nextSat).format("YYYY-MM-DD");
  endD = moment(nextSun).format("YYYY-MM-DD");
}

function findLocale() { //Assign findLocale to button press
    $.getJSON("https://ip-api.com/json",function(data2){//Not compatible with Heroku
      lat = data2.lat;
      long = data2.lon;
      queryURL = "https://airport.api.aero/airport/nearest/" + lat + "/" + long + "?maxAirports=1&user_key=ff6c3f7204f3776f1e0b697b52524c55";
     
    });
  //Find a way to convert to IATA
  //API wants to be run server-side
  console.log(queryURL);
  console.log(lat);
  console.log(long);
};



})
