var elasticsearch=require('elasticsearch');
require('dotenv').config()

var client = new elasticsearch.Client( {  
  hosts: [
      // 'http://localhost:9200',
      // 'https://elastic:wh172epsDFnc2ysEoTRd3kb7@445b32f630a94902acdca0f817623584.us-east-1.aws.found.io:9243'
    'https://'+process.env.DB_USER+':'+process.env.DB_PASS+'@'+process.env.DB_HOST+':'+process.env.DB_PORT+'/',
    // 'https://[username]:[password]@[server]:[port]/'
  ]
});

module.exports = client;  