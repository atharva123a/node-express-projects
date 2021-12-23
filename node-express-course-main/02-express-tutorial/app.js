const { application } = require("express");
const express = require("express")
const app = express()

const people = require('./routes/people')
const auth = require('./routes/auth')

// you cannot use req.body for parsing forms unless you use ure
app.use(express.urlencoded({urlencoded : false}))

// for parsing javascript body requests:
app.use(express.json())

// use the peopleRouter in our case!
app.use('/api/people', people)

// use the login router for handling routes:
app.use('/login', auth)

// render static files:
app.use(express.static('./metho ds-public'));



app.listen(5000, ()=>{
    console.log('server listening on port 5000...');
})