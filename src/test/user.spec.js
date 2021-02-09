const { expect } = require('chai')
const sinon = require('sinon')
const axios = require('axios')
const clients = require('./stub-data/clients.json')
const policies = require('./stub-data/policies.json')
const { policyService, userService } = require('../logic')
const { NotFoundError, ValueError } = require('../errors')

const SPEC_EMAIL = 'britneyblankenship@quotezart.com'
const SPEC_ID = 'a0ece5db-cd14-4f21-812f-966633e7be86'
const SPEC_USERNAME = 'Britney'
const POLICY_NUMBER = '7b624ed3-00d5-4c1b-9ab8-c265067ef58b'

describe('userService', () => {
  let token
  let id
  let randomUser

  before(async () => {
    const data = sinon.stub(axios, 'get')
    data.resolves({ data: clients })
    randomUser = `user-${Math.random()}`
    const user = await userService.authenticateUser({ email: SPEC_EMAIL })
    token = user.token
    id = user.id
    // Restore the axios function after authenticating
    axios.get.restore()
  })

  describe('authenticateUser', () => {
    before(async () => {
      const users = sinon.stub(axios, 'get')
      users.resolves({ data: clients })
    })

    it('should authenticate correctly on valid email', async () => {
      const user = await userService.authenticateUser({ email: SPEC_EMAIL })

      expect(user.id).to.equal(SPEC_ID)
    })

    it('should fail on non valid email', async () => {
      try {
        await userService.authenticateUser({ email: randomUser })
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundError)
        expect(error.message).to.equal(`user with email ${randomUser} not found`)
      }
    })

    it('should fail on non string email', async () => {
      const nonStringEmail = true
      try {
        await userService.authenticateUser({ email: nonStringEmail })
      } catch (error) {
        expect(error).to.be.instanceOf(TypeError)
        expect(error.message).to.equal(`email: ${nonStringEmail} is not a string`)
      }
    })

    after(() => {
      axios.get.restore()
    })
  })

  describe('find user by email', () => {
    before(async () => {
      const users = sinon.stub(axios, 'get')
      users.resolves({ data: clients })
    })

    it('should succeed on finding user given a valid email', async () => {
      const user = await userService.findUserByEmail({ email: SPEC_EMAIL })

      expect(user.id).to.equal(SPEC_ID)
      expect(user.name).to.equal(SPEC_USERNAME)
      expect(user.email).to.equal(SPEC_EMAIL)
    })

    it('should fail on given a non valid username', async () => {
      try {
        await userService.findUserByEmail({ email: randomUser })
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundError)
        expect(error.message).to.equal(`user with email: ${randomUser} not found`)
      }
    })

    it('should fail on given a no string username', async () => {
      const nonStringUserName = true
      try {
        await userService.findUserByEmail({ email: nonStringUserName })
      } catch (error) {
        expect(error).to.be.instanceOf(TypeError)
        expect(error.message).to.equal(`email: ${nonStringUserName} is not a string`)
      }
    })

    it('should fail on given empty username', async () => {
      const emptyString = ''
      try {
        await userService.findUserByEmail({ email: emptyString })
      } catch (error) {
        expect(error).to.be.instanceOf(ValueError)
        expect(error.message).to.equal('email is empty or blank')
      }
    })

    after(() => {
      axios.get.restore()
    })
  })

  describe('find user by id', () => {
    before(async () => {
      const users = sinon.stub(axios, 'get')
      users.resolves({ data: clients })
    })

    it('should succeed on finding user given a valid userId', async () => {
      const user = await userService.findUserByUserId({ userId: SPEC_ID })

      expect(user.id).to.equal(SPEC_ID)
      expect(user.name).to.equal(SPEC_USERNAME)
      expect(user.email).to.equal(SPEC_EMAIL)
    })

    it('should fail on given a non valid username', async () => {
      try {
        await userService.findUserByUserId({ userId: randomUser })
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundError)
        expect(error.message).to.equal(`user with userId: ${randomUser} not found`)
      }
    })

    it('should fail on given a no string userId', async () => {
      const nonStringUserId = true
      try {
        await userService.findUserByUserId({ userId: nonStringUserId })
      } catch (error) {
        expect(error).to.be.instanceOf(TypeError)
        expect(error.message).to.equal(`userId: ${nonStringUserId} is not a string`)
      }
    })

    it('should fail on given empty userId', async () => {
      const emptyString = ''
      try {
        await userService.findUserByUserId({ userId: emptyString })
      } catch (error) {
        expect(error).to.be.instanceOf(ValueError)
        expect(error.message).to.equal('userId is empty or blank')
      }
    })

    after(() => {
      axios.get.restore()
    })
  })

  describe('find user by user name', () => {
    before(async () => {
      const users = sinon.stub(axios, 'get')
      users.resolves({ data: clients })
    })

    it('should succeed on finding user given a valid userId', async () => {
      const user = await userService.findUserByUserName({ userName: SPEC_USERNAME })
      expect(user[0].name).to.equal(SPEC_USERNAME)
    })

    it('should fail on given a non valid username', async () => {
      try {
        await userService.findUserByUserName({ userName: randomUser })
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundError)
        expect(error.message).to.equal(`user with userName: ${randomUser} not found`)
      }
    })

    it('should fail on given a no string username', async () => {
      const nonStringUserName = true
      try {
        await userService.findUserByUserName({ userName: nonStringUserName })
      } catch (error) {
        expect(error).to.be.instanceOf(TypeError)
        expect(error.message).to.equal(`userName: ${nonStringUserName} is not a string`)
      }
    })

    it('should fail on given empty userName', async () => {
      const emptyString = ''
      try {
        await userService.findUserByUserName({ userName: emptyString })
      } catch (error) {
        expect(error).to.be.instanceOf(ValueError)
        expect(error.message).to.equal('userName is empty or blank')
      }
    })

    after(() => {
      axios.get.restore()
    })
  })

  describe('find user linked to policy number', () => {
    beforeEach(() => {
      const data = sinon.stub(axios, 'get')
      data.onCall(0).resolves({ data: clients })
      data.onCall(1).resolves({ data: policies })
    })
    it('should succeed on finding user given a valid policy number', async () => {
      const user = await userService.findUserLinkedToPolicyNumber({ policyNumber: POLICY_NUMBER })

      expect(user.id).to.equal(SPEC_ID)
      expect(user.name).to.equal(SPEC_USERNAME)
      expect(user.email).to.equal(SPEC_EMAIL)
    })

    it('should fail on given a non valid policy number', async () => {
      try {
        await userService.findUserLinkedToPolicyNumber({ policyNumber: randomUser })
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundError)
        expect(error.message).to.equal(`Policy number: ${randomUser} does not have any user linked`)
      }
    })

    it('should fail on given a no string policy number', async () => {
      const nonStringUserName = true
      try {
        await userService.findUserLinkedToPolicyNumber({ policyNumber: nonStringUserName })
      } catch (error) {
        expect(error).to.be.instanceOf(TypeError)
        expect(error.message).to.equal(`policyNumber: ${nonStringUserName} is not a string`)
      }
    })

    it('should fail on given empty userName', async () => {
      const emptyString = ''
      try {
        await userService.findUserLinkedToPolicyNumber({ policyNumber: emptyString })
      } catch (error) {
        expect(error).to.be.instanceOf(ValueError)
        expect(error.message).to.equal('policyNumber is empty or blank')
      }
    })

    afterEach(() => {
      axios.get.restore()
    })
  })
})
