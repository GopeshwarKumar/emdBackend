const mongoose =require("mongoose");
mongoose.createConnection(`${process.env.MONGO_URL}/ems_db`)

const createUserschema=new mongoose.Schema({
    userName:{
        type:String
    },
    email:{
        type:String
    },
    pass:{
        type:String
    }
})

module.exports=mongoose.model("registerschema",createUserschema)