const mongoose = require('mongoose');

const withdrawSchema = new mongoose.Schema({
    accountHolderName:{
        type:String,
        required:true,
        trim:true,
        tolowercase:true
    },
    bankName:{
       type:String,
       trim:true,
       required:true
    },
    bankAccountNumber:{
        type:Number,
        trim:true
    },
    ifscCode:{
        type:String,
        trim:true
    },
    phone:{
        type:Number,
        required:true
    },
    withdrwalAmount:{
        type:Number,
        required:true
    }
    // userId:[{
    //     type:mongoose.Schema.Types.ObjectId,
    //     required:true,
    //     trim:true,
    //     ref:"USER"
    // }]
})

module.exports = mongoose.model('Withdraw', withdrawSchema)