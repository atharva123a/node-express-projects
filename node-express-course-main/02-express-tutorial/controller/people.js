// this would be our controller for handling routes:

const { people } = require('../data')

// get people:
const getPeople = (req, res)=>{
    res.status(200).json({"success" : true, "data" : people})
}

const createPerson = (req, res)=>{
    const {name} = req.body
    if(name){
        // code is 201 for a successfull get request:
        res.status(201).json({success : true, data : [...people, {id:req.body.id, name : name}]})
    }
    else {
        // 400 for a request error:
        res.status(400).json({success : false, msg : "invalid name"})
    }
}

const updatePerson = (req, res)=>{
    const {id} = req.params
    const { name } = req.body

    let person = people.find((person) => person.id === Number(id))
    if(!person){
        return res.status(404).json({success : false, msg : `invalid id : ${id}`})
    }
    let newPeople = people.map((person)=>{
        if(person.id === Number(id)){
            person.name = name
        }
        return person
    })
    res.status(200).json({success : true, data : newPeople})
    
}

const deletePerson = (req ,res)=>{
    const person = people.find((person)=> person.id === Number(req.params.id))
    if(!person){
       return res.status(404).json({
            success : false,
            "msg" : `no person exists with id: ${req.params.id}`
        })
    } 
    const newPeople = people.filter((person)=> person.id !== Number(req.params.id))
    res.status(200).json({success : true, data : newPeople})
}

module.exports = {
    getPeople, 
    createPerson,
    updatePerson,
    deletePerson
}