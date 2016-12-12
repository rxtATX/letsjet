// Scrolls down slowly to flight results section.
$("#searchBtn").click(function() {
    $('html,body').animate({
        scrollTop: $("#flightResults").offset().top},
        'slow');
});

// Scrolls down slowly to book and events section.
$(".btn-custom").click(function() {
    $('html,body').animate({
        scrollTop: $("#bookInfo").offset().top},
        'slow');
});