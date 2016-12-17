$(document).ready(function() {
var whatsHappening = [];
var filtered = [];
var lat = 29;
var long = -95;
var nextSat = moment().endOf("week");
var nextFri = moment(nextSat).subtract(1, "d");
var nextSun = moment(nextSat).add(1, "d");
var startD;
var endD;
var nameOfCity;
var prices = 0;
var quoteNum;
var lowHighPrices = [];
//Button event listener
$(document).on("click", "#searchBtn", runButton);
$("#nextBtn").on("click", runNextWeekButton);
//Function for button action
function runButton() {
  showTable();
  $("#table-content").empty();
  findDate();
}
function runNextWeekButton() {
  showTable();
  filtered = [];
  $("#table-content").empty();
  findNextDate();
  findLocale();
}
// Show the divs for flight results once submit button is clicked.
function showTable() {
  $("#flightResults").show();
  $('header').hide();
  $("#homeBtn").click(function(){
  $('header').show();
  $("#flightResults").hide();
  });
}
//Calculates the date based on when the button is pressed.
function findNextDate() {
  var futureFri = moment(nextFri).add(7, "d");
  // var futureSat = moment(nextSat).add(7, "d");
  var futureSun = moment(nextSun).add(7, "d");
  futureFri = moment(futureFri).format("YYYYMMDD");
  // futureSat = moment(futureSat).format("YYYYMMDD");
  futureSun = moment(futureSun).format("YYYYMMDD");
  startD = moment(futureFri).format("YYYY-MM-DD");
  endD = moment(futureSun).format("YYYY-MM-DD");
}
function findDate() {
  startD = moment(nextFri).format("YYYY-MM-DD");
  endD = moment(nextSun).format("YYYY-MM-DD");
}
//Feeds in lat and long values from getLocation()
  function findLocale() {
  // if (position.coords !== undefined) {
    // lat = position.coords.latitude;
    // long = position.coords.longitude;
  // } else {
      lat = 29;
      long = -95;
  // }
  //AJAX call for SkyScanner API
  $.ajax({url:"/api/skyscanner/US/en-us/" + lat + "," + long + "-latlong/anywhere/USD/" + startD + "/" + endD, method:"get"}).done(function(response){
   //Loops through all the responses
   $.each(response.Quotes, function (key, value) {
      findCityName(response.Places, value.OutboundLeg.DestinationId, value.MinPrice);
    });

  //grabing all the prices and quoteID into a 2d array so we can easily find lowest to highest price
  for(var i = 0; i<response.Quotes.length ; i++){
    prices = response.Quotes[i].MinPrice;
    quoteNum = response.Quotes[i].QuoteId;
    var sample = [prices, quoteNum];
    lowHighPrices.push(sample);
  }
  //putting the prices from lowest to greatest with the corilated quoteID
  for(i = 0; i<lowHighPrices.length-1; i++){
    if(lowHighPrices[i][0]>lowHighPrices[i+1][0]){
      var hold = lowHighPrices[i];
      lowHighPrices[i] = lowHighPrices[i+1];
      lowHighPrices[i+1] = hold;
      i=-1;
    }
  }
  //removing everything except for the 15 cheapest flights
  lowHighPrices = lowHighPrices.splice(0, 15);

  var destinationHold = "";
  var airOutHold = "";
  var airInHold = "";
  var dateOutHold = "";
  var dateInHold = "";
  //looping through the top 15 to get the other information from the URL and pushing it into the filtered leaving with a filtered array with the top 15 flights/destination/airline/dates
  for(i = 0; i<lowHighPrices.length; i++){
    quoteNum = lowHighPrices[i][1]-1;
    dateOutHold = response.Quotes[quoteNum].OutboundLeg.DepartureDate;
    dateInHold = response.Quotes[quoteNum].InboundLeg.DepartureDate;
    prices = response.Quotes[quoteNum].MinPrice;

    destinationHold = response.Quotes[quoteNum].OutboundLeg.DestinationId;
    airOutHold = response.Quotes[quoteNum].OutboundLeg.CarrierIds;
    airInHold = response.Quotes[quoteNum].InboundLeg.CarrierIds;
    //looping through the Places array in the URL to get the location information
    for(var j = 0; j<response.Places.length; j++){
      if(destinationHold == response.Places[j].PlaceId){
        destinationHold = response.Places[j].CityName + ", " + response.Places[j].CountryName;
      }
    }
    //looping through the carriers array in the URL to get the airline name
    for(j = 0; j<response.Carriers.length; j++){
      if(airInHold == response.Carriers[j].CarrierId){
        airInHold = response.Carriers[j].Name;
      }

      if(airOutHold == response.Carriers[j].CarrierId){
        airOutHold = response.Carriers[j].Name;
      }
    }
    //creating an object so we can push it to the filtered array
    var object = {
      destination: destinationHold,
      dateOut: dateOutHold,
      airOut: airOutHold,
      dateIn: dateInHold,
      airIn: airInHold,
      price: prices
    };
    filtered.push(object);
  }
  for (i=0; i < filtered.length; i++) {
    startD = moment(filtered[i].dateOut.substring(0, 10)).format("MM/DD/YYYY");
    endD = moment(filtered[i].dateIn.substring(0, 10)).format("MM/DD/YYYY");
    $("#table-content").append("<tr><td>" + filtered[i].destination + "</td><td class='hideThis'>" + startD + "</td><td class='hideThis'>$" + filtered[i].price + "</td><td class='hideThis'>" + filtered[i].airOut + "</td><td class='hideThis'>" + endD + "</td><td class='hideThis'>" + filtered[i].airIn + "<td class='events'><button type='button' data-Stime='" + startD + "' data-eTime='" + endD + "' class='btn btn-custom eventsBtn' data-value='" + filtered[i].destination.substring(0, filtered[i].destination.indexOf(",")) + "'>Click for events!</button></td></tr>");
  }
  }).fail(function(error){
    $('.console').html("<h1>Ooops! Something went wrong, check the console!</h1>");
  });
}

//After city id is pulled, runs through "Places" to identify and convert into words.
function findCityName(data, cityId, price) {//Have to pass new variables here to add...
  var cityName = "Not found.";
  $.each(data, function(key, value){
    var arrID = Number(value.PlaceId);
    var mycID = Number(cityId);
    if (arrID === mycID) {
      var nameOfCity = value.Name;
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
  }
}
});
