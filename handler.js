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

    getRecord: (event, context, callback) => {
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
    },
  
    postRecord: (event, context, callback) => {
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
            )});
        });
    }             
}