/* eslint-disable no-unused-vars */
/* eslint radix: ["error", "as-needed"] */

const config = require('../config/config');
const AWS = require("aws-sdk")
AWS.config.update({
    region: config.dynamodb.region
});

const dynamodb = new AWS.DynamoDB();

class DynamoHelper {
  /**
     * The constructor
     *
     * @param logger - logger client
     */
  constructor(logger) {
    this.logger = logger;
  }

  /**
     * Fetches a single record from the connected DynamoDb instance.
     *
     * @param params
     */

  
  init() {
    this.logger.info('Setting up DynamoDB');
    const params = {
        TableName : config.dynamodb.tableName,
        KeySchema: [       
            { AttributeName: "firstname", KeyType: "HASH"},  //Partition key
            { AttributeName: "email", KeyType: "RANGE" }  //Sort key
        ],
        AttributeDefinitions: [       
            { AttributeName: "firstname", AttributeType: "N" },
            { AttributeName: "email", AttributeType: "S" }
        ],
        ProvisionedThroughput: {       
            ReadCapacityUnits: 10, 
            WriteCapacityUnits: 10
        }
    }

    dynamodb.createTable(params, (err, data) => {
        if (data != null) {
            this.logger.info('Setting up DynamoDB');("Created table");
        }
        else if (err || err.message.includes('already exists')) {
            this.logger.info('Setting up DynamoDB');("Unable to create table becuase already exists.");
        }
        else {
            this.logger.error('Setting up DynamoDB');("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
        }
    });
  }

  createItem(params) {
    this.logger.info('Adding new Item to DynamoDB');
    dynamodb.putItem(params, (err, data) => {
        if (err) {
            this.logger.info(`Error occured while adding record ${JSON.stringify(err, null, 2)}`);
        } else {
            this.logger.info(`Successfully added record to DynamoDB ${JSON.stringify(data, null, 2)}`);
        }
    })
  }

  getItem(params) {
    this.logger.info('Fetching Item from DynamoDB');
    dynamodb.getItem(params, (err, data) => {
        if (err) {
            this.logger.info(`Error occured while adding record ${err}`);
        } else {
            this.logger.info(`Successfully added record to DynamoDB ${data}`);
        }
    })
  }

  updateItem(params) {
    this.logger.info('Updating item in DynamoDB');
    dynamodb.updateItem(params, (err, data) => {
        if (err) {
            this.logger.info(`Error occured while adding record ${err}`);
        } else {
            this.logger.info(`Successfully added record to DynamoDB ${data}`);
        }
    })
  }

  deleteItem(params) {
    this.logger.info('Deleting Item from DynamoDB');
    dynamodb.deleteItem(params, (err, data) => {
        if (err) {
            this.logger.info(`Error occured while adding record ${err}`);
        } else {
            this.logger.info(`Successfully added record to DynamoDB ${data}`);
        }
    })
  }
}

module.exports = DynamoHelper;
