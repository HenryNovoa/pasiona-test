const express = require('express')
const bodyParser = require('body-parser')
const routeHandler = require('../route-handler')
const router = express.Router()

// Get Get the list of policies linked to a user name
router.post('/user/', (req,res) => {
    routeHandler(()=> {
        const { userName } } = req.body
        
        // TODO logic
    }, res)
})

module.exports = router