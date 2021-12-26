
const express = require('express')

const Product = require('../models/product')

require('express-async-errors')

// get static products:
const getProductsStatic = async(req, res)=>{
    
    const products = await Product.find({}).sort('-name')
    res.status(200).json({products, nBHits : products.length})
}

const getProducts = async(req, res)=>{
    // this allows to get rid of query params that do not exist!
    const { featured, name, company, sort, fields, numeric} = req.query
    const queryObj = {}
    if(featured){
        queryObj.featured = featured === 'true'? true : false
    }
    if(name){
        // we can also use regex to look for patterns inside our code!
        queryObj.name = {$regex : name, $options : 'i'}
    }
    if(company){
        queryObj.company = company
    }

    let result = Product.find(queryObj)

    if(sort){
        // we are chaining query methods if they exist:
        // we split and join for passing multiple sort queries:
        let sortedList = sort.split(',').join(' ')
        result = result.sort(sortedList)
    }
    else{
        result = result.sort('createAt')
    }
    
    if(fields){
        // .select allows us to only select fields that we want:
        const fieldItems = fields.split(',').join(' ')
        result = result.select(fieldItems)
    }
    console.log(req.query)
    let limit = 7; // our default limit!

    if(req.query.limit){
        limit = Number(req.query.limit)
        result = result.limit(Number(req.query.limit))
    }
    
    let pages = 1;

    if(req.query.page){
        pages = Number(req.query.page)
    }

    const num = (pages - 1) * limit

// this allows us to skip over the first few results for a specific page:
    result = result.skip(num)

    const products = await result;

    res.status(200).json({products, nBHits : products.length})
}

module.exports = { getProducts, 
    getProductsStatic}