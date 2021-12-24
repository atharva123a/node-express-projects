const express = require('express')
const connectDB = require('./db/connect')

const notFound = require('./middleware/not-found')

const app = express()

const port = 3000;
// keeping our database access key a secret!
require('dotenv').config()

app.use(express.static('./public'))

app.use(express.urlencoded({"extended" : false}))

app.use(express.json())


const tasks = require('./routes/tasks')

const start = async()=>{
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(port, ()=>{
            console.log('server listening on port 3000');
        })
    }
    catch(error){
        console.log(error)
    }
}
/*this should always be placed before the middleware that handles
unfound resources because express reads code synchronously
or line by line
*/
app.use('/api/v1/tasks', tasks)
// this works for all other urls and is placed at the bottom intentionally!
app.use(express.json())

// makes sure we only run the server after connecting to db:
start()