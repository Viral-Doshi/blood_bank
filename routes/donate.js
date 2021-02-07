const express = require("express");
const mysql = require("mysql");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const db = require("../config/db.js");
app.use(bodyParser.json());
const getPid = require("./middleware/getPid.js");

const PORT = process.env.PORT;
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
const router = express.Router();
const upload = require("./middleware/multerMiddleware");

router.post("/search", getPid, async (req, res) => {
  var p = req.session.pid;
  var today = new Date();
  today =
    today.getFullYear() +
    "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + today.getDate()).slice(-2);
  console.log("date is", today);
  if (p == -1) res.redirect("/registeration-step1.html");
  else {
    await db.query(
      "SELECT * FROM donation_record WHERE PID = ? AND donation_date=?",
      [p, today],
      async (error, result, fields) => {
        if (result.length == 0) {
          wrong = true;
          res.redirect("/registeration-step1.html");
        } else {
          if (result[0].donation_step == 1) res.redirect("/pretest-step2.html");
          else if (result[0].donation_step == 2) {
            req.session.did = result[0].DID;
            req.session.blood_group=result[0].blood_type;
            res.redirect("/donation-step3.html");
          } else {
            
            res.redirect("/data-entry");
          }
        }
      }
    );
  }
});

router.post("/registeration-step1", getPid, (req, res) => {
  var today = new Date();
  var next_date = "";

  if (today.getMonth() >= 9) {
    next_date =
      today.getFullYear() +
      1 +
      "-" +
      ("0" + (today.getMonth() - 8)).slice(-2) +
      "-" +
      ("0" + today.getDate()).slice(-2);
  } else {
    next_date =
      today.getFullYear() +
      "-" +
      ("0" + (today.getMonth() + 1 + 3)).slice(-2) +
      "-" +
      ("0" + today.getDate()).slice(-2);
  }
  today =
    today.getFullYear() +
    "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + today.getDate()).slice(-2);

  var p = req.session.pid;

  console.log("today=", today);
  var donor_user = {
    PID: p,
    weight: req.body.weight,
    height: req.body.height,
    next_donation_date: next_date,
    previous_sms_date: today,
  };

  db.query(
    "INSERT INTO donor SET ?",
    donor_user,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.send("error");
      } else {
        console.log("here at insert");
      }
    }
  );

  var users = {
    PID: p,
    blood_type: req.body.blood_type,
    donation_date: today,
    donation_step: 1,
    BDCID: req.session.bdcid,
  };

  db.query(
    "INSERT INTO donation_record SET ? ; ",
    users,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.send("error");
      } else {
        console.log("here at insert");
        console.log("result=", results.insertId);

        res.redirect("/data-entry");
      }
    }
  );
});

router.post("/pretest-step2", async (req, res) => {
  p = req.session.pid;
  var d_step=2;
  if(req.body.hg_level == 0 ||req.body.bp_level ==0 || req.body.temp_level==0  )
  d_step=-1;
  var users = {
    PID: p,
    blood_test1: req.body.hg_level,
    blood_test2: req.body.bp_level,
    blood_test3: req.body.temp_level,
    donation_step: d_step,
  };

  await db.query(
    "UPDATE donation_record SET blood_test1=?,blood_test2=?,blood_test3=?,donation_step=? WHERE PID=? ;",
    [
      users.blood_test1,
      users.blood_test2,
      users.blood_test3,
      users.donation_step,
      users.PID,
    ],
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.send("error");
      } else {
        console.log("here at insert in pretets ");
        console.log("Rows affected:", results.affectedRows);
        res.redirect("/data-entry");
      }
    }
  );
});

router.post("/final", async (req, res) => {
  var bloodbag = {
    BBID: req.body.BBID,
    BLID: 3,
    available: 1,
    rejected: 0,
    Donated: 0,
    blood_group:req.session.blood_group,
  };

  await db.query(
    "UPDATE donation_record SET BBID=? , donation_step=3 WHERE DID=? ;",
    [req.body.BBID, req.session.did],
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.send("error");
      } else {
        console.log("update at insert in pretets ");
        console.log("Rows affected:", results.affectedRows);
      }
    }
  );

  {
    await db.query(
      "INSERT INTO blood_bag SET ?",
      bloodbag,
      function (err, results, fields) {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          res.redirect("/data-entry");
        }
      }
    );
  }
});

const checkIfLogged = require("./middleware/checkIfLogged");
const checkIfdataEntry = require("./middleware/checkIfdataEntry");

router.get("/final", [checkIfLogged, checkIfdataEntry], async (req, res) => {
  res.redirect("/data-entry");
});

module.exports = router;
