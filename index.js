'use strict';
const util = require('./lib/utility');
const userService = require('./services/users');

console.log('Loading function');

exports.handler = (event, context, callback) => {
    callback(null, {
        headers: {"content-type": "application/json"}, 
        body: JSON.stringify(util.handleResponse({
            err: false, 
            message: "Welcome to the AWS GRAPHQL Lambda", 
            data: ""
        }))
    });
};

exports.getUser =  (event, context, callback) => {
    userService.getAllRecords((resp) => {
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

exports.createUser = (event, context, callback) => {
    const query = JSON.parse(event.body);
    userService.createUser( query,
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