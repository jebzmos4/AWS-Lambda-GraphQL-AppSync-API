/* eslint no-underscore-dangle: 0 */
/**
 * Created by Jebutu Morifeoluwa on 19/06/2018.
 */

const config = require('../config/config');
const logging = require('../lib/logging');
const dynamo = require('../lib/dynamoHelper');

const logger = logging.create(config.logging);

class UserService {
  /**
       * The constructor
       *
       * @param logger
       */
  constructor() {
    this.logger = logger;
  }

  /**
   * Get all user records based on search parameters from ElasticSearch
   * @param params (Object)
   */
  createUsers(params, callback) {
    this.logger.info('Creating User');
    return dynamo.createItem(params, (error, response) => {
      if (error){
          this.logger.error(error);
      }
      else {
          callback(response);
      }
    });
  }
}
module.exports = UserService;
