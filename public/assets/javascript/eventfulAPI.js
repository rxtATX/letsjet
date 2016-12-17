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
  //Kind of like the ajax for this API
  //The function stops here and says EVDB is not defined.
  EVDB.API.call("/events/search", oArgs, function(oData) {
  var response = oData.events;

  function eventsDetails(response) {
    for (i = 0; i < response.event.length; i++) {
      if (response.event[i].description === null) {
        $("#modal-body").append("<p class='title'>" + response.event[i].title + " " + response.event[i].venue_name + " " + moment(response.event[i].start_time).format("MM/DD/YYYY HH:mm") + "</p><p><a class='description target='_blank' href='" + response.event[i].venue_url + "'>Click to visit webpage!</a></p>");
      } else {
        response.event[i].description = (response.event[i].description).substring(0, 1000) + "...";
        $("#modal-body").append("<p class='title'>" + response.event[i].title + " " + response.event[i].venue_name + " " + moment(response.event[i].start_time).format("MM/DD/YYYY HH:mm") + "</p><p class='description'>" + response.event[i].description + "</p><p><a class='description' target='_blank' href='" + response.event[i].venue_url + "'>Click to visit webpage!</a></p>");
      }
    }
  }
  eventsDetails(response);
  });
//Documentation to pull pertinent info and display it to the modal.
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