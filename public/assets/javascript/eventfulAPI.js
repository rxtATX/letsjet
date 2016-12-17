$(document).ready(function() {
var startTripTime;
var endTripTime;
var whereYouGo;

$(document).on("click", ".eventsBtn", runEventsBtn);

//Pulls variables from app.js and reformat for EventfulAPI
function runEventsBtn() {
  startTripTime = $(this).data("Stime");
  startTripTime = moment(startTripTime).format("YYYYMMDD");
  endTripTime = moment(startTripTime).add(1, "d");
  endTripTime = moment(endTripTime).format("YYYYMMDD");
  whereYouGo = $(this).data("value");
  loadModal();
  findEvents();
  //These console.logs do not fire for some reason.
  console.log("Run events button: " + startTripTime + "," + endTripTime);
  console.log(whereYouGo);
}

function findEvents() {

  //declare arguments for the API
  var oArgs = {
    app_key: "WLzwCkPfBxvFrMHm",
    q: whereYouGo,
    location: whereYouGo,
    "date": startTripTime + "00-" + endTripTime + "00",
    page_size: 6,
    sort_order: "popularity",
  };
  //These console logs do print out successfully
  console.log("oArgs list: " + whereYouGo);
  console.log(startTripTime + ", third: " + endTripTime);
  console.log(oArgs);
  //Kind of like the ajax for this API
  //The function stops here and says EVDB is not defined.
  EVDB.API.call("/events/search", oArgs, function(oData) {
  var response = oData.events;
  console.log(response);

  function eventsDetails(response) {
     console.log(response.event.title);
     console.log("Location: " + response.event.venue_name);
     console.log("Be there by: " + response.event.start_time);
     if (response.event.description != null) {
     console.log(response.event.description);
     }
     console.log("visit: " + response.event.venue_url);
     console.log("-----------");
    if (response.event.description !== null) {
      $("#modal-body").append("<p>" + response.event.title + " " + response.event.venue_name + " " + response.event.start_time + "</p><p class='description'>" + response.event.description + "</p><p>" + response.event.venue_url + "</p>")
    } else {
      $("#modal-body").append("<p>" + response.event.title + " " + response.event.venue_name + " " + response.event.start_time + "</p><p>" + response.event.venue_url + "</p>")
    }
  }
  eventsDetails(response);
  });
//Documentation to pull pertinent info and display it to the modal.
console.log("EVDB is working");
}
//The modal function designed by Tony.
//This works with sample text, but not with the eventsDetails function.
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
})