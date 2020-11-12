const { NotAllowedError, NotFoundError, AuthError } = require('../errors')
const validate = require('../utils/validate')
const axios = require('axios')
const config = require('../../config')

const { CLIENT_ENDPOINT, DATA_URL, POLICY_ENDPOINT } = config


const clientData = async () => { 
    const response = await axios.get(`${DATA_URL}/${CLIENT_ENDPOINT}`)

    return response && response.data && response.data.clients
}
const policyData = async () => { 
    const response = await axios.get(`${DATA_URL}/${POLICY_ENDPOINT}`)

    return response && response.data && response.data.policies
}

module.exports = {
    clientData,
    policyData
}