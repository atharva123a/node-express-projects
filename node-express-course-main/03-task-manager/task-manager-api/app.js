const express = require('express')

const app = express()

const router = require('./routes/tasks')
app.use(express.static('./public'))

app.use(express.json())
app.use(express.urlencoded({extended : false}))

app.use('/api/v1/tasks', router)

app.listen(5000, ()=>{
    console.log('server listening on port 5000');
})