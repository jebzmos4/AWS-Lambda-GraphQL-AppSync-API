/* eslint-disable no-unused-vars */
/* eslint radix: ["error", "as-needed"] */
/**
 * Created by Jebutu Morifeoluwa on 19/04/2018.
 */

const config = require('../config/config');

class ESHelper {
  /**
     * The constructor
     *
     * @param ESClient - MongoDB client
     */
  constructor(client, logger) {
    this.ESClient = client;
    this.logger = logger;
  }

  /**
     * Fetches a single record from the connected MongoDB instance.
     *
     * @param params
     */

  health(callback) {
    this.logger.info('Checking ES Health');
    this.ESClient.cluster.health({}, (err, res, status) => {
        if (err) {
            this.logger.error(err, status);
        } else {             
            callback(res, status);
        }
    });
  }

  checkIndices(index, callback) {
      this.logger.info('Checking if Index Exist', index);
      this.ESClient.indices.exists({
          index: index
      },(err, res, status) => {
          if (err) {
              this.logger.error(err, status);
          } else{
              this.logger.info(res, status);
              callback(res, status);
          }
      })
  }


  /**
     * Fetches bulk records from the connected MongoDB instance.
     *
     * @param params
     */
    createIndices (index, callback) {
        this.logger.info('Creating index', index);
        this.ESClient.indices.create({  
            index: index
        }, (err,resp,status) => {
            if(err) {
                this.logger.error(err, status);
            }
            else {
                callback(resp, status);
            }
        })
    }

    getMappings (data, callback) {
        this.logger.info('Getting Mappings with', data);
        this.ESClient.indices.getMapping(data, (error,response) => {  
            if (error){
                this.logger.error(error.message);
            }
            else {
                callback(response);
            }
        });
    }

    putMapping (index, type, callback) {
        this.logger.info("Creating Mapping index");
        this.ESClient.indices.putMapping({
            index: index,
            type: type,
            body: {
            properties: { 
                account: { type: 'text' },
                bvn: { type: 'text' },
                cookieId: { type: 'text' },
                created_on: { type: 'date' },
                deviceId: { type: 'text' },
                email: { type: 'text' },
                msisdn: { type: 'text' },
                updated_at: { type: 'date' } }
            }
        }, (err,resp, status) => {
            if (err) {
              this.logger.error(err, status);
            }
            else {
                this.logger.info('Successfully Created Index', status);
                callback(resp);
            }
        });
    }

    search (data, callback) {
        this.logger.info('Searching DB with', data);
        this.ESClient.search(data,function (error, response,status) {
            if (error){
                this.logger.error("search error: "+error)
            }
            else {
                callback(response.hits.hits);
            }
        })
    }
}

module.exports = ESHelper;
