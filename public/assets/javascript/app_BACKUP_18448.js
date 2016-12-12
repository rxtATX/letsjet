<<<<<<< HEAD
$(document).ready(function() {

var lat;
var long;
var iata;
var queryURL;
var destination;
var nextSat;
var nextSun;
var startD;
var endD;

$("#searchBtn").on("click", runButton());

function runButton() {
	nextSat = moment().endOf("week");
	nextSun = moment(nextSat).add(1, "d");
	startD = moment(nextSat).format("YYYYMMDD");
	endD = moment(nextSun).format("YYYYMMDD");
	findLocale();
};
function findLocale() {
  	$.getJSON("http://ip-api.com/json",function(data2){
      lat = data2.lat;
      long = data2.lon;
      queryURL = "https://airport.api.aero/airport/nearest/"+ lat +"/"+long+"?maxAirports=1&user_key=ff6c3f7204f3776f1e0b697b52524c55"
  	});
  //Find a way to convert to IATA
  //API wants to be run server-side
  console.log(queryURL);
  console.log(lat);
  console.log(long);
}



})
=======
// Scrolls down slowly to flight results section.
$("#searchBtn").click(function() {
    $('html,body').animate({
        scrollTop: $("#flightResults").offset().top},
        'slow');
});

// Scrolls down slowly to book and events section.
$(".btn-custom").click(function() {
    $('html,body').animate({
        scrollTop: $("#bookInfo").offset().top},
        'slow');
});
>>>>>>> 3c33659de82528b5fd6a6adefc48d5e7122ee848
