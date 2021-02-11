const session = require("express-session");
const mysql = require("mysql");
const db = require("../../config/db.js");
const getPid = (req, res, next) => {

    phone=req.body.phone;

    db.query(
        "SELECT * FROM people WHERE phone_number=?",phone,
        function (error, result, fields) {
          if (error) {
            console.log(error);
          }
          else if(typeof req.body.name==="undefined" && result.length==0){
            req.session.pid=-1;
            delete req.session.user_exist;
            next();
          }
          else if(result.length==0){
            console.log("not found");
            
            var users={
              full_name: req.body.name,
              blood_group: req.body.blood_type,
              DOB: req.body.dob,
              phone_number: req.body.phone,
              email: req.body.email,
              verified: 0,
              password:"no password",
              gender: req.body.gender,
              user_type: "normal",
            };

            db.query(
              "INSERT INTO people SET ?",
              users,
              function(error,result,fields){
                if(error){
                  console.log(error);
                }
                else
                {
                    console.log("inserted into people=",result);
                    req.session.pid=result.insertId;
                    console.log("req,session.pid=",req.session.pid);
                    next();
                }
              }
            );
          }
          else {
            console.log("getting pid",result);




            console.log("at pid");
            req.session.pid=result[0].PID;
            req.session.user_exist=result;
            next();
            };
          });



};

module.exports = getPid;
