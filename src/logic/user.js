const { NotFoundError } = require('../errors')
const validate = require('../utils/validate')
const jwt = require('jsonwebtoken')
const config = require('../../config')
const { clientData, policyData } = require('../data')

const { JWT_SECRET } = config
const userService = {
 /**
 * Authenticates the user given an email
 * 
 * @param {string} email user's unique email
 * 
 * @returns {Promise<Object>} returns a Promise with the user's token and id
 * 
 * @throws {NotFoundError} if given email does not exist
 * 
 */
  authenticateUser ({ email }) {
    validate([{ key: 'email', value: email, type: String }])
    return (async () => {
      // Find user by email
      let user
      try {
        user = await this.findUserByEmail({ email })
      } catch (err) {
        if (err.name === 'NotFoundError') throw new NotFoundError(`user with email ${email} not found`)
        throw Error(err.message)
      }
      // Sign the token with user data
      const { id, role } = user
      const token = jwt.sign({ sub: id, role }, JWT_SECRET, { expiresIn: '1 day' })
      return { token, id }
    })()
  },

   /**
 * Finds user given an email
 * 
 * @param {string} email User's email
 * 
 * @returns {Promise<Object>} An object with the user's information
 * 
 * @throws {Error} If there is no data from the provided URL
 * @throws {NotFoundError} If no user with the given email is found
 * 
*/
  findUserByEmail ({ email }) {
    validate([{ key: 'email', value: email, type: String }])

    return (async () => {
      // Get the client data
      const clients = await clientData()

      if (!clients) throw new Error('No client data from mocky')

      // Check to see if there is any client that matches the email
      const user = clients.find(client => {
        return client.email === email
      })

      if (!user) throw new NotFoundError(`user with email: ${email} not found`)

      return user
    })()
  },

  /**
 * Finds user given a user id
 * 
 * @param {string} userId User's id
 * 
 * @returns {Promise<Object>} An object with the user's information
 * 
 * @throws {Error} If there is no data from the provided URL
 * @throws {NotFoundError} If no user with the given user id is found
 * 
*/
  findUserByUserId ({ userId }) {
    validate([{ key: 'userId', value: userId, type: String }])

    return (async () => {
      // Get the clients data
      const clients = await clientData()

      if (!clients) throw new Error('No client data from mocky')
      const user = clients.find(client => client.id === userId)

      if (!user) throw new NotFoundError(`user with userId: ${userId} not found`)

      return user
    })()
  },

/**
 * Finds user given a username
 * 
 * @param {string} userName User's name
 * 
 * @returns {Promise<Object>} An object with the user's information
 * 
 * @throws {Error} If there is no data from the provided URL
 * @throws {NotFoundError} If no user with the given email is found
 * 
*/
  findUserByUserName ({ userName }) {
    validate([{ key: 'userName', value: userName, type: String }])

    return (async () => {
      // Get the clients data
      const clients = await clientData()

      if (!clients) throw new Error('No client data from mocky')

      // As there might be more than one person with the same name, I decided to use filter
      const user = clients.filter(client => client.name === userName)

      if (!user || !user.length) throw new NotFoundError(`user with userName: ${userName} not found`)

      return user
    })()
  },

  /**
 * Finds user linked to a policy number
 * 
 * @param {string} policyNumber User's email
 * 
 * @returns {Promise<Object>} An object with the user's information
 * 
 * @throws {Error} If there is no data from the provided URL
 * @throws {NotFoundError} If the policy number does not exist
 * @throws {NotFoundError} If the policy number does not have any linked user
 * 
*/
  findUserLinkedToPolicyNumber ({ policyNumber }) {
    validate([{ key: 'policyNumber', value: policyNumber, type: String }])

    return (async () => {
      // Get the clients data
      const [clients, policies] = await Promise.all([clientData(), policyData()])

      if (!clients) throw new Error('No client data from mocky')
      if (!policies) throw new Error('No policy data from mocky')

      // find the policy linked to policy number
      const policy = policies.find((policy) => policy.id === policyNumber)

      if (!policy) throw new NotFoundError(`Policy number: ${policyNumber} does not have any user linked`)

      // Get client linked to found user id
      const user = clients.find(client => client.id === policy.clientId)

      if (!user) throw new NotFoundError(`No client found with ${policy.id} linked to ${policyNumber}`)

      return user
    })()
  }
}

module.exports = userService
