
// reason for this file is that it makes importing these errors easier

const CustomAPIError = require('./custom-error')
const BadRequestError = require('./bad-request')
const UnauthenticatedError = require('./unauthenticated')

module.exports = {CustomAPIError,
    BadRequestError,
    UnauthenticatedError
}