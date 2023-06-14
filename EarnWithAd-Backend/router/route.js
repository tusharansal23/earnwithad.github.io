const express = require("express");
const router = express.Router();
const {
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
  logoutUser,
} = require("../controllers/userController");
const {
  purchasePlan,
  savePymntDetails, 
  getWalletAmnt,
  moneyGenerator
} = require('../controllers/paymentController')
const { 
  adminLogin, 
  adminRegister 
} = require("../controllers/adminController");
const {
   authentication, 
   authorisation 
  } = require("../middleware/auth");
  const {isLoggedIn} = require('../middleware/deviceCheck/authenticate')

router.get("/", (req, res) => {
  res.send("Hello dear");
});

// User controll route
router.post("/register", userRegister); // User register APIs
router.post("/login", isLoggedIn, userLogin); // User login APIs
router.post("/send/details",authentication, userDetails); // User details APIs
router.post("/approve/user", approveUserReq); //approve user registeration APIs
router.get("/approve/request", getUserReq); //Pending registration APIs
router.get("/users/info", getUserDetails); // Approved user details APIs
router.get("/user/referalId",authentication, getUserRefId); // User referal id APIs
router.post("/api/user/send_otp", sendOtp); // Send OTP APIs
router.post("/api/user/verify_otp", verfyOtp); // Verify OTP APIs
router.put("/api/user/change_password", changePwd); // Change password APIs
router.get("/user/logout",authentication, logoutUser);

// Payment Related Apis
router.post('/api/user/wallet', purchasePlan) // Purchase plan
router.post('/api/user/payment_request',authentication, savePymntDetails) // save payment request
router.get('/api/user/:email/get_wallet_amount',getWalletAmnt) // Get wallet amount
router.put('/api/user/earn_money',authentication, moneyGenerator)
//Admin controll route
router.post("/admin/register", adminRegister); // Admin register APIs
router.post("/admin/login", adminLogin); // Admin Login APIs
module.exports = router;
