const mongoose=require("mongoose")

mongoose.createConnection(`${process.env.MONGO_URL}/ems_db`)

const departmentSchema=new mongoose.Schema({
    departmentName:{
        type:String
    },
    departmentDescription:{
        type:String
    },
    createdAt: { 
        type: Date,
        default: Date.now 
    },
})

module.exports=mongoose.model("department",departmentSchema)