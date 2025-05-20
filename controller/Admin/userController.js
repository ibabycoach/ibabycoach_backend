const userModel = require('../../model/Admin/user')
const babyModel = require('../../model/Admin/baby')
const subadminModel = require("../../model/Admin/subAdmin_permissions");
const activityModel = require('../../model/Admin/activity');
const helper = require('../../Helper/helper')
const bcrypt = require('bcrypt')
var fs = require("fs")
var path = require("path");
var ejs = require("ejs")
const { ReadableStream } = require('web-streams-polyfill');
global.ReadableStream = ReadableStream;
const puppeteer = require('puppeteer');
const PDFDocument = require("pdfkit");


module.exports = {
    
    createUser: async(req, res)=> {
        try {
            const userExist = await userModel.findOne({ email: req.body.email });
          if (userExist) {
            // req.flash("msg", "Email already existed");
            // res.redirect('/add_user');
            return helper.failed(res,"Email Already Exist")
          }
          const phoneNumberExist = await userModel.findOne({ phone: req.body.phone });
          if (phoneNumberExist) {
            // req.flash("msg", "Phone number already existed");
            // res.redirect('/add_user');
            return helper.failed(res,"Phone Number Already Exist")
        }
        if (req.files && req.files.image) {
            var image = req.files.image;
            if (image) {
                req.body.image = helper.imageUpload(image, "images");
            }
        }
        let hash = await bcrypt.hash(req.body.password, 10);
        let createuser = await userModel.create({
            role: req.body.role,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.body.image,
            password: hash,
        
        });
        //  res.redirect('/userList')
        res.json(createuser)
          console.log("signup successfully")
          return helper.success(res, "created successfully", createuser)
        } catch (error) {
          console.log(error)
        }
  
    },

    addUser: async(req, res)=> {
        try {
            let title = "userList"
            res.render('Admin/user/addUser', { title, session:req.session.user,  msg: req.flash('msg') })
        } catch (error) {
           console.log(error) 
        }
    },

    editUser: async(req, res)=> {
        try {
            let title = "userList"
            const updatedata = await userModel.findOne({_id: req.params.id})
            res.render('Admin/user/editUser', { title, updatedata, session:req.session.user,  msg: req.flash('msg') })
        } catch (error) {
           console.log(error) 
        }
    },

    updateUser: async(req, res)=> {
        try {

            if (req.files && req.files.image){
                var image = req.files.image;

                if(image){
                    req.body.image = helper.imageUpload(image, "images")
                }
            }
            const updateData = await userModel.updateOne({_id: req.body.id},
                
                {  
                    name: req.body.name,
                    phone: req.body.phone,
                    email: req.body.email,
                    image: req.body.image
                })

            res.redirect("/userList")
        } catch (error) {
           console.log(error) 
        }
    },

    userList: async(req, res)=> {
        try {
            let title = "userList"
            let condition = {role:1, deleted: false}
            if (req.session.user.role == 3) {
                condition._id = {
                    $in: req.session.user.usersId
                }
            }
            const userData = await userModel.find(condition)
            res.render('Admin/user/userList', { title, userData, session:req.session.user,  msg: req.flash('msg')})
        } catch (error) {
           console.log(error) 
        }
    },

    viewUser: async(req, res)=> {
        try {
            let title = "userList"
            const userdetails = await userModel.findById({_id: req.params.id})
            const findSubUser = await userModel.find({parentId: req.params.id, role: "2"})
            const findbaby = await babyModel.find({userId: req.params.id})
            res.render('Admin/user/viewUser', { title, userdetails, findSubUser, findbaby, session:req.session.user,  msg: req.flash('msg') })
        } catch (error) {
            console.log(error)
        }
    },

    userStatus: async (req, res) => {
        try {
          
            var check = await userModel.updateOne(
            { _id: req.body.id },
            { status: req.body.value }
            );
            req.flash("msg", "Status updated successfully");
            
            if (req.body.value == 0) res.send(false);
            if (req.body.value == 1) res.send(true);
        
            } catch (error) {
            console.log(error)
            }
    },

    deleteUser: async(req, res)=> {
        try {
            let userId = req.body.id 
            const removeuser = await userModel.findByIdAndUpdate({_id: userId},
                {deleted:true})
                if (removeuser) {
                    const removeSubUser = await userModel.findOneAndUpdate({parentId: userId},
                    {deleted:true})
                    const removeBaby = await babyModel.findOneAndUpdate({userId: userId},
                    {deleted:true})
                    const removeActivity = await activityModel.updateOne({userId: userId},
                    {deleted:true})
                }
            res.redirect("/userList") 
        } catch (error) {
        console.log(error)
        }
    },

    subAdmin_user_list: async(req, res) => {
        try {
            try {
                let title = "userList"
                const subadminData = await subadminModel.findOne({_id: '666ad616969dbbfa74f09271', deleted: false})
                const userData = await userModel.find({_id: subadminData.usersId, deleted: false})
                
                // res.render('Admin/user/userList', { title, userData, session:req.session.user,  msg: req.flash('msg')})
                res.json(userData)
            } catch (error) {
               console.log(error) 
            }
        } catch (error) {
            
        }
    },

    getPdfData: async (req, res) => {
        try {
            
            const userlist = await userModel.find({ deleted: false, role:1  });
            
           const doc = new PDFDocument({ margin: 30, size: "A4", layout: "landscape" });
 
                res.setHeader("Content-Disposition", 'attachment; filename="users.pdf"');
                res.setHeader("Content-Type", "application/pdf");
 
                doc.pipe(res);
 
                doc.fontSize(15).text("Users List", { align: "center" }).moveDown(1);
 
                const tableTop = 100;
                const columnWidths = [50, 200, 300, 120, 120];
                const totalWidth = columnWidths.reduce((sum, width) => sum + width, 50);
                const rowHeight = 25;
                const headers = ["S.No", "Full Name", "Email", "Phone", "Created At"];
 
                function drawTableHeaders(yPos) {
                    let xPos = 50;
                    // doc.font("Helvetica-Bold");
                    headers.forEach((header, index) => {
                        doc.text(header, xPos, yPos, { width: columnWidths[index], align: "center" });
                        xPos += columnWidths[index];
                    });
                    doc.moveTo(50, yPos + 15).lineTo(totalWidth, yPos + 15).stroke();
                }
 
                drawTableHeaders(tableTop);
                let yPos = tableTop + rowHeight;
 
                doc.font("Helvetica");
 
                userlist.forEach((user, index) => {
                    if (yPos + rowHeight > 550) {
                        doc.addPage();
                        yPos = 100;
                        drawTableHeaders(yPos);
                        yPos += rowHeight;
                    }
 
                    let xPos = 50;
                    const row = [
                        index + 1,
                        user.name,
                        user.email.length > 20 ? user.email.substring(0, 20) + "..." : user.email,
                        user.phone || "N/A",
                        user.createdAt.toISOString().split("T")[0],
                        // user.status || "N/A"
                    ];
 
 
                    row.forEach((text, colIndex) => {
                        doc.text(text.toString(), xPos, yPos, { width: columnWidths[colIndex], align: "center" });
                        xPos += columnWidths[colIndex];
                    });
 
                    yPos += rowHeight;
                    doc.moveTo(50, yPos - 5).lineTo(totalWidth, yPos - 5).stroke();
                });
 
                doc.end();
        } catch (error) {
            console.error("Error generating PDF:", error.stack); // Log stack trace for better debugging
            // req.flash('success', 'Pdf Fetched')
            res.redirect("back")
        }
    },

}
