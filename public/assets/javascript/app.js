$(document).ready(function() {
var whatsHappening = [];
var lat;
var long;
var nextSat = moment().endOf("week");
var nextSun = moment(nextSat).add(1, "d");
var startD;
var endD;
var nameOfCity;
//Button event listener
$(document).on("click", "#searchBtn", runButton);
//Function for button action
function runButton() {
  showTable();
  emptyTable();
  findDate();
  getLocation();
  findLocale();
  //Add format of returned data 
}
// Show the divs for flight results once submit button is clicked.
function showTable() {
  // $("'html,body'").animate({
  //   scrollTop: $("#flightResults").offset().top},
  //   'slow'); // slow page scroll function, but does not work at the moment.
  $("#flightResults").show();
  // Hide and show home screen.
  $('header').hide();
  $("#homeBtn").click(function(){
    $('header').show();
    $("#flightResults").hide();
  });
}
//Clears table of previous search values.
function emptyTable() {
  $("#flight-destination").empty();
  $("#flight-airline").empty();
  $("#flight-outbound").empty();
  $("#flight-inbound").empty();
  $("#flight-cost").empty();
}
//Calculates the date based on when the button is pressed.
function findDate() {
  startD = moment(nextSat).format("YYYY-MM-DD");
  endD = moment(nextSun).format("YYYY-MM-DD");
  console.log("FROM: " + startD + " - TO: " + endD);
}
//Feeds in lat and long values from getLocation()
function findLocale(position) {
  //Client-side javascript ip address identify to locate
  // if (position.coords !== undefined) {
  // lat = position.coords.latitude;
  // long = position.coords.longitude;
  // } else {
    lat = 29;
    long = -95;
  // }
  console.log("LAT: " + lat + "/LONG:" + long);
  //AJAX call for SkyScanner API
  $.ajax({url:"/api/skyscanner/US/en-us/" + lat + "," + long + "-latlong/anywhere/USD/" + startD + "/" + endD, method:"get"}).done(function(response){
    console.log(response); //JSON OBJECT
   //Loops through all the responses
   $.each(response.Quotes, function (key, value) {
      findCityName(response.Places, value.OutboundLeg.DestinationId, value.MinPrice);
    });
    //Dan's contribution.
  var prices = 0;
  var quoteNum;
  var lowHighPrices = [];
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
  //removing everything except for the 10 cheapest flights
  lowHighPrices = lowHighPrices.splice(0, 10);

  var filtered = [];
  var destinationHold = "";
  var airOutHold = "";
  var airInHold = "";
  var dateOutHold = "";
  var dateInHold = "";
  //looping through the top 10 to get the other information from the URL and pushing it into the filtered leaving with a filtered array with the top 10 flights/destination/airline/dates
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
  //bow chica wow wow
  console.log(filtered);
  for (i=0; i < filtered.length; i++) {
    $("#table-content").append("<tr><td>"+ filtered[i].destination + "</td><td>" + moment(filtered[i].dateOut.substring(0, 10)).format("MM/DD/YYYY") + "</td><td>$" + filtered[i].price + "</td><td>" + filtered[i].airOut + "</td><td>" + moment(filtered[i].dateIn.substring(0, 10)).format("MM/DD/YYYY") + "</td><td>" + filtered[i].airIn + "<td id='events'><button class='btn btn-custom' id='eventsBtn'>Click for events!</button></td></tr>");
  }
  }).fail(function(error){
    console.log(error);
    $('.console').html("<h1>Ooops! Something went wrong, check the console!</h1>");
  });
}
//After city id is pulled, runs through "Places" to identify and convert into words.
function findCityName(data, cityId, price) {//Have to pass new variables here to add...
  console.log("my city id is: " + cityId);
  var cityName = "Not found.";
  $.each(data, function(key, value){
    var arrID = Number(value.PlaceId);
    var mycID = Number(cityId);
    if (arrID === mycID) {
    var nameOfCity = value.Name;
      // var flight = '<li><a href="#">' + nameOfCity + ' $' + price + '</a></li>'; //Add to here.
      // $('#myFlights').append(flight);
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
//Assigning any click on an eventsBtn class to run findEvents function.
$(".eventsBtn").on("click", findEvents);
//API call to Eventfull and assigning the call to eventsBtn class.
function findEvents() {
   //Arguments that will need to run API.
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
  // console.log(oData.events);
  
  function eventsDetails() {
    for (i = 0; i < oData.events.event.length; i++) {
      console.log(response.event[i].title);
      console.log("Location: " + response.event[i].venue_name);
      console.log("Be there by: " + response.event[i].start_time);
      if (response.event[i].description !== null) {
      console.log(response.event[i].description);
      }
      console.log("visit: " + response.event[i].venue_url);
      console.log("-----------");
    }
  }

  eventsDetails();
  });

}

});
