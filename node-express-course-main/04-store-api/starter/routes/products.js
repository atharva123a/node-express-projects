
const express = require('express')
const router = express.Router()

const  { getProducts, 
    getProductsStatic }= require('../controllers/products')

router.route('/').get(getProducts)
router.route('/static').get(getProductsStatic)

module.exports = router