var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Lets Jet!' });
});


// Put your skyscanner api key here
var api_key = "la992349893483139715787446358156";

// This allows Cross-Origin Requests to our server
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Make sure you set app_key and api_key up above
router.get('/api/skyscanner/:market/:locale/:location/:destination/:currency/:startdate/:enddate', function(req, res){
    var params = req.params;
    var market = (params.market) ? params.market : "US";
    var locale = (params.locale) ? params.locale : "en-US";
    var location = (params.location) ? params.location : "US";
    var destination = (params.destination) ? params.destination : "anywhere";
    var currency = (params.currency) ? params.currency : "USD";
    var startdate = (params.startdate) ? params.startdate : "anytime";
    var enddate = (params.enddate) ? params.enddate : "anytime";
    var responseData;
    // http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/US/USD/en-US/29,-95-latlong/anywhere/2016-12-16/2016-12-18?apiKey=prtl6749387986743898559646983194
    request(
      { method: 'GET'
      , uri: 'http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/' + market + '/' + currency + '/' + locale + '/' + location + '/' + destination + '/' + startdate + '/' + enddate + '?apiKey=' + api_key
      , gzip: true
      }
    , function (error, response, body) {
        // body is the decompressed response body
        console.log('server encoded the data as: ' + (response.headers['content-encoding'] || 'identity'));
        // console.log('the decoded data is: ' + body);
        var data = JSON.parse(body);
        res.json(data);
    });

});
module.exports = router;
