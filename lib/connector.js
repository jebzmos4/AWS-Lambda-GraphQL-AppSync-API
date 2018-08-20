/**
 * Created by Jebutu Morifeoluwa on 20/08/2018.
 */

const elasticsearch=require('elasticsearch');
require('dotenv').config()
const config = require('../config/config')

var client = new elasticsearch.Client({
  host: `${config.elasticSearch.connection.host}:${config.elasticSearch.connection.port}`,
  log: config.elasticSearch.loggingLevel
});

console.log(config.elasticSearch.connection);
module.exports = client;  