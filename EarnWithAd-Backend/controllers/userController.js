const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const session = require('express-session')


const userRegister = async(req,res)=>{
const {name,email,phone,password,friendReferal,imageData}=req.body;
const alreadyUser=await User.findOne({email})
//console.log("imageData => ",imageData)
const imageBuffer = Buffer.from(imageData, "base64");
if(alreadyUser){
    return  res.status(403).json({status:false,message:"Email id already register"})
}
//console.log("imageBuffer => ",imageBuffer)
const response=new User({
    name,email,phone,password,friendReferal,imageBuffer
})
await response.save()
return res.status(200).json({status:true,message:"Register Sucessfully"})
};

// user login
const userLogin = async(req,res,next)=>{
 try {
       
    let user=await User.findOne({email:req.body.email})
    if(!user){
    return  res.status(403).json({status:false,message:"Invalid User"})
    }
if(user.approve=="Not Approved"){
    return  res.status(403).json({status:false,message:"Not Approved"})
}
if(user.password!=req.body.password){
    return  res.status(403).json({status:false,message:"Invalid Password"})

}
const num = 6;
const randomString = (len = 1) => {
   const charSet =
   'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; 
   let randomString = '';
   for (let i = 0; i < len; i++) {
      let randomPoz = Math.floor(Math.random() * charSet.length);
      randomString += charSet.substring(randomPoz,randomPoz+1);
   };
   return randomString;
};
let code=randomString(num)
if(!user.referal){
    await User.updateOne({email:user.email},{$set:{referal:code}})
}

const payload = { userId:user._id }; // replace with your own payload data
const secret = 'myJWTSecretKey'; // replace with your own secret key
const token = jwt.sign(payload, secret);
if(!user.accessToken){
    await User.updateOne({email:user.email},{$set:{accessToken:token}})
}else{
    return res.status(422).send({status:false, message:"You are already logged in"})
}
// Setting up token
req.session.token = token;
//sessionStorage.setItem("token", req.session.token);


//console.log("userController----req.session.token ---->",req.session.token);
res.setHeader('Authorization', 'Bearer '+ token); 
return res.status(200).json({status:true,message:"Login successfully", accessToken:token})

 } catch (error) {
    return res.status(500).send({status:false, message:error.message})
 }

};

// Send user details
const userDetails = async(req,res)=>{

    let user=await User.findOne({email:req.body.email})
    if(!user){
    return  res.status(403).json({status:false,message:"Invalid User"})
    }
    await User.updateOne({email:req.body.email},{$set:{qrDetails:[req.body]}})
    return  res.status(200).json({status:true,message:"send details sucessfully"})

};

//approve user registeration request by admin
const approveUserReq = async(req,res)=>{
    let users = req.body
    var userEmail = ''
    for(let ele of users){
        if(ele){
            userEmail = ele
            let user=await User.findOne({email:userEmail})
        if(!user){
            return  res.status(403).json({status:false,message:"Invalid User"})
            }
          let updatedUser =  await User.updateOne({email:userEmail},{$set:{approve:"Approved"}})
        }
    }
        return  res.status(200).json({status:true,message:"Approve sucessfully"})

};

//Get pending user registration request 

const getUserReq = async(req,res)=>{
    let user=await User.find({approve:'Not Approved'})
    res.status(200).json(user)
    
    };

    //Get approved user details
   const getUserDetails =  async(req, res)=>{
        let allData = await User.find({approve:"Approved"})
        if(allData.length == 0){
            return res.status(404).send({status:false, message:'User data not found'})
        }
        return res.status(200).send({status:true, userData:allData})
    };

    //Get user referal id

   const getUserRefId =  async(req,res)=>{
    //console.log('user id from token', req.user_id)
        let referalId = await User.findOne({_id:req.user_id}).select({referal:1, _id:0})
       // console.log(referalId)
        if(referalId){
            return res.status(200).send({status:true, referalId:referalId.referal})
        }
       
    };

    //Send OTP to user email for reset password

   const sendOtp =  async (req, res) => {
        let { email } = req.body
        let data = await User.findOne({email})
        if (!data) {
            return res.status(400).send({ status: false, msg: "Plz enter valid email ID" })
        }
    
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "gurucharanmanjhizx@gmail.com",
                pass: "kaasdabnqwnksmvy"
            }
        });
        let otpnum = Math.floor(1000 + (Math.random() * 9000))
    
         await User.findOneAndUpdate({ email: req.body.email }, { $set: { otp: otpnum } })
    
        var mailOptions = {
            from: "gurucharan@hminnovance.com",
            to: `${req.body.email}`,
            subject: "Reset Password OTP",
            text: `
         Reset password OTP for email  is ${otpnum}
    
        Do not share this OTP with anyone`
        };
    
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                res.status(200).send(info)
            }
        });
    };

//Verify user OTP
const verfyOtp =  async(req,res)=>{
    let OTP = req.body.otp
    let isValidOtp = await User.findOne({OTP})
    if(!isValidOtp){
        return res.status(400).send({status:false, message:"Invalid OTP"})
    }
    return res.status(200).send({status:true, message:"OTP verified successfully"})
 };

 //Change user account password
const changePwd = async(req,res)=>{
    let {password,confirmPassword, otp} = req.body
    console.log(req.body)
    let savedPwd = await User.findOneAndUpdate({otp}, {$set:{password:password}})
    if(!savedPwd){
        return res.status(400).send({status:false, message:"Invalid OTP Try again!"})
    }
    return res.status(200).send({status:false, message:"Your password has been changed"})
};

//Logout user
const logoutUser = async function(req, res, next) {
    await User.findOneAndUpdate({_id:req.user_id}, {accessToken:""})
    req.session.destroy(() => {
    return res.redirect("/?action=logout");
    });
    return res.status(200).send({status:true, message:"Logout successfully"})
   }

module.exports = {
    userRegister,
    userLogin,
     userDetails,
     approveUserReq,
     getUserReq, 
     getUserDetails, 
     getUserRefId, 
     sendOtp, 
     verfyOtp, 
     changePwd,
     logoutUser
    };
