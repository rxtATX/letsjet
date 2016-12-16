Imagine: the weekend is fast approaching. Do you have any plans this weekend? No? When's the last time you went somewhere without months of planning? You need some fodder for the water cooler come Monday.

Here's what you'll do. Open the LetJet app. Press the single button on the homepage, and watch what happens---You're directed towards up to 10 fascinating adventures without having to spend all that time inputting the same information you've entered a million times before.

Displayed for you is a plethora of information about the flights from which you may choose, all conveniently sorted into the 10 least expensive options out there pulled from thousands!

But wait, there's more!

Why would you want to go to these random cities to begin with? We'll tell you why. There are diverse and interesting things happening everywhere! Click the button next to the city of interest, and see things like restaurants in the area, sports events occurring, art shows, concerts... And many other fun activities that will be going on with links to each webpage wherein you can purchase those tickets.

In the future, we hope to enable an integrated booking option with our app. 

This app is for the adventerous, spontaneous, liberated traveler.

It's for the weekend warrior who is not afraid to take an unexpected trip into the uknown.

It's for the pilgrim whose weekend plans have fallen through, but who does not want to call it a wash just yet!

As we establish our base of users, we will naturally want to incorporate a wider range of functionality and new reasons to use our app. Future features will include integrated booking, as mentioned before, user login to track favorite results and previously visited cities, and database integration in order to prevent repeat flights from displaying, to name only a few. 

function displayEvents() {
  var cityNameValue = $(this).data("value");
  for (i = 0; i < whatsHappening.length; i++) {
    $("#modal-body").append("<p>" + whatsHappening[i].title + "</p><p>" + whatsHappening[i].location + "</p><p>" + whatsHappening[i].startTime + "</p><p>" + whatsHappening[i].description + "</p><p>" + whatHappening[i].visit + "</p>");
  }
}