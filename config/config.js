/**
 * Created by Jebutu Morifeoluwa on 19/06/2018.
 */


const appName = 'Identity Manager Service';

const config = {
  app_name: appName,
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    console: process.env.LOG_ENABLE_CONSOLE || true
  },
  elasticSearch: {
    connection: {
      host: process.env.ELASTICSEARCH_HOST,
      port: process.env.ELASTICSEARCH_PORT,
    },
    documents: {
        index: 'identity-mapping-engine',
        type: 'users'
    },
    queryLimit: process.env.ELASTICSEARCH_QUERY_LIMIT,
    apiVersion: '5.5',
    loggingLevel: process.env.ELASTICSEARCH_LOGGING_LEVEL || 'trace',
  }
};

module.exports = config;
