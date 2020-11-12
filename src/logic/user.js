const { NotAllowedError, NotFoundError, AuthError } = require('../errors')
const validate = require('../utils/validate')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const config = require('../../config')

const { CLIENT_ENDPOINT, DATA_URL, JWT_SECRET } = config
const userService = {
    /**
     * @param { string } email to log in
     * 
     * @throws { Error } in case of empty parameter
     * @throws { Error } in case 
     */

     authenticateUser({ email }) {
         validate([{key: 'email', value: email, type: String}])
         return (async ()=> {
                // Find user by email
                let user
                try{
                    user = await this.findUserByEmail({ email })
                }catch(err){
                    if(err.name === 'NotFoundError') throw new NotFoundError(`user with email ${email} not found`)
                    throw Error(err.message)
                }
                //Sign the token with user data
                const { id, role } = user
                const token = jwt.sign({ sub: id, role }, JWT_SECRET, { expiresIn: '1 day' })
                return { token } 
            
         })()
     },

     findUserByEmail({ email }){
        validate([{key: 'email', value: email, type: String}])

        return (async ()=> {
            // Get the client data
            const clientData = await axios.get(`${DATA_URL}/${CLIENT_ENDPOINT}`) 

            if(clientData && clientData.data && !clientData.data.clients) throw new Error('No data from mocky')
            
            // Check to see if there is any client that matches the email
            const user = clientData.data.clients.find(client => {
                return client.email === email
            })

            if(!user) throw new NotFoundError(`user with email: ${email} not found`)

            return user
         })()
     },

     findUserByUserId({ userId }) {

     }
}

module.exports = userService