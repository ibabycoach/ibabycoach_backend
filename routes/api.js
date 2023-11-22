
const Authcontroller = require('../controller/Api/Authcontroller')

var router = express.Router();


router.post('/signup', Authcontroller.signup)
router.post('/Login', Authcontroller.Login)
router.post('/otpVerify', Authcontroller.otpVerify)
router.post("/resend_otp", Authcontroller.resend_otp)
router.post('/socialLogin', Authcontroller.socialLogin)
router.post('/logOut', authenticateJWT, Authcontroller.logOut)


module.exports = router;