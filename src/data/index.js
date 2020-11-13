const axios = require('axios')
const config = require('../../config')

const { CLIENT_ENDPOINT, DATA_URL, POLICY_ENDPOINT } = config

// Corresponds to the clients of the company
const clientData = async () => {
  const response = await axios.get(`${DATA_URL}/${CLIENT_ENDPOINT}`)

  return response && response.data && response.data.clients
}

// Corresponds to the policies of the company
const policyData = async () => {
  const response = await axios.get(`${DATA_URL}/${POLICY_ENDPOINT}`)

  return response && response.data && response.data.policies
}

module.exports = {
  clientData,
  policyData
}
