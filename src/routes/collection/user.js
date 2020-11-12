const express = require('express')
const routeHandler = require('../route-handler')
const router = express.Router()
const Role = require('../../utils/role')
const { userService } = require('../../logic')
const authorize = require('../../middleware/authorize')
const bearerTokenParser = require('../../middleware/bearer-token-parser')

// authenticate user
router.post('/user/auth', (req, res) => {
  routeHandler(async () => {
    const { email } = req.body

    const token = await userService.authenticateUser({ email })

    res.json({
      message: 'Logged in!',
      data: { token }
    })
  }, res)
})

// Get user data filtered by user id
router.post('/user/id', [bearerTokenParser, authorize([Role.admin, Role.users])], (req, res) => {
  routeHandler(async () => {
    const { userId } = req.body

    const user = await userService.findUserByUserId({ userId })

    res.json({
      message: 'user successfully retrieved',
      data: { user }
    })
  }, res)
})

// Get userdata filtered by userName
router.post('/user/name', [bearerTokenParser, authorize([Role.admin, Role.users])], (req, res) => {
  routeHandler(async () => {
    const { userName } = req.body

    const user = await userService.findUserByUserName({ userName })

    res.json({
      message: 'user successfully retrieved',
      data: { user }
    })
  }, res)
})

// Get user linked to a policy data
router.post('/user/policy', [bearerTokenParser, authorize(Role.admin)], (req, res) => {
  routeHandler(async () => {
    const { policyNumber } = req.body

    const user = await userService.findUserLinkedToPolicyNumber({ policyNumber })

    res.json({
      message: 'user successfully retrieved',
      data: { user }
    })
  }, res)
})
module.exports = router
