// handle routes in this case:

const express = require('express')
const router = express.Router()

const { getAllTasks , 
    addTasks,
    getTask,
    updateTask,
    deleteTask,} = require('../controller/tasks')

router.route('/').get(getAllTasks).post(addTasks)
router.route('/:id').get(getTask).patch(updateTask).delete(deleteTask)

module.exports = router