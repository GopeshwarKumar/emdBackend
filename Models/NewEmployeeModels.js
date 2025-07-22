const mongoose=require("mongoose")

mongoose.createConnection(`${process.env.MONGO_URL}/ems_db`)

const newemployeeSchema=new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    id:{
        type:String
    },
    gender:{
        type:String
    },
    dob:{
        type:String
    },
    martialstatus:{
        type:String
    },
    department:{
        type:String
    },
    role:{
        type:String
    },
    designation:{
        type:String
    },
    salary:{
        type:String
    },
    password:{
        type:String
    },
    otp:{
        type:String
    },
    createdAt:{
        
    }
})

module.exports=mongoose.model("employeeList",newemployeeSchema)