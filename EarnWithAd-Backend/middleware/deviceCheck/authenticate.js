const User = require('../../models/userSchema')

const isLoggedIn = async(req,res,next)=>{
    let token = req.session.token
    if(!token || token == undefined){
        await User.findOneAndUpdate({email:req.body.email}, {accessToken:""})
    }
    next()
};
module.exports = {isLoggedIn};