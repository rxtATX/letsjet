var destination;
var startD;
var endD;
var nameOfCity;

// $(document).on("click", "#searchBtn", runButton);
// $("#nextBtn").on("click", runNextWeekButton);
$(document).on("click", ".eventsBtn", runEventsBtn);

function runNextWeekButton() {
  $("#table-content").empty();
  findNextDate();
  findLocale();
}
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
function runEventsBtn() {
  nameOfCity = $(this).data("value");
  console.log(nameOfCity);
  // loadModal();
  findEvents();
}
function findEvents() {
   
   var oArgs = {

      app_key: "WLzwCkPfBxvFrMHm",

      q: nameOfCity,

      location: nameOfCity,

      "date": startD + "00-" + endD + "00",
      
      page_size: 6,

      sort_order: "popularity",

   };

   EVDB.API.call("/events/search", oArgs, function(oData) {
    var response = oData.events;

    console.log(oData.events);
    
    function eventsDetails() {
      for (i = 0; i < oData.events.event.length; i++) {
    if (response.event[i].description !== null) {
      $("#modal-body").append("<p>" + response.event[i].title + "</p><p>" + response.event[i].venue_name + "</p><p>" + response.event[i].start_time + "</p><p>" + response.event[i].description + "</p><p>" + response.event[i].venue_url + "</p>")
    } else {
      $("#modal-body").append("<p>" + response.event[i].title + "</p><p>" + response.event[i].venue_name + "</p><p>" + response.event[i].start_time + "</p><p>" + response.event[i].venue_url + "</p>")
    }
        // console.log(response.event[i].title);
        // console.log("Location: " + response.event[i].venue_name);
        // console.log("Be there by: " + response.event[i].start_time);
        // if (response.event[i].description != null) {
        // console.log(response.event[i].description);
        // }
        // console.log("visit: " + response.event[i].venue_url);
        // console.log("-----------");
      }
    }

    eventsDetails();
    });

}