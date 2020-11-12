const express = require('express')
const bodyParser = require('body-parser')
const jsonBodyParser = bodyParser.json({ limit: '100mb' })
const routeHandler = require('../route-handler')
const router = express.Router()


// authenticate user
router.post('/user/auth', jsonBodyParser, (req, res) => {
    routeHandler(()=> {
        const { email } = req.body
        
        // TODO logic
    }, res)
})
// Get user data filtered by user id
router.post('/user/id', (req,res) => {
    routeHandler(()=> {
        const { userId } } = req.body
        
        // TODO logic
    }, res)
})

// Get userdata filtered by userName
router.post('/user/name', (req,res) => {
    routeHandler(()=> {
        const { userName } } = req.body
        
        // TODO logic
    }, res)
})

// Get user linked to a policy data
router.post('/user/policy', (req,res) => {
    routeHandler(()=> {
        const { userName } = req.body
        
        // TODO logic
    }, res)
})

module.exports = router