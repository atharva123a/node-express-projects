require('dotenv').config()
const express = require('express')
const app = express()

// middleware:
const errorHandlerMiddleware = require('./middleware/error-handler')
const notFoundMiddleware = require('./middleware/not-found')

// connect to db:
const connectDb =  require('./db/connect')

app.use(express.json())

// router:
const products = require('./routes/products')

app.get('/', (req, res)=>{
    res.send(
        `<h1>Store API</h1><a href="/api/v1/products">products route</a>`
        )
})

// set up our router:
app.use('/api/v1/products', products)
// using middleware:
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const port = process.env.PORT || 3000

// since it has to wait for us to connect to atlas it is async!
const start = async()=>{
    try {
        await connectDb(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listening on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}

start()