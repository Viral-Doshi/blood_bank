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
  console.log("inside search");
  req.session.link_freez = 0;
  if (p == -1) {
      //user doesnot exsists .. redirect him to registration
      res.redirect("/registeration-step1.html");
  }
  else {
    await db.query(
      `SELECT donation_record.*, people.blood_group, people.full_name FROM
      (SELECT * FROM donation_record WHERE PID = ? AND donation_date=?) AS donation_record
      INNER JOIN people ON donation_record.PID = people.PID;
      `,
      [p, today],
      async (error, result, fields) => {
        if (result.length == 0) {
          wrong = true;
          req.session.link_freez = 1;
          console.log("inside reg-step-1 bcz DID on current date was not found");
          res.redirect("/registeration-step1.html");
        } else {
          if (result[0].donation_step == 1) {
            req.session.did = result[0].DID;
            //don't freez step-1 link
            req.session.link_freez = 2;
            console.log("inside .. redirecting to pretest..");
            res.redirect("/pretest-step2.html");
          }
          else if (result[0].donation_step == 2) {
            req.session.did = result[0].DID;
            req.session.pid = result[0].PID;
            req.session.full_name = result[0].full_name;
            req.session.blood_group = result[0].blood_group;
            req.session.haemoglobin = result[0].haemoglobin;
            req.session.BP = result[0].BP;
            req.session.temp = result[0].temp;
            req.session.pulse = result[0].pulse;
            req.session.link_freez = 3;
            console.log("inside .. getting pretest results");
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
  req.session.link_freez = 0;
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
    "INSERT INTO donor SET ? ON DUPLICATE KEY UPDATE weight=?,height=?,next_donation_date=?,previous_sms_date=?",
    [donor_user, donor_user.weight, donor_user.height, donor_user.next_donation_date, donor_user.previous_sms_date],
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.send("error");
      } else {
        console.log("Insert/update donor record done.");
      }
    }
  );

  var people = {
    full_name: req.body.name,
    blood_group: req.body.blood_type,
    DOB: req.body.dob,
    gender: req.body.gender,
  };

  db.query(
    "UPDATE people SET ? WHERE PID=?;",
    [people, p],
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.send("error");
      } else {
        console.log("Updated People pid = "+p);
      }
    }
  );

  var users = {
    PID: p,
    donation_date: today,
    donation_step: 1,
    BDCID: req.session.bdcid,
    BLID: req.session.blid,
  };

  db.query(
    "INSERT INTO donation_record SET ? ; ",
    users,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.send("error");
      } else {
        console.log("here at insert donation record");
        console.log("result=", results.insertId);

        res.redirect("/data-entry");
      }
    }
  );
});

router.post("/pretest-step2", async (req, res) => {
  p = req.session.pid;
  req.session.link_freez = 0;
  did = (typeof req.session.did=="undefined")?"":req.session.did;
  var d_step=2;
  if(req.body.hg_level == 0 ||req.body.bp_level ==0 || req.body.temp_level==0 || req.body.pulse==0  ){
      d_step=-1;
  }
  var users = {
    PID: p,
    DID: did,
    haemoglobin: req.body.hg_level,
    BP: req.body.bp_level,
    temp: req.body.temp_level,
    pulse: req.body.pulse,
    blood_type: req.body.blood_type,
    donation_step: d_step,
  };

  await db.query(
    "UPDATE donation_record SET haemoglobin=?,BP=?,temp=?,pulse=?,donation_step=? WHERE DID=?;",
    [
      users.haemoglobin,
      users.BP,
      users.temp,
      users.pulse,
      users.donation_step,
      users.DID,
    ],
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.send("error");
      } else {
        console.log("donation record updated for pretests did = "+users.DID);
        console.log("Rows affected:", results.affectedRows);
      }
    }
  );
  await db.query(
    "UPDATE people SET blood_group=? WHERE PID=?;",
    [
      users.blood_type,
      users.PID,
    ],
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.send("error");
      } else {
        console.log("people blood group updated pid ,blood_group = "+users.PID+" "+users.blood_type);
        console.log("Rows affected:", results.affectedRows);
        res.redirect("/data-entry");
      }
    }
  );
});

router.post("/final", async (req, res) => {
  req.session.link_freez = 0;
  var bloodbag = {
    BBID: req.body.BBID,
    BLID: 1,
    status: "available",
    blood_group: req.session.blood_group,
  };

  await db.query(
    "INSERT INTO blood_bag SET ?",
    bloodbag,
    async function (err, results, fields) {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
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
                res.redirect("/data-entry");
              }
            }
          );
      }
    }
  );
});

const checkIfLogged = require("./middleware/checkIfLogged");
const checkIfdataEntry = require("./middleware/checkIfdataEntry");

router.get("/final", [checkIfLogged, checkIfdataEntry], async (req, res) => {
  res.redirect("/data-entry");
});

module.exports = router;
