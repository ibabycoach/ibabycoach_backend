
var express = require('express');
const Authcontroller = require('../controller/Api/Authcontroller');
const userprofile = require('../controller/Api/userprofilecontroller');
const userprofilecontroller = require('../controller/Api/userprofilecontroller');
const babycontroller = require('../controller/Api/babycontroller');
const routinecontroller = require('../controller/Api/routinecontroller');
const memoriescontroller = require('../controller/Api/memoriescontroller');
const activitycontroller = require('../controller/Api/activitycontroller');
const authenticateJWT = require("../Helper/helper").authenticateJWT;
const authenticateHeader = require("../Helper/helper").authenticateHeader;


var router = express.Router();

router.post('/signup', Authcontroller.signup)
router.post('/Login', Authcontroller.Login)
router.post('/otpVerify', Authcontroller.otpVerify)
router.post("/resend_otp", Authcontroller.resend_otp)
router.post('/socialLogin', Authcontroller.socialLogin)
router.post('/logout', authenticateJWT, Authcontroller.logout)
router.post('/change_password', Authcontroller.change_password)

///////// PROFILE //////
router.get('/profile', authenticateJWT, userprofilecontroller.profile)
router.get('/home_screen', authenticateJWT, userprofilecontroller.home_screen)

//////////////// BABY ////////
router.post('/add_baby', authenticateJWT, babycontroller.add_baby)

////// ROUTINE BUILDER ///////
router.post('/add_routine', authenticateJWT, routinecontroller.add_routine)

///////////  MEMORIES ///////
router.post('/add_memories', authenticateJWT, memoriescontroller.add_memories)

//////// ACTIVITY ///////
router.post('/customizable_activity', authenticateJWT, activitycontroller.customizable_activity)



module.exports = router;