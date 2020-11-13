const config = require('../../config')
const { JWT_SECRET } = config
const jwt = require('jsonwebtoken')

const { NotAllowedError } = require('../errors')

// This is the middleware in charge of handling roles, it recieves an array of roles,
// and will be verified with the jsonwebtoken, if successful, it will continue on to the api endpoint
// If not, it will give a 403 forbidden error
function authorize (roles = []) {
  if (typeof roles === 'string') {
    roles = [roles]
  }
  return (req, res, next) => {
    try {
      const { token, body: { tokenId } } = req
      const { sub, role } = jwt.verify(token, JWT_SECRET)

      if (tokenId !== sub) throw Error('token sub does not match user id')

      // If there are roles and is included in the role that the json web token gave us
      if (roles.length && !roles.includes(role)) {
        throw new NotAllowedError('Insufficient Permissions')
      }

      req.sub = sub

      req.role = role

      next()
    } catch (error) {
      if (error instanceof NotAllowedError) {
        res.status(403).json({
          error: error.message
        })
      } else {
        res.status(400).json({
          error: error.message
        })
      }
    }
  }
}

module.exports = authorize
