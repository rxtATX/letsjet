$(document).ready(function() {
	// // Scrolls down slowly to flight results section.
	// $("#searchBtn").click(function() {
	//     $('html,body').animate({
	//         scrollTop: $("#flightResults").offset().top},
	//         'slow');
	//     $("#flightResults").show();
	// });

	// // Scrolls down slowly to book and events section.
	// $(".btn-custom").click(function() {
	//     $('html,body').animate({
	//         scrollTop: $("#bookInfo").offset().top},
	//         'slow');
	// });

	// Show the divs for flight results once submit button is clicked.
	$("#searchBtn").click(function() {
		$("#flightResults").show();
	});
});

