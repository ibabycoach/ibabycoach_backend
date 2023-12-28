
var express = require('express');
const Authcontroller = require('../controller/Api/Authcontroller');
const userprofile = require('../controller/Api/userprofilecontroller');
const userprofilecontroller = require('../controller/Api/userprofilecontroller');
const babycontroller = require('../controller/Api/babycontroller');
const routinecontroller = require('../controller/Api/routinecontroller');
const memoriescontroller = require('../controller/Api/memoriescontroller');
const activitycontroller = require('../controller/Api/activitycontroller');
const cmscontroller = require('../controller/Api/cmscontroller');
const growthController = require('../controller/Admin/growthController');
const growthcontroller = require('../controller/Api/growthcontroller');
const authenticateJWT = require("../Helper/helper").authenticateJWT;
const authenticateHeader = require("../Helper/helper").authenticateHeader;


var router = express.Router();

router.post('/signup', Authcontroller.signup)
router.post('/Login', Authcontroller.Login)
router.post('/otpVerify', Authcontroller.otpVerify)
router.post("/resend_otp", Authcontroller.resend_otp)
router.post('/socialLogin', Authcontroller.socialLogin)
router.post('/logout', authenticateJWT, Authcontroller.logout)
router.post('/change_password', authenticateJWT, Authcontroller.change_password)

///////// PROFILE //////
router.get('/profile', authenticateJWT, userprofilecontroller.profile)
router.get('/home_screen', authenticateJWT, userprofilecontroller.home_screen)

//////////////// BABY ////////
router.post('/add_baby', authenticateJWT, babycontroller.add_baby)

/////////// GROWTH ////////////////////
router.post('/Add_growth', authenticateJWT, growthcontroller.Add_growth)

////// ROUTINE BUILDER ///////
router.post('/add_routine', authenticateJWT, routinecontroller.add_routine)

///////////  MEMORIES ///////
router.post('/add_memories', authenticateJWT, memoriescontroller.add_memories)
router.get('/get_memory_images', authenticateJWT, memoriescontroller.get_memory_images)

//////// ACTIVITY ///////
router.post('/customizable_activity', authenticateJWT, activitycontroller.customizable_activity)

/////////// CMS //////////////////
router.get('/aboutUs', authenticateJWT, cmscontroller.aboutUs)
router.get('/privacyPolicy', authenticateJWT, cmscontroller.privacyPolicy)
router.get('/termsConditions', authenticateJWT, cmscontroller.termsConditions)



module.exports = router;