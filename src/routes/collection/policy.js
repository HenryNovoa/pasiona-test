const express = require('express')
const bodyParser = require('body-parser')
const routeHandler = require('../route-handler')
const router = express.Router()
const { policyService } = require('../../logic')

// Get Get the list of policies linked to a user name
router.post('/policy/userName', (req,res) => {
    routeHandler(async ()=> {
        const { userName } = req.body
        
        const policies = await policyService.findPoliciesByUserName({ userName })

        res.json({
            message: 'policies found',
            data: policies
        })
    }, res)
})

module.exports = router