// var { v4: uuid } = require('uuid');
var path = require('path');
const user_model = require('../model/Admin/user');
// const { v4: uuidv4 } = require('uuid');
const uuid = require('uuid').v4
const bcrypt = require('bcrypt');
const { Validator } = require("node-input-validator");
var jwt = require("jsonwebtoken");
const secretCryptoKey = process.env.jwtSecretKey || "secret_iBabycoachs_@onlyF0r_JWT";
// const stripe = require('stripe')(process.env.SECRETKEY)
const SECRET_KEY = process.env.SECRET_KEY;
const PUBLISH_KEY =process.env.PUBLISH_KEY;
var FCM = require('fcm-node');

const admin = require('firebase-admin');
const serviceAccount = require('../Helper/ibabycoach-bb27e-firebase-adminsdk-2vkft-8cb683c78e.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = {

  imageUpload: (file, folder = 'user') => {
    if (file.name == '') return;

    let file_name_string = file.name;
    var file_name_array = file_name_string.split(".");
    var file_extension = file_name_array[file_name_array.length - 1];
    var letters = "ABCDE1234567890FGHJK1234567890MNPQRSTUXY";
    var result = "";


    result = uuid();
    let name = result + '.' + file_extension;
    file.mv('public/' + folder + '/' + name, function (err) {
      if (err) throw err;
    });
    return '/' + folder + '/' + name;
  },

  session: async (req, res, next) => {

    if (req.session.user) {
      next();
    } else {
      return res.redirect("/loginPage");

    }
  },

  success: function (res, message = "", body = {}) {
    return res.status(200).json({
      success: true,
      code: 200,
      message: message,
      body: body,
    });
  },

  error: function (res, err, req) {
    console.log(err, "====================>error");
    let code = typeof err === "object" ? (err.code ? err.code : 403) : 403;
    let message =
      typeof err === "object" ? (err.message ? err.message : "") : err;

    if (req) {
      req.flash("flashMessage", {
        color: "error",
        message,
      });

      const originalUrl = req.originalUrl.split("/")[1];
      return res.redirect(`/${originalUrl}`);
    }

    return res.status(code).json({
      success: false,
      message: message,
      code: code,
      body: {},
    });
  },

  failed: function (res, message = "") {
    message =
      typeof message === "object"
        ? message.message
          ? message.message
          : ""
        : message;
    return res.status(400).json({
      success: false,
      code: 400,
      message: message,
      body: {},
    });
  },

  failed2: function (res, message = "") {
    message =
      typeof message === "object"
        ? message.message
          ? message.message
          : ""
        : message;
    return res.status(400).json({
      success: true,
      code: 200,
      message: message,
      body: [],
    });
  },

  failed403: function (res, message = "") {
    message =
      typeof message === "object"
        ? message.message
          ? message.message
          : ""
        : message;
    return res.status(403).json({
      success: false,
      code: 403,
      message: message,
      body: {},
    });
  },

  unixTimestamp: function () {
    var time = Date.now();
    var n = time / 1000;
    return (time = Math.floor(n));
  },

  findUserDeviceToken: async (userid) => {
    try {
      let data = await user_model.find({ _id: { $in: userid } });
      console.log(
        "🚀  file: helper.js:153  findUserDeviceToken:async ~ data:",
        data
      );
      return data;
    } catch (error) { }
  },

  readFile: async (path) => {
    console.log("  ********** readFile *****************")
    console.log(path, "  ********** pathreadFile *****************")
    return new Promise((resolve, reject) => {
      const readFile = util.promisify(fs.readFile);
      readFile(path).then((buffer) => {
        resolve(buffer);
      }).catch((error) => {
        reject(error);
      });
    });
  },

  writeFile: async (path, buffer) => {
    console.log("  ********** write file *****************")
    return new Promise((resolve, reject) => {
      const writeFile1 = util.promisify(fs.writeFile);
      writeFile1(path, buffer).then((buffer) => {
        resolve(buffer);
      }).catch((error) => {
        reject(error);
      });
    });
  },

  createVideoThumb: async (fileData, thumbnailPath) => {
    var VIDEO_THUMBNAIL_TIME = '00:00:02'
    var VIDEO_THUMBNAIL_SIZE = '300x200'
    var VIDEO_THUMBNAIL_TYPE = 'video'
    return new Promise(async (resolve, reject) => {
      Thumbler({
        type: VIDEO_THUMBNAIL_TYPE,
        input: fileData,
        output: thumbnailPath,
        time: VIDEO_THUMBNAIL_TIME,
        size: VIDEO_THUMBNAIL_SIZE // this optional if null will use the desimention of the video
      }, function (err, path) {
        if (err) reject(err);
        resolve(path);
      });
    });
  },

  fileUploadMultiparty: async function (FILE, FOLDER, FILE_TYPE) {
    console.log(FILE, FOLDER, FILE_TYPE, '[----------data-------]');
    try {

      var FILENAME = FILE.name; // actual filename of file
      var FILEPATH = FILE.tempFilePath; // will be put into a temp directory

      THUMBNAIL_IMAGE_SIZE = 300
      THUMBNAIL_IMAGE_QUALITY = 100

      let EXT = fileExtension(FILENAME); //get extension
      EXT = EXT ? EXT : 'jpg';
      FOLDER_PATH = FOLDER ? (FOLDER + "/") : ""; // if folder name then add following "/" 
      var ORIGINAL_FILE_UPLOAD_PATH = "/public/uploads/" + FOLDER_PATH;
      var THUMBNAIL_FILE_UPLOAD_PATH = "/public/uploads/" + FOLDER_PATH;
      var THUMBNAIL_FILE_UPLOAD_PATH_RETURN = "/uploads/" + FOLDER_PATH;
      var NEW_FILE_NAME = (new Date()).getTime() + "-" + "file." + EXT;
      var NEW_THUMBNAIL_NAME = (new Date()).getTime() + "-" + "thumbnail" + "-" + "file." + ((FILE_TYPE == "video") ? "jpg" : EXT);


      let NEWPATH = path.join(__dirname, '../', ORIGINAL_FILE_UPLOAD_PATH, NEW_FILE_NAME);
      console.log(NEWPATH, '[=======NEWPATH======]');
      let THUMBNAIL_PATH = path.join(__dirname, '../', ORIGINAL_FILE_UPLOAD_PATH, NEW_THUMBNAIL_NAME);

      let FILE_OBJECT = {
        "image": '',
        "thumbnail": '',
        "fileName": FILENAME,
        "folder": FOLDER,
        "file_type": FILE_TYPE
      }

      console.log(FILEPATH, '====================FILEPATH')
      // return

      let BUFFER = await this.readFile(FILEPATH); //read file from temp path
      await this.writeFile(NEWPATH, BUFFER); //write file to destination

      FILE_OBJECT.image = THUMBNAIL_FILE_UPLOAD_PATH_RETURN + NEW_FILE_NAME;

      let THUMB_BUFFER = "";

      if (FILE_TYPE == 'image') { // image thumbnail code
        var THUMB_IMAGE_TYPE = (EXT == "png") ? "png" : "jpeg";
        THUMB_BUFFER = await sharp(BUFFER)
          .resize(THUMBNAIL_IMAGE_SIZE)
          .toFormat(THUMB_IMAGE_TYPE, {
            quality: THUMBNAIL_IMAGE_QUALITY
          })
          .toBuffer();
        // FILE_OBJECT.thumbnail = THUMBNAIL_FILE_UPLOAD_PATH + NEW_THUMBNAIL_NAME;
        FILE_OBJECT.thumbnail = THUMBNAIL_FILE_UPLOAD_PATH_RETURN + NEW_THUMBNAIL_NAME;
        await this.writeFile(THUMBNAIL_PATH, THUMB_BUFFER);
      } else if (FILE_TYPE == "video") { // video thumbnail code
        await this.createVideoThumb(NEWPATH, THUMBNAIL_PATH, NEW_THUMBNAIL_NAME);
        FILE_OBJECT.thumbnail = THUMBNAIL_FILE_UPLOAD_PATH_RETURN + NEW_THUMBNAIL_NAME;
      } else {
        FILE_OBJECT.thumbnail = ''
      }
      return FILE_OBJECT;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  checkValidation: async (v) => {
    var errorsResponse;

    await v.check().then(function (matched) {
      if (!matched) {
        var valdErrors = v.errors;
        var respErrors = [];
        Object.keys(valdErrors).forEach(function (key) {
          if (valdErrors && valdErrors[key] && valdErrors[key].message) {
            respErrors.push(valdErrors[key].message);
          }
        });
        errorsResponse = respErrors.join(", ");
      }
    });
    return errorsResponse;
  },

  authenticateHeader: async function (req, res, next) {
    const v = new Validator(req.headers, {
      secret_key: "required|string",
      publish_key: "required|string",
    });

    let errorsResponse =await module.exports.checkValidation(v); // Use the stored reference
  
    if (errorsResponse) {
      await module.exports.failed(res, errorsResponse);
    }
  
    if (
      req.headers.secret_key !== SECRET_KEY ||
      req.headers.publish_key !== PUBLISH_KEY
    ) {
      await module.exports.failed(res, "Key not matched!"); // Assuming failed function is defined somewhere
    }
    next();
  },

  authenticateJWT: async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(" ")[1];

      jwt.verify(token, secretCryptoKey, async (err, payload) => {

        // console.log(token, ">>>>>>>>>>>>>>>>>>.token");
        console.log( payload, ">>>>>>>>>>>>>>>>>>payload.");
        

        if (err) {
          return res.status(401).json({
            success: false,
            code: 401,
            message: "invalid token",
            // body: {},
            body: []
          });
        }

        const existingUser = await user_model.findOne({
          _id: payload.data._id,
          // loginTime: payload.data.loginTime,
        });

        if (existingUser) {
          req.user = existingUser;

          next();
        } else {
          return res.status(401).json({
            success: false,
            code: 401,
            message: "Unauthorized token",
            // body: {},
             body: []
          });
        }
      });
    } else {
      return res.status(403).json({
        success: false,
        code: 403,
        message: "Token required",
        // body: {},
         body: []
      });
    }
  },

  verifyUser: async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      console.log("object");
      jwt.verify(token, SECRETCRYPTO_KEY, async (err, payload) => {
        if (err) {
          return res.sendStatus(403);
        }
        console.log("object,,,,,,,,", payload.data.id);
        const existingUser = await users.findOne({
          where: {
            id: payload.data.id,
            login_time: payload.data.login_time,
          },
        });
        console.log("existingUser,,,,,,,,,,,,,,,,,", existingUser);

        // const existingUser = await users.findOne({
        //   where: {
        //     id: payload.id,
        //     login_time: payload.login_time,
        //   },
        // });
        if (existingUser) {
          req.user = existingUser;
          next();
        } else {
          res.sendStatus(401);
        }
      });
    } else {
      res.sendStatus(401);
    }
  },

  //////////////////  STRIPE  /////////////////////
  strieCustomer: async email => {
    console.log(email);
    const customer = await stripe.customers.create({
      email: email,
    });
    return customer ? customer.id : "0";
  },

  stripeToken: async (req) => {
    const token = await stripe.tokens.create({
      card: {
        number: req.body.card_number,
        exp_month: req.body.expire_month,
        exp_year: req.body.expire_year,
      },
    });
    const source = await stripe.customers.createSource(req.user.stripe_customer, {
      source: token.id,
    });

    return source ? source.id : "0";
  },

  stripePayment: async (req, res) => {

    var charge = await stripe.charges.create({
      amount: req.body.total * 1000,
      currency: 'usd',
      customer: req.auth.customer_id,
      source: req.body.card_token,
      description: 'Jobbie',
    });
    return charge;
  },

  paypalPayment: (order, req, item) => {
    return new Promise(async (resolve, reject) => {
      try {
        var formattedProducts = item.map(product => {
          return {
            price: parseFloat(product.price).toFixed(2),
            quantity: parseInt(product.quantity),
          };
        });
        var totalQuantity = formattedProducts.reduce(
          (sum, product) => sum + product.quantity,
          0
        );

        await paypal.payment.create(
          {
            intent: 'sale',
            payer: {
              payment_method: 'paypal',
            },
            redirect_urls: {
              return_url: `${req.protocol}://${req.get('host')}/api/paypalSuccessURL?amount=${parseFloat(order.total)}&orderId=${parseInt(order.id)}&status=1`,
              cancel_url: `${req.protocol}://${req.get('host')}/api/cancleUrl?status=0`,
            },
            transactions: [
              {
                item_list: {
                  items: [
                    {
                      name: '',
                      price: order.total,
                      currency: 'USD',
                      quantity: 1,
                    },
                  ],
                },
                amount: {
                  total: order.total,
                  currency: 'USD',
                },
                description: 'Payment description',
              },
            ],
          },
          (error, payment) => {
            if (error) {
              reject(error);
            } else {
              const approval_url = payment.links.find(
                link => link.rel === 'approval_url'
              ).href;
              resolve(approval_url);
            }
          }
        );
      } catch (error) {
        console.error('PayPal API Error:', error);
        reject(error);
      }
    });
  },

  SMTP: function (object) {
    var transporter = nodemailer.createTransport(config.mail_auth);
    var mailOptions = object;
    transporter.sendMail(mailOptions, function (error, info) {
      if (err) {
        throw error;
      } else {
        throw message;
      }
    });
  },

  calculateAverageRating: async (spot_id) => {
    try{
    const averageRatingPipeline = [
      {
        $match: {
          workerId: spot_id,
        },
      },
      {
        $group: {
          _id: '$workerId',
          averageRating: {$avg: '$rating'},
          ratingCount: {$sum: 1},
        },
      },
      {
        $project: {
          _id: 0,
          averageRating: 1,
          ratingCount: 1,
        },
      },
    ];

    const spotAverageRatings = await review_model.aggregate (averageRatingPipeline);
    const result = spotAverageRatings[0];

    return result;
  } catch (error) {
        console.log(error)  
  }
  },
  
  notificationData:  async(data) =>{
      const notificationObj = {
        sender:data.sender,
        receiver:data.receiver,
        message:data.message,
        activityIds: data.activityIds.toString(),
        activity_name: data.activity_name,
        image: data.image,
        bg_color: data.bg_color,
        type:data.type,
        status:1
      }
     const notify = await notification_model.create(notificationObj);
      return notify;
  },

  send_push_notificationsAdmin : (payLoad) => {
    try {
      console.log(payLoad, ">>>>>>>>>>>>>>>>>>>>>>>>>>.payload");
      
      if (payLoad && payLoad.device_token && payLoad.device_token != "") {
        var message = {
          token: payLoad.device_token,
          notification: {
            title: "ibabycoach",
            body: String(payLoad.message) 
          },
          data: {
            title: "ibabycoach",
            body: String(payLoad.message),
            content_available: "true", 
            priority: "high",
            notificationType: String(payLoad.type),
            sender_name: String(payLoad.sender_name),
            sender_id: String(payLoad.sender_id)  ,
            receiver_id: String(payLoad.receiver_id ? payLoad.receiver_id : "")  ,
          },
      };

        // var message = {
        //   to: payLoad.device_token,
        //   notification: {
        //     title: "ibabycoach",
        //     body: payLoad.message,
        //     content_available: true,
        //     priority: "high",
        //     notificationType: payLoad.type ,
        //     sender_name: payLoad.sender_name,
        //   },
        //   data: {
        //     title: "ibabycoach",
        //     body: payLoad.message,
        //     content_available: true,
        //     priority: "high",
        //     notificationType: payLoad.type,
        //     sender_name: payLoad.sender_name,
        //     sender_id:payLoad.sender_id  ,
        //     receiver_id:payLoad.receiver_id ? payLoad.receiver_id : ""  ,
        //   },
        // };

        admin.messaging().send(message)
          .then((response) => {
              console.log('Successfully sent message:', response);
          })
          .catch((error) => {
              console.log('Error sending message:', error);
          });
      }
    } catch (error) {
      console.log(error)
    }
  },

  send_push_notifications: (payLoad) => {
    try {
      if (payLoad && payLoad.device_token) {
        
        var message = {
            token: payLoad.device_token,
            notification: {
              title: "ibabycoach",
              body: String(payLoad.message) 
            },
            data: {
              title: "ibabycoach",
              body: String(payLoad.message),
              content_available: "true", 
              priority: "high",
              activityIds: String(payLoad.activityIds.toString()),
              activity_name: String(payLoad.activity_name),
              image: String(payLoad.image),
              bg_color: String(payLoad.bg_color),
              notificationType: String(payLoad.type),
              sender_name: String(payLoad.sender_name),
              sender_id: String(payLoad.sender_id)  ,
              receiver_id: String(payLoad.receiver_id ? payLoad.receiver_id : "")  ,
            },
        };
        
        admin.messaging().send(message)
          .then((response) => {
              console.log('Successfully sent message:', response);
          })
          .catch((error) => {
              console.log('Error sending message:', error);
          });
      }
    } catch (error) {
        console.log(error);
    }
  },

  
}