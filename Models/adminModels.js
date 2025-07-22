const mongoose=require("mongoose")

mongoose.connect(`${process.env.MONGO_URL}/ems_db`)

// mongoose.createConnection(`${process.env.MONGO_URL}/ems_db`)

const newemployeeSchema=new mongoose.Schema({
    userName:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    otp:{
        type:String
    },
    createdAt: { 
        type: Date,
        default: Date.now 
    },
})

module.exports=mongoose.model("adminList",newemployeeSchema)