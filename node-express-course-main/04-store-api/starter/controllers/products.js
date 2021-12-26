
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
    const { featured, name, company, sort, fields, numericFilters} = req.query
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
    if(numericFilters){
        const operatorMap = {
            // maps the operator that user enters to the corresponding
        // operators in mongoose for filtering data:
            '>' : '$gt',
            ">=" : '$gte',
            '=' : '$eq',
            '<=' : '$lte',
            "<"  : '$lt'
        }
        // regEx to throw us anything that matches our pattern:
        const regEx = /\b(>|<|<=|>=|=)\b/g
        // replace it with mongoose query syntax:
        let filters = numericFilters.replace(regEx, (match)=> `-${operatorMap[match]}-`)
        
        // we will only apply filter for rating and price:
        const options = ['rating', 'price']

        filters = filters.split(',').forEach((item)=>{
            const [field, operator, value] = item.split('-');
            if(options.includes(field)){
                // the square braces around operator makes sure it
                // is using the var opearator and not the "string" operator!
                queryObj[field] = { [operator] : Number(value) }
            }
        })
    }
    // console.log(queryObj)

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