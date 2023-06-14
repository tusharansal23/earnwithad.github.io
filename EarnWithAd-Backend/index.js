const express=require("express");
const route = require('./router/route')
const cors=require("cors")
const { default: mongoose } = require("mongoose")
//var expressSession = require("express-session")
var session = require('express-session')
const app=express()
app.use(cors({
    origin:'*',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}))
//app.use(express.json())
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const connection_url = "mongodb+srv://Tushar:1234@cluster0.jfwhxqh.mongodb.net/test"
const PORT = process.env.PORT || 4000;

mongoose.connect(connection_url, {
    useNewUrlParser:true
})
.then(()=> console.log("Database is connected"))
.catch((err)=> console.log(err))

// Session Setup
app.use(session({
  
    // It holds the secret key for session
    secret: 'gfuejse',
  
    // Forces the session to be saved
    // back to the session store
    resave: true,
  
    // Forces a session that is "uninitialized"
    // to be saved to the store
    saveUninitialized: true,
    cookie: {
        // Session expires after 1 min of inactivity.
        expires: 360000
    }
}))

app.get('/session', (req,res)=>{
   let token = req.session.token
   if(!token){
    res.send("Your session has expired")
   }
    return res.send("session alive")
})

app.use('/',route)

app.listen(PORT,()=>{
    console.log(`server is runnin on ${PORT}`)
}) 