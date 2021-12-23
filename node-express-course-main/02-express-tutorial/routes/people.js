// routes for handling data manipulations with people:

const express = require('express')

const router = express.Router()

const { people } = require('../data')

const {getPeople, 
    createPerson,
    updatePerson,
    deletePerson} = require('../controller/people')

// controller makes our lives even easier in this case!!
// router.get('/', getPeople)
// router.post('/', createPerson)
// router.put('/:id', updatePerson)
// router.delete('/:id', deletePerson) 

// the other way to do it: "both have the same functionality!"
router.route('/').get(getPeople).post(createPerson)
router.route('/:id').put(updatePerson).delete(deletePerson)

module.exports = router