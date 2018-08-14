const elasticsearch=require('elasticsearch');
require('dotenv').config()
const config = require('../config/config')

var client = new elasticsearch.Client({
  host: `${config.elasticSearch.connection.host}:${config.elasticSearch.connection.port}`,
  log: config.elasticSearch.loggingLevel
});

module.exports = client;  