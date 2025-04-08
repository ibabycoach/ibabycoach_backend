var express = require('express');
const AdminController = require('../controller/Admin/AdminController');
const userController = require('../controller/Admin/userController');
const babyController = require('../controller/Admin/babyController');
const cmsController = require('../controller/Admin/cmsController');
const contactUsController = require('../controller/Admin/contactUsController');
const subscriptionsController = require('../controller/Admin/subscriptionsController');
var { session } = require('../Helper/helper');
const growthController = require('../controller/Admin/growthController');
const activityController = require('../controller/Admin/activityController');
const goalsController = require('../controller/Admin/goalsController');
const pushNotificationController = require('../controller/Admin/pushNotificationController');
const subuserController = require('../controller/Admin/subuserController');
const chatController = require('../controller/Admin/chatController');
const subAdminController = require('../controller/Admin/sub-adminController');
const iconController = require('../controller/Admin/iconController');
const compareGrowthController = require('../controller/Admin/compareGrowthController');


var router = express.Router();

router.get('/loginPage', AdminController.loginPage)
router.post('/login', AdminController.login)
router.get('/dashboard', session, AdminController.dashboard)
router.get('/profile', session, AdminController.profile)
router.get('/editprofile', session, AdminController.editprofile)
router.post('/updateAdminProfile', AdminController.updateAdminProfile)
router.get('/changePassword', session, AdminController.changePassword)
router.post('/updatepassword', AdminController.updatepassword)
router.get('/logout', AdminController.logout)
router.get('/errorPage', AdminController.errorPage)

//************** SUB_ADMIN *****************
router.get('/sub_admin_list', session, subAdminController.sub_admin_list)
router.get('/add_sub_admin', session, subAdminController.add_sub_admin)
router.post('/create_sub_admin', subAdminController.create_sub_admin)
router.get('/view_sub_admin/:id', session, subAdminController.view_sub_admin)
router.get('/edit_sub_admin/:id', session, subAdminController.edit_sub_admin)
router.post('/update_SubAdmin', subAdminController.update_SubAdmin)
router.post('/subadmin_status', subAdminController.subadmin_status)
router.delete('/delete_subadmin/:id', subAdminController.delete_subadmin)

//*************** ICON *********************
router.get('/add_icon', session, iconController.add_icon)
router.post('/addIcon', iconController.addIcon)
router.get('/icon_list', session, iconController.icon_list)
router.get('/edit_icon/:id', session, iconController.edit_icon)
router.post('/update_icon', iconController.update_icon)
router.delete('/delete_icon/:id', iconController.delete_icon)

//*************** USER *********************
router.get('/userList', session, userController.userList)
router.get('/viewUser/:id', userController.viewUser)
router.get('/addUser', session, userController.addUser)
router.get('/editUser/:id', session, userController.editUser)
router.post('/createUser', userController.createUser)
router.post('/updateUser', userController.updateUser)
router.delete('/deleteUser/:id', userController.deleteUser)
router.post('/userStatus', userController.userStatus)
router.get('/subAdmin_user_list', userController.subAdmin_user_list)

 //***************SUBUSER ****************************
 router.get('/subuser_List', subuserController.subuser_List)
 router.get('/viewSubuser/:id', subuserController.viewSubuser)
 router.get('/editsubUser/:id', session, subuserController.editsubUser)
 router.post('/updatesubUser', subuserController.updatesubUser)

 

//**************** BABY *****************************
router.post('/createBaby', babyController.createBaby)
router.get('/babyList', session, babyController.babyList)
router.get('/addBaby', session, babyController.addBaby)
router.get('/editBaby/:id', session, babyController.editBaby)
router.get('/viewBaby/:id', session, babyController.viewBaby)
router.delete('/deleteBaby/:id', babyController.deleteBaby)
router.post('/updatebaby', babyController.updatebaby)



//************* CHAT ******************
router.get('/user_chat', session, chatController.user_chat)

//*************** CMS *************************
router.post('/addCms', cmsController.addCms)
router.get('/aboutUs', session, cmsController.aboutUs)
router.get('/privacyPolicy', session, cmsController.privacyPolicy)
router.get('/termsConditions', session, cmsController.termsConditions)
router.post('/updatecms', cmsController.updatecms)
router.get('/edit_changelog/:id', session, cmsController.edit_changelog)
router.get('/changelog_list', session, cmsController.changelog_list)
router.get('/add_log', session, cmsController.add_log)
router.delete('/delete_log/:id', cmsController.delete_log)


//***************** Contact US SUPPORT *********************
router.post('/createContactUs', contactUsController.createContactUs)
router.get('/contactUsList', session, contactUsController.contactUsList)
router.get('/viewContactUs/:id', session, contactUsController.viewContactUs)
router.delete('/delete_contact/:id', contactUsController.delete_contact)

//*******************  SUBSCRIPTIONS  *************************

router.get('/addplan', session, subscriptionsController.addplan)
router.post('/createSubscription', subscriptionsController.createSubscription)
router.get('/subscriptionList', session, subscriptionsController.subscriptionList)
router.get('/viewSubscription/:id', session, subscriptionsController.viewSubscription)
router.get('/editSubscription/:id', session, subscriptionsController.editSubscription)
router.post('/updateSubscription', subscriptionsController.updateSubscription)
router.delete('/deleteSubscription/:id', subscriptionsController.deleteSubscription)
router.post('/subsStatus', subscriptionsController.subsStatus)

//*****************  GROWTH  *************************************  
router.post('/add_growth', growthController.add_growth)
router.get('/growthList', session, growthController.growth_List)
router.get('/growth_view/:id', session, growthController.growth_view)
router.get('/editGrowth/:id', session, growthController.editGrowth)
router.post('/updateGrowth', growthController.updateGrowth)
router.delete('/delete_growth/:id', growthController.delete_growth)

//**************** Compare growth *********************************
router.get('/addgrowth', compareGrowthController.addgrowth)
router.post('/CreateGrowths', compareGrowthController.CreateGrowths)
router.get('/growthListing', session, compareGrowthController.growthListing)
router.post('/delete_Growth/:id', compareGrowthController.delete_Growth)

//*****************  Activity  *************************************    
router.post('/postActivity', session, activityController.postActivity)
router.get('/activityList', session, activityController.activity_List)
router.get('/activity_view/:id', session, activityController.activity_view)
router.get('/editActivity/:id', session, activityController.editActivity)
router.post('/updateActivity', activityController.updateActivity)
router.delete('/deleteactivity/:id', activityController.delete_activity)
router.get('/addActivity', session, activityController.addActivity)
router.post('/activityStatus', activityController.activityStatus)
router.get('/viewCustomizedActivity/:id', activityController.viewCustomizedActivity)

//*****************  Goal  *************************************    
router.post('/saveGoal', session, goalsController.saveGoal)
router.get('/Goal_List', session, goalsController.Goal_List)
router.get('/goalview/:id', session, goalsController.goal_view)
router.get('/editGoal/:id', session, goalsController.editGoal)
router.post('/updateGole', goalsController.updateGole)
router.delete('/delete_goale/:id', goalsController.delete_goale)
router.get('/addGoal', session, goalsController.addGoal)
router.post('/goaleStatus', goalsController.goaleStatus)


// **************************** Push Notification ***********************
router.get('/push-notification', pushNotificationController.pushNotification);
router.post('/push-notification', pushNotificationController.pushNotificationPost);


//////////////  CHAT  ///////////////


module.exports = router;
