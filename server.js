const express = require('express')
const config = require('./config')
const fs = require('fs')
const packageJSON = require('./package.json')
const { DATA_URL, API_PORT } = config
//Upload the routes
const {
    user,
    policy
} = require('./src/routes')


const app = express()

// Defines the routes used.
app.use('/api',user)
app.use('/api',policy)

app.listen(API_PORT, ()=> {
    console.log(`${packageJSON.name} ${packageJSON.version} up and running on http://localhost:${API_PORT}`)
 })

