const express = require("express");
const mysql = require("mysql");
const app = express();
const ejs = require("ejs");
const session = require("express-session");
const db = require("./config/db.js");
const PORT = process.env.PORT;
const http = require("http");
const bodyParser = require("body-parser");

const checkIfLogged = require("./routes/middleware/checkIfLogged.js");
const checkIfAdmin = require("./routes/middleware/checkIfAdmin.js");
const checkIfdataEntry = require("./routes/middleware/checkIfdataEntry");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json({ extended: false }));
const server = http.createServer(app);

app.use(
  session({
    secret: "2C44-4D44-WppQ38S",
    resave: true,
    saveUninitialized: true,
  })
);

//render home.ejs with passing a variable
app.get("/", async (req, res) => {
  flag = 0;
  if (typeof req.session.success === "undefined" || req.session.success == 0)
    flag = 0;
  else flag = 1;
  req.session.success = 0;

  res.render("index", { logged: req.session.admin, flag: flag });
});

// get data-entry
app.get("/data-entry", [checkIfLogged, checkIfdataEntry], async (req, res) => {
  res.render("forms/index", { logged: req.session.admin });
});

// registration step 1
app.get(
  "/registeration-step1.html",
  [checkIfLogged, checkIfdataEntry],
  async (req, res) => {
    var user = req.session.user_exist;
    var p = 0;
    if (typeof user === "undefined") p = 1;
    if (p)
      res.render("forms/registeration-step1", {
        logged: req.session.admin,
        full_name: "",
        email: "",
        phone_number: "",
        blood_group: " ",
        gender: " ",
        dob: " ",
      });
    else
      res.render("forms/registeration-step1", {
        logged: req.session.admin,
        full_name: user[0].full_name,
        email: user[0].email,
        phone_number: user[0].phone_number,
        blood_group: user[0].blood_group,
        gender: user[0].gender,
        dob: user[0].DOB,
      });
  }
);

// registration step 2
app.get(
  "/pretest-step2.html",
  [checkIfLogged, checkIfdataEntry],
  async (req, res) => {
    var p = " ";
    var user = req.session.user_exist;
    if (typeof user === "undefined") p = " ";
    else p = user[0].blood_group;
    res.render("forms/pretest-step2", {
      logged: req.session.admin,
      full_name: "",
      email: "",
      phone_number: "",
      blood_group: p,
      gender: " ",
      dob: " ",
    });
  }
);

// donation step 3
app.get(
  "/donation-step3.html",
  [checkIfLogged, checkIfdataEntry],
  async (req, res) => {
    res.render("forms/donation-step3", {
      logged: req.session.admin,
    });
  }
);

// get
app.get("/index.html", async (req, res) => {
  flag = 0;
  if (typeof req.session.success === "undefined" || req.session.success == 0)
    flag = 0;
  else flag = 1;
  req.session.success = 0;
  res.render("index", { logged: req.session.admin, flag: flag });
});

app.get("/about.html", async (req, res) => {
  res.render("about", { logged: req.session.admin });
});

app.get("/forms/profile.html", checkIfLogged, async (req, res) => {
  console.log(req.session);
  await db.query(
    "SELECT * FROM request WHERE PID = ?",
    req.session.user,
    async (error, result, fields) => {
      if (error) {
        console.log(error);
        res.redirect("/");
      } else {
        var requests = result;
        await db.query(
          "SELECT * FROM donation_record WHERE PID = ?",
          req.session.user,
          async (error, result, fields) => {
            if (error) {
              console.log(error);
              res.redirect("/");
            } else {
              var donation = result;
              res.render("forms/profile", {
                logged: req.session.admin,
                info: req.session,
                requests: requests,
                donations: donation,
              });
            }
          }
        );
      }
    }
  );
});

app.get("/blog.html", async (req, res) => {
  res.render("blog", { logged: req.session.admin });
});

app.get("/blog_details.html", async (req, res) => {
  res.render("blog_details", { logged: req.session.admin });
});

app.get("/donate_now.html", checkIfLogged, async (req, res) => {
  res.render("donate_now", {
      logged: req.session.admin,
      info: req.session, 
  });
});

app.get("/services.html", checkIfLogged, async (req, res) => {
  res.render("services", { logged: req.session.admin });
});

app.get("/contact.html", async (req, res) => {
  res.render("contact", { logged: req.session.admin });
});

app.get("/request_now.html", checkIfLogged, async (req, res) => {
  res.render("request_now", { logged: req.session.admin });
});

// long code admin/index
app.get(
  "/admin/index_admin.html",
  [checkIfLogged, checkIfAdmin],
  async (req, res) => {
    await db.query(
      "SELECT accepted , COUNT(REID) AS reqs FROM request GROUP BY accepted",
      async (error, result, fields) => {
        if (error) {
          console.log(error);
        } else {
          req.session.reqcount = result;

          await db.query(
            "SELECT user_type , COUNT(PID) AS reqs FROM people GROUP BY user_type",
            async (errors, results, field) => {
              if (errors) {
                console.log(error);
              } else {
                req.session.peoplecount = results;
                var datetime = new Date();
                var date = datetime.toISOString().slice(0, 10);

                await db.query(
                  "SELECT COUNT(BDCID) AS reqs FROM blood_donation_camp WHERE camp_end < ?",
                  datetime,
                  async (error, result, field) => {
                    if (error) {
                      console.log(error);
                    } else {
                      req.session.ended = result;
                      await db.query(
                        "SELECT COUNT(BDCID) AS reqs FROM blood_donation_camp WHERE camp_start > ?",
                        datetime,
                        async (error, result, fields) => {
                          if (error) {
                            console.log(error);
                          } else {
                            req.session.Upcoming = result;
                            await db.query(
                              "SELECT COUNT(BDCID) AS reqs FROM blood_donation_camp WHERE camp_start < ? AND camp_end > ?",
                              [datetime, datetime],
                              async (error, results, fields) => {
                                if (error) {
                                  console.log(error);
                                } else {
                                  req.session.ongoing = results;

                                  res.render("admin/index_admin", {
                                    logged: req.session.admin,
                                    reqcount: req.session.reqcount,
                                    peoplecount: req.session.peoplecount,
                                    ended: req.session.ended,
                                    Upcoming: req.session.Upcoming,
                                    ongoing: req.session.ongoing,
                                  });
                                }
                              }
                            );
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  }
);

// admin/admin-people.html
app.get(
  "/admin/admin-people.html",
  [checkIfLogged, checkIfAdmin],
  async (req, res) => {
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
  }
);

// admin - request
app.get(
  "/admin/admin-request.html",
  [checkIfLogged, checkIfAdmin],
  async (req, res) => {
    await db.query(
      "SELECT REID,full_name, request.blood_group, quantity , request_date,accepted FROM people , request WHERE people.PID = request.PID",
      function (error, result, fields) {
        if (error) {
          console.log(error);
        } else {
          var requests = result;

          res.render("admin/admin-request", {
            logged: req.session.admin,
            requests: result,
            status: "pending",
          });
        }
      }
    );
  }
);

// app.get("/admin/full-camps/filter", async (req, res) => {
//   res.redirect("/admin/admin-camps.html");
// });

// app.post("/admin/full-camps/filter", async (req, res) => {
//   var query;
//   var datetime = new Date();
//   var date = datetime.toISOString().slice(0, 10);

//   if (req.body.filter == "Upcoming") {
//     query = "SELECT * FROM blood_donation_camp WHERE camp_start > ?";
//   } else if (req.body.filter == "ongoing") {
//     query =
//       "SELECT * FROM blood_donation_camp WHERE camp_start > ? AND camp_end < ?";
//   } else {
//     query = "SELECT * FROM blood_donation_camp WHERE camp_end < ?";
//   }
//   if ((req.body.order = "asc")) {
//     query = query + " ORDER BY camp_start ASC";
//   } else {
//     query = query + " ORDER BY camp_start DESC";
//   }

//   await db.query(query, [date, date], async (error, result, fields) => {
//     if (error) {
//       console.log(error);
//     } else {
//       res.render("admin/admin-camps", {
//         logged: req.session.admin,
//         camps: result,
//       });
//     }
//   });
// });

app.get(
  "/admin/admin-camps.html",
  [checkIfLogged, checkIfAdmin],
  async (req, res) => {
    await db.query(
      "SELECT * FROM blood_donation_camp",
      function (error, result, fields) {
        if (error) {
          console.log(error);
        } else {
          res.render("admin/admin-camps", {
            logged: req.session.admin,
            camps: result,
          });
        }
      }
    );
  }
);

app.get(
  "/admin/full-camps.html/:id",
  [checkIfLogged, checkIfAdmin],
  async (req, res) => {
    await db.query(
      "SELECT * FROM blood_donation_camp WHERE BDCID = ?",
      req.params.id,
      function (error, result, fields) {
        if (error) {
          console.log(error);
        } else {
          res.render("admin/full-camps", { request: result });
        }
      }
    );
  }
);

app.get(
  "/admin/add-camp.html",
  [checkIfLogged, checkIfAdmin],
  async (req, res) => {
    res.render("admin/add-camp", { logged: req.session.admin });
  }
);

app.get(
  "/admin/full-people.html/:id",
  [checkIfLogged, checkIfAdmin],
  async (req, res) => {
    var pid = req.params["id"];
    await db.query(
      `SELECT people.*, height, weight, next_donation_date, previous_sms_date,
      CASE
        WHEN donor.PID IS NULL THEN false
        ELSE true
      END AS isdonor
      FROM people
      LEFT JOIN donor ON people.PID=donor.PID
      WHERE people.PID=?`,
      pid,
      function (error, result, fields) {
        if (error) {
          console.log(error);
        } else {
          var peoples = result;

          res.render("admin/full-people", {
            logged: req.session.admin,
            peoples: result,
          });
        }
      }
    );
  }
);

app.get(
  "/admin/add-people.html",
  [checkIfLogged, checkIfAdmin],
  async (req, res) => {
    res.render("admin/add-people", { logged: req.session.admin });
  }
);

// app.get("/admin/showrequest", async (req, res) => {
//   res.redirect("/showrequest/");
// });
app.get("/showrequest/:id", [checkIfLogged, checkIfAdmin], async (req, res) => {
  {
    await db.query(
      "SELECT * FROM request WHERE REID = ?",
      req.params.id,
      function (error, result, fields) {
        if (error) {
          console.log(error);
        } else {
            console.log(result);
          res.render("admin/full-request", { request: result });
        }
      }
    );
  }
});

app.get(
  "/admin/received-record.html/:id",
  [checkIfLogged, checkIfAdmin],
  async (req, res) => {
    await db.query(
      "SELECT * FROM received_record WHERE REID=?",
      req.params["id"],
      async (error, result, fields) => {
        if (error) {
          console.log(error);
          res.redirect("/admin/index_admin.html");
        } else {
          res.render("admin/received-record", {
            logged: req.session.admin,
            record: result,
            REID:req.params["id"],
          });
        }
      }
    );
  }
);

app.get(
  "/showdonation/:id",
  [checkIfLogged, checkIfAdmin],
  async (req, res) => {
    {
      await db.query(
        "SELECT * FROM donation_record, people WHERE donation_record.DID = ? AND donation_record.PID = people.PID",
        req.params["id"],
        function (error, result, fields) {
          if (error) {
            console.log(error);
          } else if(result.length==0)  {
            res.redirect("/admin/admin-donation.html");
          }
          else{

            console.log(result);
            res.render("admin/full-donation", {
              logged:req.session.admin,
               donation: result,
            DID:req.params["id"] ,});
          }
        }
      );
    }
  }
);

app.get(
  "/admin/admin-donation.html",
  [checkIfLogged, checkIfAdmin],
  async (req, res) => {
    await db.query(
      `SELECT DID, don_rec.PID, full_name, don_rec.BDCID, don_rec.BLID, donation_date, blood_type,
      CASE
        WHEN don_rec.BDCID IS NULL THEN branch_name
        ELSE camp_name
      END AS branch_camp_name
      FROM (SELECT DID, PID, BDCID, BLID, donation_date, blood_type FROM donation_record LIMIT ?, 50) AS don_rec
      INNER JOIN people ON don_rec.PID=people.PID
      LEFT JOIN blood_donation_camp ON don_rec.BDCID=blood_donation_camp.BDCID
      LEFT JOIN blood_bank ON don_rec.BLID=blood_bank.BLID`,
      (0*50),
      function (error, result, fields) {
        if (error) {
          console.log(error);
        } else {
          res.render("admin/admin-donation", {
            logged: req.session.admin,
            donations: result,
          });
        }
      }
    );
  }
);

app.get(
  "/admin-donation.html/:id",
  [checkIfLogged, checkIfAdmin],
  async (req, res) => {
    await db.query(
      "SELECT * FROM donation_record,people WHERE donation_record.BDCID=? AND donation_record.PID=people.PID",
      req.params["id"],
      function (error, result, fields) {
        if (error) {
          console.log(error);
        } else {
          res.render("admin/admin-donation", {
            logged: req.session.admin,
            donations: result,
          });
        }
      }
    );
  }
);

app.get(
  "/admin/admin-bloodbank.html",
  [checkIfLogged, checkIfAdmin],
  async (req, res) => {
    await db.query(
      "SELECT * FROM blood_bank",
      async (error, result, fields) => {
        if (error) {
          console.log(error);
          res.redirect("/");
        } else {
          res.render("admin/admin-bloodbank", {
            logged: req.session.admin,
            banks: result,
          });
        }
      }
    );
  }
);

app.get(
  "/admin/add-bloodbank.html",
  [checkIfLogged, checkIfAdmin],
  async (req, res) => {
    res.render("admin/add-bloodbank", { logged: req.session.admin });
  }
);

app.get(
  "/admin/admin-bloodbag.html",
  [checkIfLogged, checkIfAdmin],
  async (req, res) => {
    res.render("admin/admin-bloodbag", { logged: req.session.admin });
  }
);

app.get(
  "/admin/full-bloodbag.html/:id",
  [checkIfLogged, checkIfAdmin],
  async (req, res) => {
    await db.query(
      "SELECT * FROM blood_bag,donation_record,people WHERE  blood_bag.BBID=? AND blood_bag.BBID=donation_record.BBID AND people.PID=donation_record.PID",
      req.params["id"],
      async (error, result, fields) => {
        if (error) {
          console.log(error);
          res.redirect("/");
        } else {
          console.log(result);
          res.render("admin/full-bloodbag", {
            logged: req.session.admin,
            blood_bag: result,
          });
        }
      }
    );
  }
);

app.get(
  "/admin/admin-bloodbag.html/:id",
  [checkIfLogged, checkIfAdmin],
  async (req, res) => {
    await db.query(
      "SELECT * FROM blood_bag,donation_record WHERE  blood_bag.BLID=? AND blood_bag.BBID=donation_record.BBID",
      req.params["id"],
      async (error, result, fields) => {
        if (error) {
          console.log(error);
          res.redirect("/");
        } else {
          res.render("admin/admin-bloodbag", {
            logged: req.session.admin,
            blood_bag: result,
          });
        }
      }
    );
  }
);

/* all links redirected from filter */

/* end --------------------- */

app.use("/user", require("./routes/user"));

app.use("/request", require("./routes/request"));

app.use("/donate", require("./routes/donate"));

app.use("/admin", require("./routes/admin"));

app.use("/edit", require("./routes/edit"));

server.listen(3000 || PORT, function (req, res) {
  console.log("Running on Server");
});

//git push -u -f origin master
