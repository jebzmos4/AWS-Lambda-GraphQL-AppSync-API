/**
 * Created by Jebutu Morifeoluwa on 20/08/2018.
 */

const express = require('express');
const graphqlHTTP = require('express-graphql');

const config = require('./config/config');
const Service = require('./services/users');
const util = require('./lib/utility');
const schema = require('./lib/graphql-schema');
const dynamo = require('./lib/dynamoHelper');

const userService = new Service();

// The root provides a resolver function for each API endpoint
const root = {
  base: () => {
    lambda.index()
  },
  getUsers: () => {
      lambda.getUser()
  },
  createUsers: () => {
    lambda.createUser()
}
};

const app = express();
app.use('/', graphqlHTTP({
  schema: schema,
  rootValue: root,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/');

lambda = {

    index: (callback) => {
        return({
        headers: {"content-type": "application/json"}, 
        body: JSON.stringify(util.handleResponse({
            err: false, 
            message: "Welcome to the AWS GRAPHQL Lambda", 
            data: ""
            }))
        });
    },

    getUser: (event, context, callback) => {
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
  
    createUser: (event, context, callback) => {
        console.log(event);
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
}