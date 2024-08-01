//======================================profile.html==============================================

var express = require("express");
var fileUpload = require("express-fileupload");
var mysql = require("mysql2");
var nodemailer = require('nodemailer');

var app = express();

app.listen(2005, function () {
  console.log("Server Started...");
});

app.use(express.static("public"));
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/profile.html");
});

var dbConfig = {
  host: "localhost",
  user: "root",
  password: "root123",
  database: "profile-form",
  dateStrings: true,
};

var dbCon = mysql.createConnection(dbConfig);
dbCon.connect(function (error) {
  if (error === null) {
    console.log("Connected Successfully...");
  } else {
    console.log(error);
  }
});
// =============================================insertion code=============================================

app.post("/db-profile-process", function (req, resp) {
  var fileName = "nopic.jpg";
  if (req.files != null) {
    fileName = req.files.fpic.name;
    var path = process.cwd() + "/public/uploads/" + fileName;
    req.files.fpic.mv(path);
  }
  console.log(req.body);

  var date = req.body.dob;
  var email = req.body.txtemail;
  var name = req.body.txtname;
  var add = req.body.txtadd;
  var contact = req.body.txtPhone;
  var city = req.body.cities;
  var idproof = req.body.idprf;
  var gend = req.body.gender;
  var start_time = req.body.fromtime;
  var end_time = req.body.totime;
  var avaliablity_hours = start_time + "-" + end_time;

  dbCon.query(
    "INSERT INTO Profileform(emailid, name, contact, address, city, dob, gender, id, picname,avaliablity_hours) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)",
    [
      email,
      name,
      contact,
      add,
      city,
      date,
      gend,
      idproof,
      fileName,
      avaliablity_hours,
    ],
    function (err) {
      if (err) {
        resp.send("Error: " + err.message);
      } else {
        resp.redirect("successful.html");
      }
    }
  );
});
// ===========================delete code======================================
// app.post("/db-delete-process", function (req, resp) {
//   var email = req.body.txtemail;

//   dbCon.query(
//     "DELETE FROM Profileform WHERE emailid = ?",
//     [email],
//     function (err) {
//       if (err) {
//         resp.send("Error: " + err.message);
//       } else {
//         resp.send("Account deleted successfully!");
//       }
//     }
//   );
// });

//==============================update code=====================================================
app.post("/db-update-process", function (req, resp) {
  var fileName = "";
  if (req.files != null) {
    fileName = req.files.fpic.name;
  } else {
    fileName = req.body.hdn;
  }

  console.log(req.body);
  var date = req.body.dob;
  var email = req.body.txtemail;
  var name = req.body.txtname;
  var add = req.body.txtadd;
  var contact = req.body.txtPhone;
  var city = req.body.cities;
  var idproof = req.body.idprf;
  var gend = req.body.gender;
  var start_time = req.body.fromtime;
  var end_time = req.body.totime;
  var avaliablity_hours = start_time + "-" + end_time;

  dbCon.query(
    "UPDATE Profileform SET name=?, contact=?, address=?, city=?, dob=?, gender=?, id=?, picname=?,avaliablity_hours=? WHERE emailid = ?",
    [
      name,
      contact,
      add,
      city,
      date,
      gend,
      idproof,
      fileName,
      avaliablity_hours,
      email,
    ],
    function (err) {
      if (err) {
        resp.send("Error: " + err.message);
      } else {
        resp.redirect("update.html");
      }
    }
  );
});

//=====================================JSon code for reteriving data=================================================================
app.get("/get-json-record", function (req, resp) {
  dbCon.query(
    "SELECT * FROM Profileform WHERE emailid = ?",
    [req.query.Email],
    function (err, resultTableJSON) {
      if (err == null) {
        // console.log(resultTableJSON);
        resp.send(resultTableJSON);
      } else {
        // console.log(err);
        resp.send(err);
      }
    }
  );
});

//------------------------------------------------Index.html file code-----------------------------------------------------------
//---------------------------------------------- Ajax-------------------------------------------------------------------------
// =======================to check wether same email exist in code or not=====================================
app.get("/", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/index.html");
});

app.get("/ajax-check-email", function (req, resp) {
  dbCon.query(
    "select * from users where email=?",
    [req.query.email],
    function (err, resultTable) {
      if (err == null) {
        if (resultTable.length == 1)
          resp.send(" ! This Emailid is already taken");
        else resp.send("Alright this emailid is avaliable");
      } else resp.send(err);
    }
  );
});
//  ===========================================using ajax submit=======================================
app.get("/ajax-check-signup", function (req, resp) {
  dbCon.query(
    "INSERT INTO users(email, pwd, type, dos, status) VALUES (?, ?, ?, current_date(), 1)",
    [req.query.email, req.query.password, req.query.types],
    function (error) {
      if(error==null){
        resp.send("Signed Up Successfully! A confirmation email has been sent to your email address.");
        transporter.sendMail(options,function(err,info){
            if(err){
            console.log(err);
            return;
            }
            else
            console.log("sent:"+info.resp);
        })
        
    }
    else
    resp.send("Error: " + error.message);
})
const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'dikshapup19@gmail.com',
        pass:'uszbybvjvtvynlyb'
    }
    });
    const options={
        from:"dikshapup19@gmail.com",
        to:req.query.email,
        subject:"Your Signup Confirmation",
        text:"Thank you for signing up! You have successfully signed up",
        html:"<h1>Congrats</h1><br><b>You have successfully signed into the website</b>",
        
    }
})

// ========================================login modal form code for reterving using json==================================
app.get("/Json-login-process", function (req, resp) {
  var email = req.query.email;
  var password = req.query.password;
  dbCon.query(
    "select type,status from users where email=? and pwd=?",
    [email, password],
    function (err, resultTable) {
      if (err == null) {
        if (resultTable.length == 1) {
          if (resultTable[0].status == 1) resp.send(resultTable[0].type);
          else resp.send("You are Blocked");
        } else resp.send("Invalid User Id/Password");
      } else {
        resp.send(err.toString());
      }
    }
  );
});
//---------------------------------------------------------------Avail Medicine--------------------------------------------------
app.get("/", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/availmed.html");
});

app.get("/ajax-avail-process", function (req, resp) {
  dbCon.query(
    "INSERT INTO medavail(email, medname, expdate, packging, qty) VALUES (?, ?, ?, ?, ?)",
    [
      req.query.email,
      req.query.medname,
      req.query.expdate,
      req.query.packging,
      req.query.qty,
    ],
    function (err) {
      if (err) {
        resp.send("Error: " + err.message);
      } else {
        resp.send("Avail Medicine Successfully!");
      }
    }
  );
});
// ------------------------------Settings-------------------------------------------------
app.get("/", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/dash-donor.html");
});

app.get("/validate-password", function (req, resp) {
  var oldPassword = req.query.oldpassword;
  var newPassword = req.query.newpassword;
  var confirmPassword = req.query.confirmpassword;
  if (newPassword !== oldPassword) {
    if (newPassword === confirmPassword) {
      dbCon.query(
        "UPDATE users SET pwd = ? WHERE email = ? and pwd=?",
        [newPassword, req.query.email, oldPassword],
        function (err, result) {
          if (err == null) {
            if (result.affectedRows == 0) {
              resp.send("Invalid Password");
            } else {
              resp.send("Password Update Successfully!");
            }
          } else resp.send("Error: " + err.message);
        }
      );
    } else {
      resp.send("Confirm Password should be same as new password");
    }
  } else {
    resp.send("New password should not be same as old password");
  }
});

//=========================================needyprofile=============================================================

app.get("/", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/needyprofile.html");
});

app.post("/db-profile-needy", function (req, resp) {
  var fileName = "nopic.jpg";
  if (req.files != null) {
    fileName = req.files.fpic.name;
    var path = process.cwd() + "/public/uploads/" + fileName;
    req.files.fpic.mv(path);
  }
  console.log(req.body);

  var date = req.body.dob;
  var email = req.body.txtemail;
  var name = req.body.txtname;
  var add = req.body.txtadd;
  var contact = req.body.txtPhone;
  var city = req.body.cities;
  var gend = req.body.gender;

  dbCon.query(
    "INSERT INTO needyuser(emailid, name, contact, address, city, dob, gender, picname) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [email, name, contact, add, city, date, gend, fileName],
    function (err) {
      if (err) {
        resp.send("Error: " + err.message);
      } else {
        resp.redirect("successful.html");
      }
    }
  );
});

app.post("/db-update-needy", function (req, resp) {
  var fileName = "";
  if (req.files != null) {
    fileName = req.files.fpic.name;
  } else {
    fileName = req.body.hdn;
  }

  console.log(req.body);
  var date = req.body.dob;
  var email = req.body.txtemail;
  var name = req.body.txtname;
  var add = req.body.txtadd;
  var contact = req.body.txtPhone;
  var city = req.body.cities;
  var gend = req.body.gender;

  dbCon.query(
    "UPDATE needyuser SET name=?, contact=?, address=?, city=?, dob=?, gender=?, picname=? WHERE emailid = ?",
    [name, contact, add, city, date, gend, fileName, email],
    function (err) {
      if (err) {
        resp.send("Error: " + err.message);
      } else {
        resp.redirect("update.html");
      }
    }
  );
});
//========================================================================================

app.get("/get-needy-record", function (req, resp) {
  dbCon.query(
    "SELECT * FROM needyuser WHERE emailid = ?",
    [req.query.Email],
    function (err, resultTableJSON) {
      if (err == null) {
        resp.send(resultTableJSON);
      } else {
        resp.send(err);
      }
    }
  );
});

// ===================================================================Admin Panel
// ------------------------fetch records of user---------------------------------
app.get("/", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/usersrecords.html");
});

app.get("/get-angular-all-records", function (req, resp) {
  dbCon.query("select * from users", function (err, resultTableJSON) {
    if (err == null) resp.send(resultTableJSON);
    else resp.send(err);
  });
});

app.get("/do-angular-block", function (req, resp) {
  var email = req.query.emailkuch;
  var status = 0;
  dbCon.query(
    "update users set status = ? where email = ?",
    [status, email],
    function (err, result) {
      if (err == null) {
        resp.send("User blocked successfully");
      } else {
        resp.send(err);
      }
    }
  );
});

app.get("/do-angular-resume", function (req, resp) {
  var email = req.query.emailkuch;
  var status = 1;
  dbCon.query(
    "update users set status = ? where email = ?",
    [status, email],
    function (err, result) {
      if (err == null) {
        resp.send("User resumed successfully");
      } else {
        resp.send(err);
      }
    }
  );
});
// ===============================================
app.get("/", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/paneldonor.html");
});

app.get("/get-angular-donor-records", function (req, resp) {
  dbCon.query("select * from Profileform", function (err, resultTableJSON) {
    if (err == null) resp.send(resultTableJSON);
    else resp.send(err);
  });
});
// ==========================================================
app.get("/", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/panelneedy.html");
});

app.get("/get-angular-needy-records", function (req, resp) {
  dbCon.query("select * from needyuser", function (err, resultTableJSON) {
    if (err == null) resp.send(resultTableJSON);
    else resp.send(err);
  });
});
//------------------------------------------------------------------------------------------
app.get("/", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/dash-needy.html");
});

app.get("/validate-password", function (req, resp) {
  var oldPassword = req.query.oldpassword;
  var newPassword = req.query.newpassword;
  var confirmPassword = req.query.confirmpassword;
  if (newPassword !== oldPassword) {
    if (newPassword === confirmPassword) {
      dbCon.query(
        "UPDATE users SET pwd = ? WHERE email = ? and pwd=?",
        [newPassword, req.query.email, oldPassword],
        function (err, result) {
          if (err == null) {
            if (result.affectedRows == 0) {
              resp.send("Invalid Password");
            } else {
              resp.send("Password Update Successfully!");
            }
          } else resp.send("Error: " + err.message);
        }
      );
    } else {
      resp.send("Confirm Password should be same as new password");
    }
  } else {
    resp.send("New password should not be same as old password");
  }
});
//=======================================================
app.get("/", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/med-manager.html");
});

app.get("/get-angular-records", function (req, resp) {
  var email = req.query.email;
  dbCon.query("SELECT * FROM medavail WHERE email=?", [email], function (err, resultTableJSON) {
    if (err == null) {
      resp.send(resultTableJSON);
    } else {
      resp.send(err);
    }
  });
});


app.get("/do-angular-delete", function (req, resp) {
  var srno = req.query.srno;
  dbCon.query("DELETE FROM medavail WHERE srno=?", [srno], function (err, result) {
    if (err == null) {
      if (result.affectedRows == 1) {
        resp.send("Record Removed Successfully!!");
      } else {
        resp.send("Invalid srno");
      }
    } else {
      resp.send(err);
    }
  });
});
//===========================================================================
app.get("/", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/finder-med.html");
});

app.get("/get-cities", function (req, resp) {
  dbCon.query("select distinct city from Profileform", function (err, resultTableJSON) {
    if (err == null) {
      resp.send(resultTableJSON);
    } else {
      resp.send(err);
    }
  });
});

app.get("/get-medicines", function (req, resp) {
  dbCon.query("select distinct medname from medavail", function (err, resultTableJSON) {
    if (err == null) {
      resp.send(resultTableJSON);
    } else {
      resp.send(err);
    }
  });
});
app.get("/fetch-donors",function(req,resp)
{
  console.log(req.query);
  var med=req.query.medKuch;
  var city=req.query.cityKuch;

  var query="select Profileform.name,Profileform.address,Profileform.city,Profileform.gender,Profileform.avaliablity_hours,Profileform.contact,Profileform.emailid,Profileform.picname,Profileform.dob,medavail.medname from Profileform inner join medavail on Profileform.emailid= medavail.email where medavail.medname=? and Profileform.city=?";
  

  dbCon.query(query,[med,city],function(err,resultTable)
  {
    console.log(resultTable+"      "+err);
  if(err==null)
    resp.send(resultTable);
  else
    resp.send(err);
  })
})
//to start localhost run command npx nodemon server3.js
