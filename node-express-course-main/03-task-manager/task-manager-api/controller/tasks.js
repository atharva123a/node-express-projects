// this is the controller for ours tasks routes:

const { response } = require("express");

const Task = require('../models/Tasks')

const getAllTasks = async (req, res)=>{
  try {
      const tasks = await Task.find().exec()
    //   console.log(data)
      res.status(200).json({tasks});
  } catch (error) {
      res.status(500).json({msg : error})
    }
}

const addTasks = async (req, res) =>{
    try {
        const task = await Task.create(req.body)
        res.status(201).json({task});
    } catch (error) {
        res.status(500).json({msg : error})
    }
}

const getTask = async (req, res) =>{
    try {
        const {id:taskId} = req.params;
        const task = await Task.findOne({_id : taskId})
        // task === null if no task is found
        if(!task){
            return res.status(404).json({msg : `No task found with id : ${taskId}`})
        }
        res.status(200).json({task})
    }
    catch(error){
        // mostly castErrors are put here:
        res.status(500).json({msg : error})
    }
}

const updateTask = async(req, res) =>{
    try {
       const {id : taskId} = req.params;
       const task = await Task.findOneAndUpdate({_id : taskId}, req.body, {
           new : true, runValidators : true
       })
       if(!task){
           return res.status(404).json(`No task found with id : ${taskId}`)
       }
       console.log('updated successfully!')
       res.status(200).json({task})
    } catch (error) {
        res.status(500).json({msg : error})
    }

}

const deleteTask = async (req, res)=>{
    try {
        const {id:taskId} = req.params
        const task = await Task.findOneAndDelete({_id : taskId})
        if(!task){
          return res.status(404).json(`No task found with id : ${taskId}`)
        }
        res.status(200).json({task})
    } catch (error) {
        res.status(500).json({msg : error})
    }
}

module.exports = { getAllTasks , 
    addTasks,
    getTask,
    updateTask,
    deleteTask
}