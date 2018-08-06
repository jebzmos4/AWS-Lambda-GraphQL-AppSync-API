var client = require('./connector');

var service = require('./services/users');

var userservice = new service(client);

var querystring = require('querystring');

console.log('Loading function');
var util = require('./lib/utility');


module.exports = {


  receives_payload: (event, context, callback) => {
    if (event != ""){
      console.log('ID ', event.httpMethod)
      
      switch(event.httpMethod){
          case "GET":
              userservice.getAllUsers(function(resp){
                  callback(null, {headers: {"content-type": "application/json"}, body: JSON.stringify(util.handleResponse({err: false, message: "Successfully Returned", data: resp}))});
              });            
              break;
  
          case "POST":
              // console.log("Respose =>",event.body);
              var query = querystring.parse(event.body);
              var msisdn =  (query || {}).msisdn || false;
              var cookieId =  (query || {}).cookieId || false;
              var deviceId =  (query || {}).deviceId || false;
              // var errors = util.checkRequestBody(JSON.parse(event.body), []);
              var errors = util.checkRequestBody(event.body, []);
              if(errors){
                  callback(null, {headers: {"content-type": "application/json"}, body: JSON.stringify(util.handleResponse({err: true, message: "Invalid Parameters", data: errors}))})
              }else{
                var data = { msisdn: msisdn, cookieId: cookieId, deviceId: deviceId};
                  userservice.getSingleUser( data,
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
      
    }else{
      context.succeed("No Payload received yet!!!")
    }
  },

}