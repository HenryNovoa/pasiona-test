const express = require('express')
const routeHandler = require('../route-handler')
const router = express.Router()
const Role = require('../../utils/role')
const { policyService } = require('../../logic')
const authorize = require('../../middleware/authorize')
const bearerTokenParser = require('../../middleware/bearer-token-parser')

// Get the list of policies linked to a user name
router.post('/policy/userName', [bearerTokenParser, authorize(Role.admin)], (req, res) => {
  routeHandler(async () => {
    const { userName } = req.body

    const policies = await policyService.findPoliciesByUserName({ userName })

    res.json({
      message: 'policies found',
      data: policies
    })
  }, res)
})

module.exports = router
