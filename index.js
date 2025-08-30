const express=require('express')
const dotenv =require('dotenv')
dotenv.config()
const cors=require("cors")
const bcrypt =require('bcrypt')
const nodemailer =require('nodemailer')
const jwt=require("jsonwebtoken")
const employee =require('./Models/registerschema')
const admin =require('./Models/adminModels')
const employeeList=require("./Models/NewEmployeeModels")
const department=require("./Models/departmentModel")
const leave=require("./Models/leaveModel")
const salary=require("./Models/salarymodels")

const app=express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

app.get("/",(req,res)=>{
    res.send("Employee Management System")
})

// create employee account 
app.post("/createaccount",async (req,res)=>{
    const hashpasssword=await bcrypt.hash(req.body.pass,12)
    const user =new employee({"userName":req.body.userName,"email":req.body.email,"pass":hashpasssword})
    const existeUser=await employee.findOne({"email":req.body.email})
    if(existeUser){
        return res.send({message:"account existed "})
    }
    await user.save().then(result =>{
        res.send({message:"account created "})
    }).catch(err =>{
        res.send({message:"Error found "})
    })
    
})



const port=process.env.PORT
app.listen(port,()=>{
    console.log("running On 5000 Port")
})

// nodemon start index.js
