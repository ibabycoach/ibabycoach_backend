
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
const goalcontroller = require('../controller/Api/goalcontroller');
const contactSupportcontroller = require('../controller/Api/contactSupportcontroller');
const remindercontroller = require('../controller/Api/remindercontroller');
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

///////// PROFILE ////////////
router.get('/profile', authenticateJWT, userprofilecontroller.profile)
router.post('/edit_profile', authenticateJWT, userprofilecontroller.edit_profile)
router.post('/add_subuser', authenticateJWT, userprofilecontroller.add_subuser)
router.get('/subUser_list', authenticateJWT, userprofilecontroller.subUser_list)

//////////////// BABY ////////
router.post('/add_baby', authenticateJWT, babycontroller.add_baby)
router.post('/edit_baby', authenticateJWT, babycontroller.edit_baby)
router.delete('/delete_baby', authenticateJWT, babycontroller.delete_baby)
router.get('/baby_list', authenticateJWT, babycontroller.baby_list)

/////////// GROWTH ///////////
router.post('/Add_growth', authenticateJWT, growthcontroller.Add_growth)
router.post('/track_growth', authenticateJWT, growthcontroller.track_growth)
router.post('/edit_growth', authenticateJWT, growthcontroller.edit_growth)

////// ROUTINE BUILDER /////////
router.post('/add_routine', authenticateJWT, routinecontroller.add_routine)
router.post('/get_routine', authenticateJWT, routinecontroller.get_routine)
router.post('/edit_routine', authenticateJWT, routinecontroller.edit_routine)
router.post('/delete_routine', authenticateJWT, routinecontroller.delete_routine)
router.get('/get_activityByAdmin', authenticateJWT, routinecontroller.get_activityByAdmin)
router.post('/get_day_routine', authenticateJWT, routinecontroller.get_day_routine)
router.post('/get_customized_routine', authenticateJWT, routinecontroller.get_customized_routine)
router.post('/assign_task', authenticateJWT, routinecontroller.assign_task)

///////////  MEMORIES ///////////
router.post('/add_memories', authenticateJWT, memoriescontroller.add_memories)
router.post('/get_memory_images', authenticateJWT, memoriescontroller.get_memory_images)
router.post('/delete_images', authenticateJWT, memoriescontroller.delete_images)

//////// ACTIVITY ///////////////
router.post('/customizable_activity', authenticateJWT, activitycontroller.customizable_activity)
router.post('/edit_activity', authenticateJWT, activitycontroller.edit_activity)
router.get('/get_activity', authenticateJWT, activitycontroller.get_activity)
router.post('/get_day_activity', authenticateJWT, activitycontroller.get_day_activity)
router.post('/get_customized_activity', authenticateJWT, activitycontroller.get_customized_activity)
router.post('/delete_activity', authenticateJWT, activitycontroller.delete_activity)

/////////// GOALS ///////////////
router.post('/get_goals', authenticateJWT, goalcontroller.get_goals)
router.post('/goal_details', authenticateJWT, goalcontroller.goal_details)

/////////// CMS /////////////////
router.get('/aboutUs', authenticateJWT, cmscontroller.aboutUs)
router.get('/privacyPolicy', authenticateJWT, cmscontroller.privacyPolicy)
router.get('/termsConditions', authenticateJWT, cmscontroller.termsConditions)

//////////////////////////////////////////////
router.post('/contactsupport', authenticateJWT, contactSupportcontroller.contactsupport)

////////////  REMINDER //////////////
router.post('/add_reminder', authenticateJWT, remindercontroller.add_reminder)
router.get('/reminder_list', authenticateJWT, remindercontroller.reminder_list)



module.exports = router;