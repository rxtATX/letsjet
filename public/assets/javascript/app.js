$(document).ready(function() {
var whatsHappening = [];
var filtered = [];
var lat;
var long;
var nextSat = moment().endOf("week");
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
$(document).on("click", ".eventsBtn", runEventsBtn);
//Function for button action
function runButton() {
  showTable();
  console.log("runButton works.")
  $("#table-content").empty();
  findDate();
  // getLocation();
  findLocale();
  //Add format of returned data 
}
function runNextWeekButton() {
  // showTable();
  $("#table-content").empty();
  findNextDate();
  // getLocation();
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
  var futureSat = moment(nextSat).add(7, "d");
  var futureSun = moment(nextSun).add(7, "d");
  futureSat = moment(futureSat).format("YYYYMMDD");
  futureSun = moment(futureSun).format("YYYYMMDD");
  startD = moment(futureSat).format("YYYY-MM-DD");
  endD = moment(futureSun).format("YYYY-MM-DD");
}
function findDate() {
  startD = moment(nextSat).format("YYYY-MM-DD");
  endD = moment(nextSun).format("YYYY-MM-DD");
}
//Feeds in lat and long values from getLocation()
// function findLocale(position) {
  function findLocale() {

  //Client-side javascript ip address identify to locate
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
  //removing everything except for the 10 cheapest flights
  lowHighPrices = lowHighPrices.splice(0, 10);
  console.log(lowHighPrices.length);

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
  for (i=0; i < filtered.length; i++) {
    $("#table-content").append("<tr><td>" + filtered[i].destination + "</td><td class='hideThis'>" + moment(filtered[i].dateOut.substring(0, 10)).format("MM/DD/YYYY") + "</td><td class='hideThis'>$" + filtered[i].price + "</td><td class='hideThis'>" + filtered[i].airOut + "</td><td class='hideThis'>" + moment(filtered[i].dateIn.substring(0, 10)).format("MM/DD/YYYY") + "</td><td class='hideThis'>" + filtered[i].airIn + "<td class='events'><button type='button' class='btn btn-custom eventsBtn' data-value='" + filtered[i].destination.substring(0, filtered[i].destination.indexOf(",")) + "'>Click for events!</button></td></tr>");
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
//Assigning any click on an eventsBtn class to run findEvents function.
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
  console.log(oArgs);
  EVDB.API.call("/events/search", oArgs, function(oData) {
    var response = oData.events;
  }); //End of API call.
  eventsDetails();
} //End of findEvents();
function eventsDetails() {
  for (i = 0; i < oData.events.event.length; i++) {
    if (response.event[i].description !== null) {
      $("#modal-body").append("<p>" + response.event[i].title + "</p><p>" + response.event[i].venue_name + "</p><p>" + response.event[i].start_time + "</p><p>" + response.event[i].description + "</p><p>" + response.event[i].venue_url + "</p>")
    } else {
      $("#modal-body").append("<p>" + response.event[i].title + "</p><p>" + response.event[i].venue_name + "</p><p>" + response.event[i].start_time + "</p><p>" + response.event[i].venue_url + "</p>")
    }
  }
}
//API call to Eventfull and assigning the call to eventsBtn class.
function runEventsBtn() {
  nameOfCity = $(this).data("value");
  console.log(nameOfCity);
  loadModal();
  findEvents();
}

function loadModal() {
// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("eventsBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 

  modal.style.display = "block";


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

}

});
