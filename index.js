var client = require('./connector');

var service = require('./services/users');

var userservice = new service(client);

console.log('Loading function');
var util = require('./lib/utility');

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    console.log('ID ', event.httpMethod)

    switch(event.httpMethod){
        case "GET":
            userservice.getAllUsers(function(resp){
                callback(null, {headers: {"content-type": "application/json"}, body: JSON.stringify(util.handleResponse({err: false, message: "Successfully Returned", data: resp}))});
            });            
            break;

        case "POST":
            console.log("Respose =>",event.body);
            var msisdn =  (event.body || {}).msisdn || false;
            var cookieId =  (event.body || {}).cookieId || false;
            var deviceId =  (event.body || {}).deviceId || false;
            // var errors = util.checkRequestBody(JSON.parse(event.body), []);
            var errors = util.checkRequestBody(event.body, []);
            if(errors){
                callback(null, {headers: {"content-type": "application/json"}, body: JSON.stringify(util.handleResponse({err: true, message: "Invalid Parameters", data: errors}))})
            }else{
                userservice.getSingleUser( { msisdn: msisdn, cookieId: cookieId, deviceId: cookieId},
                function(resp){
                    callback(null, {headers: {"content-type": "application/json"}, body: JSON.stringify(util.handleResponse({err: false, message: "Successfully Returned", data: resp}))});
                });
            }            
            break;
        
        default:
            // Send HTTP 501: Not Implemented
            console.log("Error: unsupported HTTP method (" + event.httpMethod + ")");
            callback(null, { statusCode: 501 })

    }
};