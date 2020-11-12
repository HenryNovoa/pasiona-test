const express = require('express')
const config = require('./config')
const fs = require('fs')
const cors = require('./src/utils/cors')
const packageJSON = require('./package.json')
const { DATA_URL, API_PORT } = config
//Upload the routes
const {
    user,
    policy
} = require('./src/routes')


const app = express()

app.use(cors)

// Defines the routes used.
app.use('/v2',user)
app.use('/v2',policy)

app.listen(API_PORT, ()=> {
    console.log(`${packageJSON.name} ${packageJSON.version} up and running on http://localhost:${API_PORT}`)
 })

