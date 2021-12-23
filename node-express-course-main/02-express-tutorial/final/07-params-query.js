const express = require("express")
const app = express()
const { products } = require('./data')


app.get('/', (req, res)=>{
    // link to products page:
    res.send('<h1>Home Page</h1><a href="/api/products">Products</a>')
})

app.get('/api/v1/query', (req, res)=>{
    // here we are using the query object to get additional parameters from our request!
    // console.log(req.query)

    const {search, limit} = req.query;
    // initially it has all the data:
    let sortedProducts = [...products]
    // find some data that starts with the filters:
    if(search){
        sortedProducts = products.find((product)=>{
            return product.name.startsWith(search)
        }) 
    }
    // limit data to whatever values was told to limit it to:
    if(limit){
        // here slice does not mutate our array
        // also we are converting the string limit to an integer!
        const newArr = sortedProducts
        sortedProducts = newArr.slice(0, parseInt(limit))
    }
    // no data to send!
    if(sortedProducts.length < 1){
        res.status(200).json({
            'success' : true,
            "data" : []
        })
    }
    // send sorted data
    res.status(200).json(sortedProducts)

})


app.listen(5000, ()=>{
    console.log('server listening on port 5000...');
})