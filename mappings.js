var client = require('../libraries/elasticsearch_conn.js');
var _config = require('../../config/config');


var _collection = _config.elasticsearch.indices.products;
var _type = _config.elasticsearch.indices.type;

module.exports = {

  putMapping: function(){

  
client.indices.putMapping({
  index: _collection,
  type: _type,
  body: {
    properties: { 
        account: { type: 'string' },
        bvn: { type: 'string' },
        cookieId: { type: 'string' },
        created_on: { type: 'date' },
        deviceId: { type: 'string' },
        email: { type: 'string' },
        msisdn: { type: 'text' },
        updated_at: { type: 'date' } }
  }
},function(err,resp,status){
    if (err) {
      console.log(err);
    }
    else {
      console.log(resp);
    }
})
  },
};