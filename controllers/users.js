const Response = require('../lib/response_manager');

/**
 * Created by Jebutu Morifeoluwa on 19/06/2018.
 */


class User {
  constructor(logger, authService) {
    this.logger = logger;
    this.service = authService;
  }
  /**
     *
     * @param req
     * @param res
     * @param next
     */

  addUser(req, res) {
    const { msisdn, cookieId, deviceId } = req.query;
    if (msisdn || cookieId || deviceId) {
      const params = req.query;
      return this.service.addUser(params)
        .then(data => Response.success(res, {
          error: false,
          message: 'No user record found. User successfully created',
          response: data
        }, 200))
        .catch(err => Response.failure(res, {
          error: true,
          message: 'Error occured while creating user',
          response: err
        }, 400));
    } return Response.failure(res, {
      error: true,
      message: 'Please atleast one of cookieId, mssisdn or deviceId',
      response: ''
    }, 400);
  }

  // get all user records
  getUser(req, res) {
    const params = req.query;
    if (Object.keys(params).length !== 0) {
      return this.service.getSingleUser(params)
        .then(response => Response.success(res, {
          message: 'User record was successfully fetched',
          response
        }, 200))
        .catch(error => Response.failure(res, {
          message: 'There was an error while querying from elastic search',
          response: error
        }, 404));
    }
    return this.service.getAllUsers()
      .then(response => Response.success(res, {
        message: 'User records were successfully fetched',
        response
      }, 200))
      .catch(error => Response.failure(res, {
        message: 'There was an error while querying from elastic search',
        response: error
      }, 404));
  }
}

module.exports = User;
