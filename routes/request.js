const express = require("express");
const mysql = require("mysql");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const db = require("../config/db.js");
app.use(bodyParser.json());

const fs = require("fs");
const api = require("../api/api.js");

const checkIfLogged = require("./middleware/checkIfLogged");
const PORT = process.env.PORT;
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
const router = express.Router();
const upload = require("./middleware/multerMiddleware");

var cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: api.cloud_name,
  api_key: api.API_Key,
  api_secret: api.API_secret,
});

router.post("/submit", upload.array("image"), async (req, res) => {
  console.log(req.files);
  var imgurl = await cloudinary.uploader.upload(
    req.files[0].path,
    function (error, result) {
      if (error) {
        console.log(error);
      }
    }
  );
  var url = imgurl.url;
  var request = {
    blood_group: req.body.blood_type,
    quantity: req.body.units,
    PID: req.session.user,
    accepted: 0,
    uploaded_file: url,
  };

  await db.query(
    "INSERT INTO request SET ?",
    request,
    function (error, results, fields) {
      if (error) {
        console.log(error);
      } else {
        req.session.success = 1;
        req.session.blood_group = req.body.blood_type;
        res.redirect("/request/sendmails");
      }
    }
  );
});

var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "harshitapi46@gmail.com",
    pass: "Harshit46",
  },
});

router.get("/sendmails", checkIfLogged, async (req, res) => {
  console.log(req.session.blood_group);
  await db.query(
    "SELECT email FROM people WHERE blood_group = ?",
    req.session.blood_group,
    async (error, result, fields) => {
      if (error) {
        console.log(error);
        res.redirect("/");
      } else {
        console.log(result);
        //for (var i = 0; i < 5; i++) {
        for (var i = 0; false; i++) {
          var mailOptions = {
            from: "2019284@iiitdmj.ac.in",
            to: result[i].email,
            subject: "Blood Request",
            text: "Uregnt help needed please donate blood",
          };
          console.log(mailOptions);
          await transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
        }
        res.redirect("/");
      }
    }
  );
});
module.exports = router;
