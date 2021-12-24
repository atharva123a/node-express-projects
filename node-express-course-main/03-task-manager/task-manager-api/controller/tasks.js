// this is the controller for ours tasks routes:

const { response } = require("express");
const asyncWrapper = require('../middleware/async-wrapper')
const Task = require('../models/Tasks')

const { createCustomError } = require('../errors/custom-error')

const getAllTasks = asyncWrapper(async(req, res)=>{
    const tasks = await Task.find({});
    res.status(200).json({tasks})
})

const addTasks = asyncWrapper(async (req, res) =>{
    const task = await Task.create(req.body)
    res.status(201).json({task});
})

const getTask = asyncWrapper(async (req, res, next) =>{
    const {id:taskId} = req.params;
    const task = await Task.findOne({_id : taskId})
    // task === null if no task is found
    if(!task){
        return next(createCustomError(`Not Found`, 404))
        // const error = new Error('Not Found');
        // error.status = 404
        // return next(error)
        // return res.status(404).json({msg : `No task found with id : ${taskId}`})
    }
    res.status(200).json({task})
})

const updateTask = asyncWrapper(async(req, res, next) =>{
    
    const {id : taskId} = req.params;
    const task = await Task.findOneAndUpdate({_id : taskId}, req.body, {
        new : true, runValidators : true
    })
    if(!task){
        return next(createCustomError(`Not Found`, 404))
    }
    res.status(200).json({task})
})

const deleteTask = asyncWrapper(async (req, res, next)=>{
  
    const {id:taskId} = req.params
    const task = await Task.findOneAndDelete({_id : taskId})
    if(!task){
        return next(createCustomError(`Not Found`, 404))
    }
    res.status(200).json({task})
})

module.exports = { getAllTasks , 
    addTasks,
    getTask,
    updateTask,
    deleteTask,
}