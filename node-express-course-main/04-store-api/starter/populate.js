require('dotenv').config()

const connectDb = require('./db/connect')

const productData = require('./products.json')

const Product = require('./models/product')

const start = async()=>{
    try {
        await connectDb(process.env.MONGO_URI)
        await Product.deleteMany()
        await Product.create(productData)
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}


start()