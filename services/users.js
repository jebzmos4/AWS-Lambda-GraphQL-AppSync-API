/* eslint no-underscore-dangle: 0 */


const Sanitizer = require('../lib/sanitizer');
// const config = require('../config/settings');
const uuid = require('uuid');
const moment = require('moment');

/**
 * Created by Jebutu Morifeoluwa on 19/06/2018.
 */

class UserService {
  /**
       * The constructor
       *
       * @param logger
       * @param elasticSearchClient
       */
  constructor(elasticSearchClient) {
    // this.logger = logger;
    this.elasticSearchClient = elasticSearchClient;
    // this.index = config.elasticSearch.documents.userProfile.index;
    // this.type = config.elasticSearch.documents.userProfile.type;
    this.index = 'identity';
    this.type = 'user';
  }

  addUser(params, callback) {
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
          console.log(err);
      }
      else {
          callback(resp);
      }
  });
  }

  /**
   * Get all user records based on search parameters from ElasticSearch
   * @param params (Object)
   * @returns Promise
   */
  getAllUsers(callback) {
    return this.elasticSearchClient.search({
      index: this.index,
      type: this.type,
    },function (error, response,status) {
      if (error){
          console.log("search error: "+error)
      }
      else {
          callback(response.hits.hits);
      }
  });
  }


  /**
   * This returns a single user's
   * record from ElasticSearch
   * @param param (String)
   * @returns Promise
   */
  getSingleUser(param, callback) {
    let searchParam = param;
    let response;
    const { msisdn, cookieId, deviceId } = param;
    if (msisdn) {
      searchParam.msisdn = Sanitizer.normalizeMSISDN(msisdn);
    }
    if (msisdn && deviceId && cookieId) {
      response = this.elasticSearchClient.search({
        index: this.index,
        type: this.type,
        body: {
          query: {
            bool: {
              should: [
                { match: { msisdn: searchParam.msisdn } },
                { match: { deviceId: searchParam.deviceId } },
                { match: { cookieId: searchParam.cookieId } }
              ],
              minimum_should_match: 2
            }
          }
        }
      });
    } else if (msisdn) {
      searchParam = msisdn;
    } else if (cookieId) {
      searchParam = cookieId;
    } else if (deviceId) {
      searchParam = deviceId;
    }
    searchParam = Sanitizer.getFormattedESQuery(null, searchParam);
    response = this.elasticSearchClient.search({
      index: this.index,
      type: this.type,
      body: searchParam
    });

    return response.then((data) => {
      
      if (data.hits.total !== 0) {
        // this.logger.info('Data found for this params. Updated with new params (if any)');
        const tagId = data.hits.hits[0]._id;
        return this.elasticSearchClient.update({
          index: this.index,
          type: this.type,
          id: tagId,
          body: {
            doc: {
              msisdn: param.msisdn,
              deviceId: param.deviceId || '',
              cookieId: param.cookieId || '',
              email: param.email || '',
              bvn: param.bvn || '',
              account: param.account || ''
            }
          }
        }, function(err,resp,status) {
          if(err) {
              console.log(err);
          }
          else {
              callback(resp);
          }
        });
      }else{
      }
      // } this.logger.info('No record found. creating User record');
      return this.addUser(searchParam, callback);
    }, (err)=>{ 
      console.log("An error occured")
      console.log("Error", searchParam.query.match.msisdn)
    
    });
  }
}
module.exports = UserService;
