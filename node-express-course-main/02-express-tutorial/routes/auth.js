// routes for loggin in people:
const express = require('express')
const router = express.Router()

const { loginUser } = require('../controller/auth')

router.post('/', loginUser)

module.exports = router