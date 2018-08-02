const _ = require('lodash');
const bodybuilder = require('bodybuilder');

class Sanitizer {
  static sanitizeESResults(results) {
    if (results.length > 0) {
      return _.map(results, '_source');
    }
    return results;
  }

  /**
     * Used to normalize the passed in MSISDN
     *
     * @param {String} phoneNumber MSISDN
     * @param {Boolean} includePlus Boolean deciding whether to include + as the MSISDN prefix
     * @param {String} countryCode indicates the country dialing code for the MSISDN
     * @returns {String} msisdn
     */
  static normalizeMSISDN(phoneNumber, includePlus = false, countryCode = '234') {
    let msisdn = phoneNumber;

    if (!msisdn) { return ''; }
    if (msisdn.length === 14) {
      msisdn = `${countryCode}${msisdn.substr(4)}`;
    }
    msisdn = msisdn.replace(/\s+/g, '');
    msisdn = msisdn.replace('+', '');
    if (Number.isNaN(msisdn)) {
      return '';
    }

    if (msisdn.match(/^234/i)) {
      msisdn = `0${msisdn.substr(3)}`;
    }
    if (msisdn.length === 11) {
      msisdn = `+${countryCode}${msisdn.substr(1)}`;
      if (!includePlus) {
        msisdn = msisdn.replace('+', '');
      }
      return msisdn;
    }
    return '';
  }


  /**
     * Format the ElasticSearch query from passed in
     * parameters and return the query object back
     *
     * @param msisdn - the user ID for the user you wish to search for
     * @param others - other query parameter
     * @param from
     * @param size
     * @returns {{}}
     */
  static getFormattedESQuery(msisdn = null, others = {}, from = null, size = null) {
    let body; // define empty query body
    const rawQuery = bodybuilder();
    if (from) { rawQuery.from(from); }

    if (size) { rawQuery.size(size); }

    // if (others.sort && others.order) { rawQuery.sort(others.sort, [others.order]); }

    // make sure we return only records that were not previously deleted
    // rawQuery.query('match', 'deleted', false);

    /*
       * QUERY parameter overrides other search options
       * Fields for general search
       * user_id
       * service_id
       * msisdn
       * operator
       * created_on
       */
    if (others.query) {
      rawQuery.rawOption('query', {
        query_string: {
          fields: [
            'msisdn',
            'cookieId',
            'deviceId',
            'email',
            'bvn',
            'account'
          ],
          query: others.query
        }
      });
    } else {
      if (msisdn) {
        rawQuery.query('match', 'msisdn', msisdn);
      }
      if (others.service_id) { rawQuery.query('match', 'deviceId', others.deviceId); }

      if (others.msisdn) { rawQuery.query('match', 'msisdn', others.msisdn); }

      if (others.operator) { rawQuery.query('match', 'email', others.operator); }
    } rawQuery.sort('created_on', 'desc');
  // } rawQuery.sort('created_on', {'order': 'desc', 'unmapped_type' : 'long'});

    // Query with start date and end date
    if (others.start_date && others.end_date) {
      rawQuery.query('range', 'created_on', { gte: parseInt(others.start_date, 10), lte: parseInt(others.end_date, 10) });
    }

    // Build final query here
    if (others.version) {
      body = rawQuery.build(others.version.toLowerCase());
    } else { // defaults to the version 1 if no version was supplied
      body = rawQuery.build('v1');
    }
    return body;
  }
}

module.exports = Sanitizer;
