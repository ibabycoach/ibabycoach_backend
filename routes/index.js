var express = require('express');
const AdminController = require('../controller/Admin/AdminController');
const userController = require('../controller/Admin/userController');
const babyController = require('../controller/Admin/babyController');
const cmsController = require('../controller/Admin/cmsController');
const contactUsController = require('../controller/Admin/contactUsController');
const subscriptionsController = require('../controller/Admin/subscriptionsController');
var {session} = require('../Helper/helper')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/loginPage', AdminController.loginPage)
router.post('/login', AdminController.login)
router.get('/dashboard', session, AdminController.dashboard)
router.get('/profile', session, AdminController.profile)
router.get('/editprofile', session, AdminController.editprofile)
router.post('/updateAdminProfile', AdminController.updateAdminProfile)
router.get('/changePassword', session, AdminController.changePassword)

//*************** USER *********************
router.get('/userList', session, userController.userList)
router.get('/viewUser/:id', userController.viewUser)
router.get('/addUser', session, userController.addUser)
router.get('/editUser/:id', session, userController.editUser)
router.post('/createUser', userController.createUser)
router.post('/updateUser', userController.updateUser)
router.delete('/deleteUser/:id', userController.deleteUser)
router.post('/userStatus', userController.userStatus)

//**************** BABY *****************************
router.post('/createBaby', babyController.createBaby)
router.get('/babyList', session, babyController.babyList)
router.get('/addBaby', session, babyController.addBaby)
router.get('/editBaby/:id', session, babyController.editBaby)
router.get('/viewBaby/:id', session, babyController.viewBaby)
router.delete('/deleteBaby/:id', babyController.deleteBaby)

//*************** CMS *************************
router.post('/addCms', cmsController.addCms)
router.get('/aboutUs', session, cmsController.aboutUs)
router.get('/privacyPolicy', session, cmsController.privacyPolicy)
router.get('/termsConditions', session, cmsController.termsConditions)
router.post('/updatecms', cmsController.updatecms)

//***************** Contact US SUPPORT *********************
router.post('/createContactUs', contactUsController.createContactUs)
router.get('/contactUsList', session, contactUsController.contactUsList)
router.get('/viewContactUs/:id', session, contactUsController.viewContactUs)

//*******************  SUBSCRIPTIONS  *************************
router.post('/createSubscription', subscriptionsController.createSubscription)
router.get('/subscriptionList', session, subscriptionsController.subscriptionList)
router.get('/viewSubscription/:id', session, subscriptionsController.viewSubscription)
router.get('/editSubscription/:id', session, subscriptionsController.editSubscription)
router.post('/updateSubscription', subscriptionsController.updateSubscription)



module.exports = router;
