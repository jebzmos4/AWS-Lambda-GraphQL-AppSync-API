/**
 * Created by Jebutu Morifeoluwa on 19/06/2018.
 */


const appName = 'AWS-GRAPHQL-DYNAMODB LAMBDA API';

const config = {
  app_name: appName,
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    console: process.env.LOG_ENABLE_CONSOLE || true
  },
  dynamodb: {
    region: process.env.DYNAMODB_REGION,
    tableName: process.env.DYNAMODB_TABLE_NAME
  }
};

module.exports = config;
