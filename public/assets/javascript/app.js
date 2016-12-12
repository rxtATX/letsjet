$(document).ready(function() {

var lat;
var long;
var iata; //SabreAPI
var queryURL;
var destination; //EventfulAPI
var nextSat = moment().endOf("week");
var nextSun = moment(nextSat).add(1, "d");
var startD;
var endD;

$("#searchBtn").on("click", runButton());

function runButton() {
	findLocale();
	findDate();
};

function findDate() {
	startD = moment(nextSat).format("YYYY-MM-DD");
	endD = moment(nextSun).format("YYYY-MM-DD");
};

function findLocale() {
  	$.getJSON("http://ip-api.com/json",function(data2){
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
var SabreDevStudio = require('sabre-dev-studio');
var sabre_dev_studio = new SabreDevStudio({
  client_id:     'V1:7b5jq8ymhffh0vjp:DEVCENTER:EXT',
  client_secret: 'y2gOWtL1',
  uri:           'https://api.test.sabre.com'
});
var iata = "LAX";
var startD = "2016-12-10";
var endD = "2016-12-11";
var options = {
	origin: iata,
	departuredate: startD,
	returndate: endD,
};
var callback = function(error, data) {
  if (error) {
    console.log(error);
  } else {
    console.log(JSON.stringify(JSON.parse(data)));
  }
};
sabre_dev_studio.get('/v1/lists/supported/shop/flights/fare/?origin=' + iata + "&departuredate=" + startD + "&returndate=" + endD + "&maxfare=500&topdestinations=10", options, callback);