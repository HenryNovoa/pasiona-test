const { NotFoundError } = require('../errors')
const validate = require('../utils/validate')
const { clientData, policyData } = require('../data')

const policyService = {

  // Get the list of policies linked to a user name
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
