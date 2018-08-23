/* eslint no-underscore-dangle: 0 */
/**
 * Created by Jebutu Morifeoluwa on 19/06/2018.
 */

const R = require('ramda');
const Sanitizer = require('../lib/sanitizer');
const config = require('../config/config');
const uuid = require('uuid');
const moment = require('moment');
const logging = require('../lib/logging');

const logger = logging.create(config.logging);

class UserService {
  /**
       * The constructor
       *
       * @param elasticSearchClient
       */
  constructor(elasticSearchClient) {
    this.elasticSearchClient = elasticSearchClient;
    this.index = config.elasticSearch.documents.index;
    this.type = config.elasticSearch.documents.type;
    this.logger = logger;
  }

  addRecord(params, callback) {
    this.logger.info('Adding new record');
    const data = params;
    let { msisdn } = data;
    msisdn = Sanitizer.normalizeMSISDN(msisdn);
    const tapId = uuid();
    data.msisdn = msisdn;
    data.created_on = moment();
    data.updated_at = moment();
    return this.elasticSearchClient.create({
      index: this.index,
      type: this.type,
      id: tapId,
      body: params
    },function(err,resp,status) {
      if(err) {
          this.logger.error(err);
      }
      else {
          callback(resp);
      }
  });
  }

  /**
   * Get all user records based on search parameters from ElasticSearch
   * @param params (Object)
   */
  getAllRecords(callback) {
    this.logger.info('Getting all records');
    return this.elasticSearchClient.search({
      index: this.index,
      type: this.type,
    },function (error, response, status) {
      if (error){
          this.logger.error(error);
      }
      else {
          callback(response.hits.hits);
      }
    });
  }


  /**
   * This returns a single record from ElasticSearch
   * @param param (String)
   */
  getSingleRecord(param, callback) {
    this.logger.info('Getting a single record', param);
    if (!R.has('msisdn', param) && !R.has('cookieId', param) && R.has('deviceId', param)) {
      return Response.failure({ message: 'Param cannot be empty' });
    }
    this.logger.info('Querying single user');
    let body = `${param.msisdn} ${param.deviceId} ${param.cookieId}`;
    return this.elasticSearchClient.search({
      index: this.index,
      type: this.type,
      body: {
        "query": {
            "bool": {
                "should": [
                    {
                        "match": {
                            "msisdn": {
                                "query": param.msisdn || ""
                            }
                        }
                    },
                    {
                        "match": {
                            "cookieId": {
                                "query": param.cookieId || ""
                            }
                        }
                    },
                    {
                        "match": {
                            "deviceId": {
                                "query": param.deviceId || ""
                            }
                        }
                    }
                ]
            }
        },
        "from": 0,
        "size": 1
    }
    }).then((res) => {
      if (res.hits.total !== 0) {
        this.logger.info('User found for this params');
        return this.updateRecord(param, res,callback );
      } this.logger.info('No user found for this params');
      return this.addRecord(param, callback);
    }).catch(err => console.error(err));
  }

  updateRecord(param, res, callback) {
    this.logger.info('Updating with new params (if any)');
    const msisdn = Sanitizer.normalizeMSISDN(param.msisdn);
    const tagId = res.hits.hits[0]._id;
    return this.elasticSearchClient.update({
      index: this.index,
      type: this.type,
      id: tagId,
      body: {
        doc: {
          msisdn,
          deviceId: param.deviceId || '',
          cookieId: param.cookieId || '',
          email: param.email || '',
          bvn: param.bvn || '',
          account: param.account || ''
        }
      }
    }).then(result => callback(result)).catch(err => callback(err));
  }
}
module.exports = UserService;
