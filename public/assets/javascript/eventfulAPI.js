$(document).ready(function () {
  var startTripTime;
  var endTripTime;
  var whereYouGo;

  $(document).on("click", ".eventsBtn", runEventsBtn);
  //Pulls variables from app.js and reformat for EventfulAPI
  function runEventsBtn() {
    $("#modal-body").empty();
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
    EVDB.API.call("/events/search", oArgs, function (oData) {
      0
      var response = oData.events;

      function eventsDetails(response) {
        if (!response) {
          $("#modal-body").append("<h3 style='text-align:center; margin:20%'>You'll have to make your own fun!</h3>");
        } else {
          for (i = 0; i < response.event.length; i++) {
            if (response.event[i].description) {
              response.event[i].description = (response.event[i].description).substring(0, 750) + "...";
            } else {
              response.event[i].description = "";
            }
            $("#modal-body").append(`<div class="modalEvent col-sm-6"><h3 class="modalTitle">${response.event[i].title}</h3><h5 style="font-size: 2.5rem">${response.event[i].venue_name + " " + moment(response.event[i].start_time).format("MM/DD/YYYY HH:mm")}</h5><p style="font-style: normal; font-size:2rem;" class="modalDescription">${response.event[i].description}</p><p><a style="font-style: normal; font-weight: normal;" target='_blank' href="${response.event[i].venue_url}">Click to visit the webpage!</a></p></div>`);
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
    span.onclick = function () {
      modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }

  }
})