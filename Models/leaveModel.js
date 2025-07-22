const mongoose=require("mongoose")

mongoose.createConnection(`${process.env.MONGO_URL}/leave`)


const leaveSchema=new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    leaveType:{
        type:String
    },
    fromDate:{
        type:Date
    },
    ToDate:{
        type:Date
    },
    descriptionOfLeavve:{
        type:String
    },
    days:{
        type:String
    },
    status:{
        type:String,
        default:"Pending"
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

module.exports=mongoose.model("Employeeleave",leaveSchema)