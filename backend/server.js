require('dotenv').config()
const express = require('express')
const cors = require('cors')
const UserRoutes = require('./routes/UserRoutes')

const app = express()

// config json res
app.use(express.json())

// CORS
app.use(cors({ credentials: true, origin: 'http://localhost:3000'}))

// Public folder
app.use(express.static('public'))

// ROUTES
app.use('/users', UserRoutes)


// PORT
const port = process.env.PORT || 3000

// Run server
app.listen(port,()=>{
    console.log(`App running on port ${port}`)
})