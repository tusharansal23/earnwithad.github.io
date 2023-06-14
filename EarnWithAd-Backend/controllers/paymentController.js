const User=require("../models/userSchema")
const Payment = require('../models/withdrawSchema')

//Plan purchased api
const purchasePlan = async(req,res)=>{
    const {planType, amount} = req.body
    let savedWallet = await User.findOneAndUpdate({_id:req.user_id}, {$inc:{wallet:-Number(amount)}})
    if(!savedWallet){
        return res.status(400).send({status:false, message:"Unable to pay"})
    }
    return res.status(200).send({status:true, message:"Plan purchased successfully"})
};
//save User payment request
const savePymntDetails =  async(req,res)=>{
    let {accountHolderName,
        bankName,
        bankAccountNumber,
        ifscCode, phone,
        withdrwalAmount} = req.body
        console.log("accountHolderName",accountHolderName);
        console.log("bankName",bankName);
        console.log("accountNumber",bankAccountNumber);
        console.log("ifscCode",ifscCode);
        console.log("phone",phone);
        console.log("withdrawAmount",withdrwalAmount);

        if(!accountHolderName || !bankName || !bankAccountNumber || !ifscCode || !phone || !withdrwalAmount){
            return res.status(400).send({statu:false, message:"All fields are required!"})
        }
        let savedpayment = await Payment.create(req.body)
        if(!savedpayment){
            return res.status(400).send({status:false, message:"Invalid input data"})
        }
        else{
            return res.status(200).send({status:true, message:"Your payment details has been sent to the admin"})
        }
        //let SuccessfulPayment = payment.
        
};

// get wallet amount
const getWalletAmnt = async(req,res)=>{
    //console.log("user email = ",req.params.email);

    let Amount = await User.findOne({email:req.params.email}).select({wallet:1, _id:0})
    //console.log("Amount => ",Amount);
    res.status(200).send({status:true, Amount})
};

// Get money after video watch
const moneyGenerator = async(req,res)=>{
                                                     
  try {
    let userId = req.user_id
    let earnedMoney = await User.findOneAndUpdate({_id:userId}, {$inc:{wallet: "+0.01"}},{new:true})
    if(!earnedMoney){
        return res.status(400).send({status:false, message:"You are unlucky!"})
    }
    return res.status(200).send({status:true, message:"Congratulations! you have just earned 0.01 rupees"})
  } catch (error) {
    res.status(500).send({status:false, message:error.message})
  }
}

module.exports = {purchasePlan, savePymntDetails, getWalletAmnt,moneyGenerator};