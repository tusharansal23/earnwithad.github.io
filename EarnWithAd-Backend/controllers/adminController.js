const Admin = require('../models/adminSchema');


const adminRegister =  async(req,res)=>{
    let adminData = req.body
    let savedData = await Admin.create(adminData)
    res.send({message:"Register successfull",data:savedData})
};

const adminLogin = async(req,res)=>{
    
    //let admin=await Admin.findOne({email:req.body.email})
    // console.log(user.approve)
    //if(!admin)
    if(req.body.email != "tusharansal23@gmail.com"){
        return  res.status(403).json({status:false,message:"Invalid admin"})
    
    }
//if(admin.password!=req.body.password){
    if(req.body.password != "$Sakshamjnu16$"){
        return  res.status(403).json({status:false,message:"Invalid Password"})

    }

// await admin.updateOne({email:user.email},{$set:{referal:code}})
// console.log();
res.status(200).json({status:true,message:"admin login successfully"})

};

module.exports = {adminLogin, adminRegister}
