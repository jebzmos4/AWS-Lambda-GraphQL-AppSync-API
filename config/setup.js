client = require('../lib/connector');
const ESHelper = require('../lib/ESHelper');
const config = require('../config/config');
const logging = require('../lib/logging');

const logger = logging.create(config.logging);
const index = config.elasticSearch.documents.index;
const type = config.elasticSearch.documents.type;

const elastic = new ESHelper(client, logger);

elastic.checkIndices(index, (res) => {
    if (res) {
        logger.info('Elastic Search Index already exists', index);
    } else {
        elastic.createIndices(index, (res) => {
            logger.info('Elastic Search Index succesfully created', res);
            elastic.putMapping(index, type, logger.info);
        })
    }
});
