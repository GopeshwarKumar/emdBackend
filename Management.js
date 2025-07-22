const express=require("express");
const cors=require("cors");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt")
const userDetailsModels=require("./Models/Management_LoginModels")
const loginuser=require("./Models/Management_LoginModels")

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.get("/",(req,res)=>{
    res.send("Hello Gopeshwar");
})

// const createtoken=async ()=>{
//     const token=await jwt.sign({_id:"dmbfmdnmmgi4849534kjrneh8734nrkenf"},"dmbfmdnmmgi4849534kjrneh8734nrkenfdmbfmdnmmgi4849534kjrneh8734nrkenf")

//     const verifyUser=await jwt.verify(token,"dmbfmdnmmgi4849534kjrneh8734nrkenfdmbfmdnmmgi4849534kjrneh8734nrkenf")
//     console.log(token)
//     console.log(verifyUser)
// }
// createtoken()

// create account
app.post("/createaccount",async (req,res)=>{
    console.log(req.body)
    const hashpasssword=await bcrypt.hash(req.body.pass,12)
    console.log(hashpasssword)
    const userDetails=userDetailsModels({"userName":req.body.userName,"email":req.body.email,"pass":hashpasssword})
    await userDetails.save()
    .then(ress=>{
        res.send("User Data Saved")
    })
    .catch(er =>{
        console.log(er)
    })
})

// login
app.post("/login",async (req,res)=>{
    console.log(req.body)
    const user=await userDetailsModels.findOne({"email":req.body.useremail})
    if(!user){
       return res.send({message:"user not found"});
    }
    if (req.body.userpass === user.pass){
        // creating JWT token
        const token=await jwt.sign({_id:"dsbr489656HV^&%56jhjndnj4"},"jhsbhbvkfjjferio5738883#&7tgd^dd" ,{expiresIn:"1h"})
        // console.log(token)
        return res.send({message:"found",token:token})
    }

//     const match = await bcrypt.compare(req.body.userpass, user.pass);
// if (match) {
//     // Generate the token
// } else {
//     res.status(401).send({ message: "Invalid password" });
// }
})

app.listen(5000,()=>{
    console.log("Management On 5000 Port")
})

// nodemon start Management.js