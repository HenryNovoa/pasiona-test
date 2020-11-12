const { NotAllowedError, NotFoundError, AuthError } = require('../errors')
const validate = require('../utils/validate')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const config = require('../../config')
const { clientData, policyData } = require('../data')
 
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
                return token 
            
         })()
     },

     findUserByEmail({ email }){
        validate([{key: 'email', value: email, type: String}])

        return (async ()=> {
            // Get the client data
            const clients = await clientData()

            if(!clients) throw new Error('No client data from mocky')
            
            // Check to see if there is any client that matches the email
            const user = clients.find(client => {
                return client.email === email
            })

            if(!user) throw new NotFoundError(`user with email: ${email} not found`)

            return user
         })()
     },

     findUserByUserId({ userId }) {
        validate([{key: 'userId', value: userId, type: String}]) 

        return(async ()=>{
        // Get the clients data
        const clients = await clientData()

        if(!clients) throw new Error('No client data from mocky')
        const user = clients.find(client => client.id === userId)

        if(!user) throw new NotFoundError(`user with userId: ${userId} not found`)

        return user

    })()
    },

    findUserByUserName({ userName }) {
        validate([{key: 'userName', value: userName, type: String}]) 

        return(async ()=>{
        // Get the clients data
        const clients = await clientData()

        if(!clients) throw new Error('No client data from mocky')

        // As there might be more than one person with the same name, I decided to use filter
        const user = clients.filter(client => client.name === userName)

        if(!user || !user.length) throw new NotFoundError(`user with userId: ${userName} not found`)

        return user

    })()
    },

    findUserLinkedToPolicyNumber({ policyNumber }) {
        validate([{key: 'policyNumber', value: policyNumber, type: String}]) 

        return (async ()=> {
            // Get the clients data
        const clients = await clientData()

        if(!clients) throw new Error('No client data from mocky')

        // Get the policy data
        const policies = await policyData()
        if(!policies) throw new Error('No policy data from mocky')

        // find the policy linked to policy number
        const policy = policies.find((policy)=> policy.id === policyNumber)

        if(!policy) throw new NotFoundError(`Policy number: ${policyNumber} does not have any user linked`)
        
        // Get client linked to found user id 
        const user = clients.find(client => client.id === policy.clientId)

        if(!user) throw new NotFoundError(`No client found with ${policy.id} linked to ${policyNumber}`)

        return user

        })()
    }
}

module.exports = userService