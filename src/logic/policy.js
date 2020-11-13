const { NotFoundError } = require('../errors')
const validate = require('../utils/validate')
const { clientData, policyData } = require('../data')

const policyService = {

  /**
 * Finds user policies depending on user name 
 * 
 * @param {string} userName User's name
 * 
 * @returns {Promise<Array>} An array of each user found containing an array of their policies
 * 
 * @throws {NotFoundError} If a user name is not found or has no policies with said name
 * @throws {NotFoundError} If no policies with given name are not found
 * @throws {Error} If there is no data from the provided URL
*/
  findPoliciesByUserName ({ userName }) {
    validate([{ key: 'userName', value: userName, type: String }])

    return (async () => {
      // Get the clients data
      const [clients, policies] = await Promise.all([clientData(), policyData()])

      if (!clients) throw new Error('No client data from mocky')
      if (!policies) throw new Error('No policy data from mocky')

      // find the users with the user name, there can be more than one so I decided to use filter
      const users = clients.filter(client => client.name === userName)

      if (!users || !users.length) throw new NotFoundError(`user with username: ${userName} not found`)

      // Find the policies linked to the users found
      // For every user that has been found, we find each policy that
      const foundPolicies = []
      users.forEach(user => {
        const resultPolicies = policies.filter(policy => policy.clientId === user.id)
        if (resultPolicies && resultPolicies.length) {
          foundPolicies.push(resultPolicies)
        }
      })

      if (!foundPolicies.length) throw new NotFoundError(`No policies with client ${userName} found`)

      return foundPolicies
    })()
  }
}

module.exports = policyService
