/**
 * This is used in all API responses
 */
class Response {
  /**
   *
   * @param {boolean} success - did the response succeed
   * @param {*} data - any data to send back
   * @param {*} error - if there were any errors
   */
  constructor({success, data, message, errors = null}) {
    this.success = success
    this.data = data
    this.message = message
    this.errors = errors
  }
}

export default Response