//All backend related to Users
//Basic NodejS setup
const express = require("express");
const mysql = require("mysql");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const db = require("../config/db.js");

const PORT = process.env.PORT;
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
const router = express.Router();

const accountSid = "AC142fc44869b899d213595efc3506423a";
const authToken = "18fd4e04f4f942a98a17ed1bc2214307";
const client = require("twilio")(accountSid, authToken);

//For Encryption
const bcrypt = require("bcryptjs");

//To Check if user already exists
const checkIfPersonExists = require("./middleware/checkIfPersonExists.js");

const checkIfLogged = require("./middleware/checkIfLogged.js");
const checkIfAdmin = require("./middleware/checkIfAdmin.js");

const { fields } = require("./middleware/multerMiddleware.js");
// const checkIfRegister = require("./middleware/loginMiddleware");
//Handle Registering Users

//POST user/signup
router.post("/add-people", checkIfPersonExists, async (req, res) => {
  var users = {
    full_name: req.body.name,
    blood_group: req.body.blood_group,
    DOB: req.body.dob,
    phone_number: req.body.phone,
    email: req.body.email,
    password: req.body.password,
    verified: req.body.otp,
    gender: req.body.gender,
    user_type: req.body.user_type,
  };

  console.log(users);

  const salt = await bcrypt.genSalt(10);
  users.password = await bcrypt.hash(req.body.password, salt);

  msg = "";
  {
    await db.query(
      "INSERT INTO people SET ?",
      users,
      async function (error, results, fields) {
        if (error) {
          console.log(error);
          res.redirect("/admin/index_admin");
        } else {
          console.log("new people created : PID = "+results.insertId);
          // add donor account only if admin entered details
          if(req.body.add_donor=="1"){
              var donor = {
                  PID: results.insertId,
                  height: req.body.height,
                  weight: req.body.weight,
                  next_donation_date: req.body.next_donation_date,
                  previous_sms_date: (req.body.previous_sms_date=="")?null:req.body.previous_sms_date=="",
              };
              await db.query(
                "INSERT INTO donor SET ?",
                donor,
                function(error,results, fields){
                    if (error) {
                      console.log(error);
                      res.redirect("/admin/index_admin");
                    } else {
                      console.log("donor inserted");
                      res.redirect("/admin/admin-people");
                    }
                }
              );
          }
          else{
              res.redirect("/admin/admin-people");
          }
        }
      }
    );
  }
});

/*
  msg = "";
  {
    await db.query(
      "INSERT INTO people SET ?",
      users,
      function (error, results, fields) {
        if (error) {
          console.log(error);
          res.redirect("/admin/index_admin");
        } else {
          var otp = Math.floor(100000 + Math.random() * 900000);
          req.session.otp = otp;
          req.session.email = users.email;
          client.messages
            .create({
              body: otp,
              from: "+17076796056",
              to: "+91" + req.body.phone,
            })
            .then((message) => console.log(message.sid));
          res.redirect("/admin/otp");
        }
      }
    );
  }
});

router.get("/otp", async (req, res) => {
  res.render("otp");
});

router.post("/otp", async (req, res) => {
  if (req.body.otp == req.session.otp) {
    res.redirect("/admin/people");
  } else {
    await db.query(
      "DELETE FROM people WHERE email =?",
      email,
      function (err, res, fields) {
        if (err) {
          console.log(err);
        } else {
          res.send("Wrong OTP");
        }
      }
    );
  }
});
*/

router.post("/add-camp", async (req, res) => {
  var camp = {
    camp_name: req.body.camp_name,
    camp_start: req.body.start_date,
    camp_end: req.body.end_date,
    location: req.body.location,
    comments: req.body.comments,
  };
  console.log(camp);

  msg = "";
  {
    await db.query(
      "INSERT INTO blood_donation_camp SET ?",
      camp,
      function (error, results, fields) {
        if (error) {
          console.log(error);
          res.redirect("/admin/add-camp.html");
        } else {
          res.redirect("/admin/admin-camps.html");
        }
      }
    );
  }
});

var wrong = false;
router.get("/index_admin", [checkIfLogged, checkIfAdmin], function (req, res) {
  res.render("admin/index_admin", { wrong: wrong });
});

router.get("/add-people", [checkIfLogged, checkIfAdmin], function (req, res) {
  res.render("admin/add-people", { wrong: wrong });
});

router.get("/admin-people", [checkIfLogged, checkIfAdmin], async (req, res) => {
  await db.query("SELECT * FROM people", function (error, result, fields) {
    if (error) {
      console.log(error);
    } else {
      var peoples = result;
      res.render("admin/admin-people", {
        logged: req.session.admin,
        peoples: result,
      });
    }
  });
});

router.get(
  "/full-camps/filter",
  [checkIfLogged, checkIfAdmin],
  async (req, res) => {
    res.redirect("/admin/admin-camps.html");
  }
);

router.post("/full-camps/filter", async (req, res) => {
  var query;
  var datetime = new Date();
  var date = datetime.toISOString().slice(0, 10);

  if (req.body.filter == "Upcoming") {
    query = "SELECT * FROM blood_donation_camp WHERE camp_start > ?";
  } else if (req.body.filter == "ongoing") {
    query =
      "SELECT * FROM blood_donation_camp WHERE camp_start < ? AND camp_end > ?";
  } else {
    query = "SELECT * FROM blood_donation_camp WHERE camp_end < ?";
  }
  if ((req.body.order = "asc")) {
    query = query + " ORDER BY camp_start ASC";
  } else {
    query = query + " ORDER BY camp_start DESC";
  }

  await db.query(query, [date, date], async (error, result, fields) => {
    if (error) {
      console.log(error);
    } else {
      console.log("filtered camps=", result);
      res.render("admin/admin-camps", {
        logged: req.session.admin,
        camps: result,
      });
    }
  });
});

router.post("/full-people/filter", async (req, res) => {
  var query;

  var user_type;
  if (req.body.filter == "normal") {
    query = "SELECT * FROM people WHERE user_type = ?";
    user_type = "normal";
  } else if (req.body.filter == "data-entry") {
    query = "SELECT * FROM people WHERE user_type = ?";
    user_type = "data-entry";
  } else {
    query = "SELECT * FROM people WHERE user_type = ?";
    user_type = "admin";
  }
  if ((req.body.order = "asc")) {
    query = query + " ORDER BY full_name ASC";
  } else {
    query = query + " ORDER BY full_name DESC";
  }

  await db.query(query, user_type, async (error, result, fields) => {
    if (error) {
      console.log(error);
    } else {
      res.render("admin/admin-people", {
        logged: req.session.admin,
        peoples: result,
      });
    }
  });
});

router.post("/full-request/filter", async (req, res) => {
  var query;

  var accepted;
  if (req.body.filter == "new") {
    query = "SELECT * FROM request WHERE accepted = ?";
    accepted = 0;
  } else if (req.body.filter == "acc") {
    query = "SELECT * FROM request WHERE accepted = ?";
    accepted = 1;
  } else {
    query = "SELECT * FROM request WHERE accepted = ?";
    accepted = -1;
  }
  if ((req.body.order = "asc")) {
    query = query + " ORDER BY request_date ASC";
  } else {
    query = query + " ORDER BY request_date DESC";
  }

  await db.query(query, accepted, async (error, result, fields) => {
    if (error) {
      console.log(error);
    } else {
      res.render("admin/admin-request", {
        logged: req.session.admin,
        requests: result,
        status: "pending",
      });
    }
  });
});

// donation filter
router.get("/full-donation/filter", async (req, res) => {
  res.redirect("/admin/admin-donation.html");
});

router.post("/full-donation/filter", async (req, res) => {
  var query;

  var accepted;
  if (req.body.filter == "negative") {
    query = "SELECT * FROM donation_record WHERE donation_step = ?";
    accepted = [-1];
  } else if (req.body.filter == "positive") {
    query = "SELECT * FROM donation_record WHERE  donation_step = ?";
    accepted = [3];
  } else {
    query =
      "SELECT * FROM donation_record WHERE donation_step = ? OR donation_step = ?";
    accepted = [1, 2];
  }
  if ((req.body.order = "asc")) {
    query = query + " ORDER BY donation_date ASC";
  } else {
    query = query + " ORDER BY donation_date DESC";
  }

  await db.query(query, accepted, async (error, result, fields) => {
    if (error) {
      console.log(error);
    } else {
      res.render("admin/admin-donation", {
        logged: req.session.admin,
        donations: result,
      });
    }
  });
});

router.get("/add-bloodbank.html", async (req, res) => {
  res.render("admin/add-bloodbank", {
    logged: req.session.admin,
  });
});

router.post("/add-bloodbank.html", async (req, res) => {
  var bloodbank = {
    LID: 1,
    branch_name: req.body.name,
    branch_location: req.body.location,
    contact_number: req.body.contact,
  };

  await db.query(
    "INSERT INTO blood_bank SET ? ",
    bloodbank,
    async (error, result, fields) => {
      if (error) {
        console.log(error);
        res.redirect("/");
      } else {
        res.redirect("/admin/admin-bloodbank.html");
      }
    }
  );
});

module.exports = router;

// var isMatch = await bcrypt.compare(password, user.password);
