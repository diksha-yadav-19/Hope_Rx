
//----------using Ajax we are interacting client and server whether its input email is already exist in our databse or not-----------------
//-------------Asynchronous JavaScript and XML

$(document).ready(function () {
    $("#txtemail").blur(function () {
        var anyemail = $("#txtemail").val();
        var obj = {
            type: "get",
            url: "/ajax-check-email",
            data: {
                email: anyemail
            }

        }
        $.ajax(obj).done(function (respKuch) {
            // alert(respKuch);
            $("#res").html(respKuch);
        }).fail(function (errKuch) {
            // alert(errKuch)
            $("#res").html(errKuch);
        })

    });

    $(document).ajaxStart(function () {
        $("#wait").css("display", "block");
    });

    $(document).ajaxStop(function () {
        $("#wait").css("display", "none");
    });

    $("#txtemail").blur(function() {
      var r = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
      var email = $("#txtemail").val();
      if (r.test(email) === true) {
          $("#error1").html("Alright! This email id is valid");
          $("#error1").addClass("good").removeClass("bad");
      } else {
          $("#error1").html("* Invalid Email").addClass("bad").removeClass("good");
      }
  });
  
  $("#txtpwd").blur(function() {
      var r = /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
      var pwd = $("#txtpwd").val();
      if (r.test(pwd) === true) {
          $("#error2").html("Alright! This password id is valid");
          $("#error2").addClass("good").removeClass("bad");
      } else {
          $("#error2").html("* Invalid Password").addClass("bad").removeClass("good");
      }
  });
  
  $("#btn3").click(function() {
      var email = $("#txtemail").val();
      var pwd = $("#txtpwd").val();
  
      // Check if both email and password are valid
      var emailValid = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email);
      var pwdValid = /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(pwd);
  
      if (emailValid && pwdValid) {
          var typecombo = $("#combo").val();
          var obj = {
              type: "GET",
              url: "/ajax-check-signup",
              data: {
                  email: email,
                  password: pwd,
                  types: typecombo
              },
          };
  
          $.ajax(obj)
              .done(function(respKuch) {
                  // alert(respKuch);
                  $("#respsub").html(respKuch);
              })
              .fail(function(errKuch) {
                  alert(errKuch);
                  // $("#respsub").html(respKuch);
              });
      } else {
          alert("Please enter a valid email and password.");
      }
  });
});  

//=========================================Login Form=============================

$(document).ready(function () {
  $("#loginemail").blur(function() {
    var r = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    var email = $("#loginemail").val();
    if (r.test(email) === true) {
        $("#email-error").html("Alright! This email id is valid");
        $("#email-error").addClass("good").removeClass("bad");
    } else {
        $("#email-error").html("* Invalid Email").addClass("bad").removeClass("good");
    }
  });
  
  $("#loginpwd").blur(function() {
    var r = /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
    var pwd = $("#loginpwd").val();
    if (r.test(pwd) === true) {
        $("#password-error").html("Alright! This password id is valid");
        $("#password-error").addClass("good").removeClass("bad");
    } else {
        $("#password-error").html("* Invalid Password").addClass("bad").removeClass("good");
    }
  });
  
  $("#login").click(function() {
    var email = $("#loginemail").val();
    var pwd = $("#loginpwd").val();
  
    // Check if both email and password are valid
    var emailValid = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email);
    var pwdValid = /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(pwd);
  
    if (emailValid && pwdValid) {
        var obj = {
            type: "GET",
            url: "/Json-login-process",
            data: {
                email: email,
                password: pwd,
            },
        };
        $.ajax(obj).done(function(resp)
          {
            localStorage.setItem("active",email)
            if(resp=="Donor")
              location.href="dash-donor.html";
            else
            if(resp=="Needy")
              location.href="dash-needy.html";
              else
            alert(resp);
        
          }).fail(function(err){
           // $("#resplogin").html(err);
           alert(err);
          })
       
    } else {
        alert("Please enter a valid email and password.");
    }
  });
  })