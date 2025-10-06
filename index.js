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

// Employee login
app.post("/employeelogin", async (req,res)=>{
    const loggedUser=await employeeList.findOne({"email":req.body.useremail})
    if(!loggedUser){
        res.send({message:"Employee Not existed"})
        return
    }
    const hashedpassword=await bcrypt.compare(req.body.userpass,loggedUser.password)

    if(loggedUser && hashedpassword===true){
        const token=await jwt.sign({_id:"dsbr489656HV^&%56jhjndnj4"},"jhsbhbvkfjjferio5738883#&7")
        res.send({token:token,message:"Employee Found","employeeName":loggedUser.name,
            "employeeEmail":loggedUser.email,"employeeDOB":loggedUser.dob,"employeeId":loggedUser.id,"employeegender":loggedUser.gender,"employeeDepartment":loggedUser.department,"employeeMartialStatus":loggedUser.martialstatus})
    }
    if(hashedpassword===false){
        res.send({message:"Wrong Password"})
        return
    }
})

// Employee forgotpassword
app.post("/employeeforgotpassword",async(req,res)=>{
    let createUser=await employeeList.findOne({"email":req.body.email})
    if(!createUser){
        return res.send({message:"User does not exist!"})
    }

    const otp = Math.floor(Math.random() * 10000)
    createUser.updateOne({ "otp": otp }).then(resws =>{
        res.send({message:"otp sent to email"})
        }).catch(er =>{
        res.status(403).send({message:"Error in saving otp"})
        })

// Create a transporter using your email
let transporter = nodemailer.createTransport({
  service: 'gmail',  // You can use other services like 'hotmail', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_ID,  // Replace with your email
    pass: process.env.EMAIL_PASSWORD,   // Replace with your email password or app password
  },
});

// Set up email data ${createUser.email}
let mailOptions = {
  from: process.env.EMAIL_ID,  // Sender address
  to: createUser.email,   // List of recipients
  subject: 'Reset password',  // Subject line
  text: `otp is ${otp}`,  // Plain text body
  // html: '<p>Hello, this is a test email sent using Nodemailer!</p>'  // If you prefer HTML format
};
// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return res.send({message:'Error sending email:'})
  }
  res.send({message:"otp sent to email"})
});

})

// Employee newpassword
app.post("/employeeNewpassword", async(req,res)=>{
    let newpassUser=await employeeList.findOne({"otp":req.body.otp})
    if(!newpassUser){
        return res.send({message:"wrong otp"})
    }
    const hashnewpassword=await bcrypt.hash(req.body.confirmPassword, 12)
    await newpassUser.updateOne({"password":hashnewpassword}).then(re =>{
        res.send({message:"password changed successfully"})
    })
})

// Get Employee Details for profile page
app.post('/getemployeeDetails',async(req,res)=>{
    const verifyUser=await employeeList.findOne({"email":req.body.email})
    res.send({message:verifyUser})
})

// create admin account
app.post("/adminaccout", async (req,res)=>{
    const hash=await bcrypt.hash(req.body.password,12)
    const adminUser=new admin({"userName":req.body.userName,"email":req.body.email,"password":hash,"createdAt":req.body.createdAt})

    const existedadmin=await admin.findOne({"email":req.body.email})
    if(existedadmin){
        return res.send({message:"Admin existed "})
        
    }
    await adminUser.save().then(Result =>{
        res.send({message:"admin accounnt created"})
    }).catch(err =>{
        res.send({message:err})
    })
})

// Admin login
app.post("/adminlogin",async (req,res)=>{
    const adminUser=await admin.findOne({"email":req.body.email})
    if(!adminUser){
        res.send({message:"Admin Not existed"})
        return
    }
    const hash=await bcrypt.compare(req.body.password,adminUser.password)
    // if(!req.body.email===adminUser.email){
    //     console.log("not found")
    // }
    if(hash===false){
        res.send({message:"wrong password"})
        return
    }
    if(req.body.email===adminUser.email && hash===true){
        const token=await jwt.sign({_id:"dsbr489656HV^&%56jhjndnj4"},"jhsbhbvkfjjferio5738883#&7")
        res.send({"token":token,message:"Admin Logged In"})
    }
})

// Admin forgotpassword
app.post("/adminforgotpassword",async(req,res)=>{
    console.log(req.body)
    let createUser=await admin.findOne({"email":req.body.email})
    if(!createUser){
        return res.send({message:"User does not exist!"})
    }

    const otp = Math.floor(Math.random() * 10000)
    createUser.updateOne({ "otp": otp }).then(resws =>{
        res.send({message:"otp sent to email"})
        }).catch(er =>{
        res.status(403).send({message:"Error in saving otp"})
        })

// Create a transporter using your email
let transporter = nodemailer.createTransport({
  service: 'gmail',  // You can use other services like 'hotmail', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_ID,  // Replace with your email
    pass: process.env.EMAIL_PASSWORD,   // Replace with your email password or app password
  },
});

// Set up email data ${createUser.email}
let mailOptions = {
  from: process.env.EMAIL_ID,  // Sender address
  to: createUser.email,   // List of recipients
  subject: 'Reset password',  // Subject line
  text: `otp is ${otp}`,  // Plain text body
  // html: '<p>Hello, this is a test email sent using Nodemailer!</p>'  // If you prefer HTML format
};
// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return res.send({message:'Error sending email:'})
  }
  res.send({message:"otp sent to email"})
});

})

// Admin newpassword
app.post("/adminNewpassword", async(req,res)=>{
    let newpassUser=await admin.findOne({"otp":req.body.otp})
    if(!newpassUser){
        res.send({message:"wrong otp"})
    }
    const hashnewpassword=await bcrypt.hash(req.body.confirmPassword, 12)
    await newpassUser.updateOne({"password":hashnewpassword}).then(re =>{
        res.send({message:"password changed successfully"})
    })
})

// NewEmployee Register
app.post("/newemployee", async (req,res)=>{
    const existedEmployee=await employeeList.findOne({"email":req.body.email})
    if(existedEmployee){
        res.send({message:"employee Existed"})
        return
    }
    const newemployee=new employeeList(req.body)
    await newemployee.save().then(result =>{
        res.send({message:"employee created "})
    }).catch(err =>{
        res.send({message:err})
    })
    console.log("newemployee",newemployee)
})

// Add New employee
app.post("/addnewemployee",async (req,res)=>{
    const existedNewEmployee=await employeeList.findOne({"email":req.body.email})
    if(existedNewEmployee){
        res.send({message:"Employee Existed"})
        return
    }
    const hashingpaaword=await bcrypt.hash(req.body.password,12)
    const newEmployee=new employeeList({"name":req.body.name,"email":req.body.email,"id":req.body.id,"gender":req.body.gender,"dob":req.body.dob,"martialstatus":req.body.martialstatus,"department":req.body.department,"role":req.body.role,"designation":req.body.designation,"salary":req.body.salary,"password":hashingpaaword,"createdAt":req.body.createdAt,})
    await newEmployee.save().then(resultt=>{
        res.send({message:"New Employee Added"})
    }).catch(errr=>{
        res.send("Error found")
    })
})

// Edit employee
app.post("/editemployeedetails",async (req,res)=>{

    const existedNewEmployee = await employeeList.findOneAndUpdate({ email: req.body.editEmail },{ $set: {"name":req.body.editName,"email":req.body.editEmail,"id":req.body.editEmployeeId,"gender":req.body.editGender,"dob":req.body.editDob,"martialstatus":req.body.editMartialStatus,"department":req.body.editDepartment,"role":req.body.editRole,"designation":req.body.editDesignation,"salary":req.body.editSalary}},{ new: true })

    if(!existedNewEmployee){
    return res.send({message:"Employee not found !"})
    }

    await existedNewEmployee.save().then(reses=>{
    res.send({message:"Employee Details Updated"})
    }).catch(er=>{
    res.status(500).send({message:"Error found !"})
    })
})

// Delete Employee
app.post('/deleteEmployee',async(req,res)=>{
    const deleteEmployee=await employeeList.findOneAndDelete({"_id":req.body.id}).then(ress=>{
        res.send({message:"Employee Deleted "})
    }).catch(err=>{
        res.status(403).send({message:"Error !"})
    })
})

// Add new department
app.post("/addnewdepartment",async (req,res)=>{
    const existedDepartment=await department.findOne({"departmentName":req.body.departmentName})
    if(existedDepartment){
        return res.send({message:"Department Existed"})
    }
    const depart=new department(req.body)
    await depart.save().then(ress =>{
        res.send({message:"Department Added"})
    }).catch(err =>{
        res.send({message:"Error"})
    })
})

// Edit department
app.post("/editdepartment",async (req,res)=>{
    const editdepartment =await department.findById(req.body.editdepartmentId)
    await editdepartment.updateOne({"departmentName":req.body.editdepartmentName,"departmentDescription":req.body.editdepartmentDescription}).then(ress=>{
        res.send({message:"Updated"})
    }).catch(err=>{
        res.send({message:"Error !"})
    })
})

// Delete Department
app.post("/deletedepartment",async(req,res)=>{
    await department.findOneAndDelete({"_id":req.body.x._id}).then(result=>{
        res.send({message:"Department Deleted"})
    }).catch(err=>{
        res.status(404).send({message:"Error found !"})
        }).finally(final=>{

    })
})

// Get all department to show on frontend
app.get("/getAlldepartments",async (req,res)=>{
    const alldepartments=await department.find({})
    res.send(alldepartments)
})

// Get Departmental employee for salary
app.post("/getdepartmentemployee",async(req,res)=>{
    const allfilteremployee=await employeeList.find({"department":req.body.department})
    res.send(allfilteremployee)
})

// Save Employee Salary
app.post('/saveEmployeeSalary',async(req,res)=>{
    const employeeSalary=new salary(req.body)
    await employeeSalary.save().then(ress=>{
        res.send({message:'Salary saved successfully'})
    }).catch(er=>{
        res.status(403).send({message:'Error caught'})
    })
})

// GetEmployeesalaryDetails to show on frontend
app.post('/getEmployeesalaryDetails',async(req,res)=>{
    const EmployeeSalary=await salary.find({"employeemail":req.body.email})
    res.send(EmployeeSalary)
})

// Get Departmental employee for salary
app.post("/getsalarydetails",async(req,res)=>{
    const checksalary=await employeeList.find({"department":req.body.department})
    res.send(allfilteremployee)
})

// Get Departmental employee for salary
app.get("/showsalary",async(req,res)=>{
    const allsalary=await salary.find({})
    res.send(allsalary)
})

// Get all employee to show on frontend
app.get("/showEmployee",async (req,res)=>{
    const allEmployee=await employeeList.find({});
    res.send(allEmployee)
})

// Add Leave
app.post("/addleave",async (req,res)=>{
    const employeeLeave=new leave(req.body)
    await employeeLeave.save().then(result =>{
        res.send({message:"Leave Added"})
    }).catch(err=>{
        res.send({message:"Unsuccessful !"})
    })
})

// approve leave
app.post('/approvedleave',async(req,res)=>{
    const approveleave = await leave.findOneAndUpdate(
  { "_id": req.body.id },
  { $set: { "status": "Approved" } },
  { new: true } // Optional: returns updated document
).then(ress=>{
    res.send({message:"Leave approved"})
}).catch(err=>{
    res.status(403).send({message:"Errror !"})
})
})

// rejecte leave
app.post('/rejectedleave',async(req,res)=>{
    const rejectleave = await leave.findOneAndUpdate(
  { "_id": req.body.id },
  { $set: { "status": "Rejected" } },
  { new: true } // Optional: returns updated document
).then(ress=>{
    res.send({message:"Leave rejected"})
}).catch(err=>{
    res.status(403).send({message:"Errror !"})
})
})

// Get all leaves to show on frontend at admin panel
app.get("/showleaves", async(req,res)=>{
    const alleaves=await leave.find({})
    res.send({alleaves})

})

// checkEmployeeLeave at Admin Panel
app.get('/checkEmployeeLeave',async(req,res)=>{
    const employeeLeave=await leave.find({"email":req.body.email})
    res.send(employeeLeave)
})

// Get all particular employee Leave at employee panel
app.get("/allemployeeleaves",async (req,res)=>{
    const l=await leave.find({"email":req.body.email})
    res.send(l)
})

const port=process.env.PORT
app.listen(port,()=>{
    console.log(`Working ${port}`)
})

// nodemon start index.js
