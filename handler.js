/**
 * Created by Jebutu Morifeoluwa on 20/08/2018.
 */

const client = require('./lib/connector');
const config = require('./config/config');
const service = require('./services/users');
const logging = require('./lib/logging');
var util = require('./lib/utility');

const logger = logging.create(config.logging);
const userservice = new service(client);

console.log(client);


module.exports = {

  Controller: (event, context, callback) => {
    if (event != ""){
      logger.info('ID ', event.httpMethod)
      
      switch(event.httpMethod){
          case "GET":
              userservice.getAllRecords((resp) => {
                  callback(null, {
                    headers: {"content-type": "application/json"}, 
                    body: JSON.stringify(util.handleResponse({
                        err: false, 
                        message: "Successfully Returned", 
                        data: resp
                    }))
                });
              });            
              break;
  
          case "POST":
            const query = JSON.parse(event.body);
                userservice.getSingleRecord( query,
                (resp) => {
                    callback(null, {
                        headers: {"content-type": "application/json"}, 
                        body: JSON.stringify(util.handleResponse({
                            err: false, 
                            message: "Successfully Returned A record", 
                            data: { "_index": resp._index,
                            "_type": resp._type,
                            "_id": resp._id 
                        }
                        })
                    )}
                    );
                });           
            break;
          
          default:
              // Send HTTP 501: Not Implemented
              logger.error("Error: unsupported HTTP method (" + event.httpMethod + ")");
              callback(null, { statusCode: 501 })
        }   
    }else{
      context.succeed("No Payload received yet!!!")
    }
  },
}