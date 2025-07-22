const mongoose =require("mongoose")

mongoose.createConnection(`${process.env.MONGO_URL}/ems_db`)

// mongoose.createConnection("mongodb://localhost:27017/ems_db")

const slarySchema=new mongoose.Schema({
    employeemail:{
        type:String
    },
    employee:{
        type:String
    },
    basicsalary:{
        type:Number
    },
    allowance:{
        type:Number
    },
    deduction:{
        type:Number
    },
    paydate:{
        type:Date
    },
    CreatedAt:{
        type:Date,
        default:Date.now()
    }
})

module.exports=mongoose.model("salary",slarySchema)