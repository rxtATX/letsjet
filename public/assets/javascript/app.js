$(document).ready(function () {
  var whatsHappening = [];
  var filtered = [];
  var lat;
  var long;
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
  $(document).on("click", "#searchBtn", function () {
    runButton();
    $("second").css("overflow-y", "scroll");
    $("second").addClass("overlay");
  });
  $("#nextBtn").on("click", runNextWeekButton);
  $("#homeBtn").click(function () {
    location.reload(true);
  });

  //Function for button action
  function runButton() {
    showTable();
    $("#table-content").empty();
    findDate();
    findLocale();
  }
  function runNextWeekButton() {
    $("#nextBtn").hide();
    filtered = [];
    $("#table-content").empty();
    findNextDate();
    findLocale();
    showTable();
  }

  // Show the divs for flight results once submit button is clicked.
  // @@TRY CHANGING ANIMATION HEREEEE!!@@
  function showTable() {
    $("#flightResults").show();
    $('header').hide();
  }

  //Calculates the date based on when the button is pressed.
  function findNextDate() {
    var futureFri = moment(nextFri).add(7, "d");
    var futureSun = moment(nextSun).add(7, "d");
    futureFri = moment(futureFri).format("YYYYMMDD");
    futureSun = moment(futureSun).format("YYYYMMDD");
    startDF = moment(futureFri).format("MM/DD/YYYY");
    endDF = moment(futureSun).format("MM/DD/YYYY");
    $("#secondHeader").find($("#datesPanel")).empty();
    $("#secondHeader").append(`<h3 id='datesPanel' class='container-fluid text-center'>${startDF} - ${endDF}</h3>`);
    startD = moment(futureFri).format("YYYY-MM-DD");
    endD = moment(futureSun).format("YYYY-MM-DD");
  }
  function findDate() {
    startD = moment(nextFri).format("YYYY-MM-DD");
    endD = moment(nextSun).format("YYYY-MM-DD");
    startDF = moment(nextFri).format("MM/DD/YYYY");
    endDF = moment(nextSun).format("MM/DD/YYYY");
    $("#secondHeader").append(`<h3 id='datesPanel' class='container-fluid text-center'>${startDF} - ${endDF}</h3>`);
  }
  //Feeds in lat and long values from getLocation()
  //HTML5 geolocation function
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(findLocale);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }
  function findLocale(position) {
    if (position) {
      lat = position.coords.latitude;
      long = position.coords.longitude;
    } else {
      lat = 29;
      long = -95;
    }
    //AJAX call for SkyScanner API
    $.ajax({ url: "/api/skyscanner/US/en-us/" + lat + "," + long + "-latlong/anywhere/USD/" + startD + "/" + endD, method: "get" }).done(function (response) {
      //Loops through all the responses
      $.each(response.Quotes, function (key, value) {
        findCityName(response.Places, value.OutboundLeg.DestinationId, value.MinPrice);
      });

      //grabing all the prices and quoteID into a 2d array so we can easily find lowest to highest price
      for (var i = 0; i < response.Quotes.length; i++) {
        prices = response.Quotes[i].MinPrice;
        quoteNum = response.Quotes[i].QuoteId;
        var sample = [prices, quoteNum];
        lowHighPrices.push(sample);
      }
      //putting the prices from lowest to greatest with the corilated quoteID
      for (i = 0; i < lowHighPrices.length - 1; i++) {
        if (lowHighPrices[i][0] > lowHighPrices[i + 1][0]) {
          var hold = lowHighPrices[i];
          lowHighPrices[i] = lowHighPrices[i + 1];
          lowHighPrices[i + 1] = hold;
          i = -1;
        }
      }
      //removing everything except for the 15 cheapest flights
      lowHighPrices = lowHighPrices.splice(0, 19);

      var destinationHold = "";
      var airOutHold = "";
      var airInHold = "";
      var dateOutHold = "";
      var dateInHold = "";
      //looping through the top 15 to get the other information from the URL and pushing it into the filtered leaving with a filtered array with the top 15 flights/destination/airline/dates
      for (i = 0; i < lowHighPrices.length; i++) {
        quoteNum = lowHighPrices[i][1] - 1;
        console.log(response.Quotes[quoteNum])
        if (response.Quotes[quoteNum].InboundLeg.CarrierIds.length !== 0) {
          dateOutHold = response.Quotes[quoteNum].OutboundLeg.DepartureDate;
          dateInHold = response.Quotes[quoteNum].InboundLeg.DepartureDate;
          prices = response.Quotes[quoteNum].MinPrice;

          destinationHold = response.Quotes[quoteNum].OutboundLeg.DestinationId;
          airOutHold = response.Quotes[quoteNum].OutboundLeg.CarrierIds;
          airInHold = response.Quotes[quoteNum].InboundLeg.CarrierIds;
          //looping through the Places array in the URL to get the location information

          for (var j = 0; j < response.Places.length; j++) {
            if (destinationHold == response.Places[j].PlaceId) {
              destinationHold = response.Places[j].CityName + ", " + response.Places[j].CountryName;
            }
          }
          //looping through the carriers array in the URL to get the airline name
          for (j = 0; j < response.Carriers.length; j++) {
            if (airInHold == response.Carriers[j].CarrierId) {
              airInHold = response.Carriers[j].Name;
            }

            if (airOutHold == response.Carriers[j].CarrierId) {
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
          if (filtered.length < 8) {
            filtered.push(object);
          }
        }
      }
      startD = moment(filtered[0].dateOut.substring(0, 10)).format("MM/DD/YYYY");
      endD = moment(filtered[0].dateIn.substring(0, 10)).format("MM/DD/YYYY");
      $("#response-content").empty();
      for (i = 0; i < filtered.length; i++) {
        $("#response-content").append(`
          <div data-index='${i}' class='card text-center infoDiv'>
            <div class='card-block'>
              <h3 class='card-title'>${filtered[i].destination}</h3>
              <p class='hideThis card-text'>
                <strong>$${filtered[i].price}</strong> with ${filtered[i].airOut}
              </p>
              <button type='button' data-Stime='${startD}' data-eTime='${endD}' class='btn btn-custom eventsBtn' data-value='${filtered[i].destination.substring(0, filtered[i].destination.indexOf(","))}'>Click for events!</button>
            </div>
          </div>`);
      }
    }).fail(function (error) {
      $('.console').html("<h1>Ooops! Something went wrong, check the console!</h1>");
    });
  }

  //After city id is pulled, runs through "Places" to identify and convert into words.
  function findCityName(data, cityId, price) {//Have to pass new variables here to add...
    var cityName = "Not found.";
    $.each(data, function (key, value) {
      var arrID = Number(value.PlaceId);
      var mycID = Number(cityId);
      if (arrID === mycID) {
        var nameOfCity = value.Name;
      }
    }, function () {
      return cityName;
    });
  }
});
