var express=require("express");
var fileUpload = require('express-fileupload');
var mysql=require("mysql")


var app=express();

app.listen(2004,function(){
    console.log("Server Started...");
})
app.use(express.static("public"));//this will accept your css file changes
app.use(fileUpload());
app.get("/signup",function(req,resp)
  {
        resp.sendFile(process.cwd()+"/public/signup.html");  // we have to mention each and every location of html file that it in public folder file name signup
 })
 //------------------------------------------------------------------------------------------------------------------------------------------
 app.get("/signup-process",function(req,resp){
    // resp.send("Your Data is Safe!")
    resp.send("user email id="+req.query.txtemail+" , user password= "+req.query.txtpwd);
});
//----------------------------------------------------------------------------------------------------------------------------------
app.use(express.urlencoded({ extended: true })); // When data is submitted through an HTML form with the method attribute set to "POST" .

app.post("/signup-process", function(req, resp) {  //
  resp.send("user email id = " + req.body.txtemail + ", user password = " + req.body.txtpwd);
  console.log(req.body);
});
//-------------to work with index.html file by in by default index.html file is directly run by browser itself ----------------------------
app.get("/",function(req,resp)
{
      resp.sendFile(process.cwd()+"/public/index.html");
});
//------------------------------now to perform task safely i need signup securely file---------------------------
app.get("/signup_secure",function(req,resp)
{
       resp.sendFile(process.cwd()+"/public/signup-secure.html");
})
//------process.cwd() is a method that returns the current working directory of the Node.js process
//---------------------------------------------------form method get-----------------------------------------------

// quali1 and quali2  is name of checkbox mtech and btech and its checking condition

app.get("/signup-secure-process", function(req, resp) {
            //  resp.send("welcome");
        var quali = "";
      
        if (req.query.quali1 !== undefined)
          quali += req.query.quali1 + ",";
      
        if (req.query.quali2 !== undefined)
          quali += req.query.quali2;
      
        if (quali === "")
          quali = "No Qualification";

          if(quali.endsWith(","))
          quali=quali.substring(0,quali.length-1) ;


    resp.send("user email id="+req.query.txtEmail+" , user password= "+req.query.txtPwd+ ", Qualification=" + quali + ", Occupation=" + req.query.occu);
  });
//------------------------------------using post method-----------------------------------------------------------
app.use(express.urlencoded({ extended: true }));     
app.post("/signup-secure-process", function(req, resp) {
    //  resp.send("welcome");
var quali = "";

if (req.body.quali1 !== undefined)
  quali += req.body.quali1 + ",";

if (req.body.quali2 !== undefined)
  quali += req.body.quali2;

if (quali === "")
  quali = "No Qualification";

  if(quali.endsWith(","))
  quali=quali.substring(0,quali.length-1); //------this line removes one comma as it ends with two  comma


// resp.send("user email id="+req.body.txtEmail+" , user password= "+req.body.txtPwd+ ", Qualification=" + quali + ", Occupation=" + req.body.occu);
// });
//---------------------------------------------------Uploading pics---------------------------------------------------------------
// var fileuploader=require("express-fileupload");
// app.use(fileuploader());
var fileName="nopic.jpg";
    if(req.files!=null)
      {
         fileName=req.files.ppic.name;
        var path=process.cwd()+"/public/uploads/"+fileName;
        req.files.ppic.mv(path);
      }
      //--------------combobox------------------------------------------------
      var city=req.body.combocity;
      var countries=req.body.listcity.toString();
      
      resp.send("user email id=" + req.body.txtEmail + "<br> user password=" + req.body.txtPwd + "<br> Qualification=" + quali + "<br> Occupation=" + req.body.occu +  "<br>Pic Name=" + fileName + "<br> City=" + city +" <br>Countries="+countries);
       console.log(req.body);
      //  resp.send("Welcome="+req.body.txtEmail+" <br>  "+req.body.txtPwd+"<br> Qualification="+quali+"<br> Pic Name="+fileName+"<br>  City="+city+"<br>  Cities="+cities);
});

//***************************************************************DATABASE CONNECTIVTY************************************************************
app.get("/DB-signup",function(req,resp)
{
      resp.sendFile(process.cwd()+"/public/DB-signup.html");
})

var dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root123',
  database: '2023-nodejs',

}

var dbCon = mysql.createConnection(dbConfig);
dbCon.connect(function(error) {
  if (error == null)
    console.log("Connected Successfully...");
  else
    console.log(error);
});
app.post("/db-signup-secure-process",function(req,resp)
{
  //---------------File Uploading================
  var fileName="nopic.jpg";
  if(req.files!=null)
   {
     //console.log(process.cwd());
      fileName=req.files.ppic.name;
     var path=process.cwd()+"/public/uploads/"+fileName;
     req.files.ppic.mv(path);
   }
    console.log(req.body);
    // resp.send("   File name="+fileName);
  
//*******************************************Store data in Tables MySql****************************************************** */
var email=req.body.txtEmail;
var password=req.body.txtPwd;
var dob=req.body.date;


dbCon.query("insert into users2023(email,password,picname,dob) values(?,?,?,?)",[email,password,fileName,dob],function(err)
    {
      // *note If there is an error during the execution of the query, the err parameter will contain information about the error. If there is no error (err == null), it means the query executed successfully, and a success message is sent as the response to the client using resp.send(). Otherwise, if there is an error, the error message is sent as the response to the client.*/
          if(err==null)
            resp.send("Record Saved Successssfully!");
          else
            resp.send(err);
    })

})
app.post("/db-delete-process",function(req,resp)
{
 //**If affectedRows is 1, it means that one row was affected by the DELETE query, indicating a successful deletion of the account. In this case, it sends a success message as the response to the client. If affectedRows is not 1, it means that no rows were affected, indicating an invalid email ID. In this case, it sends an error message as the response. If there is an error during the execution of the query, the error message is sent as the response to the client. */
    var email=req.body.txtEmail;
    

    dbCon.query("delete from users2023 where email=?",[email],function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)
              resp.send("Account Removed Successssfulllly!");
            else
              resp.send("Inavlid Email id");
            }
              else
            resp.send(err);
    })
})
app.post("/db-update-process", function(req, resp) {
  var email = req.body.txtEmail;
  var password = req.body.txtPwd;

  dbCon.query(
    "UPDATE users2023 SET password = ? WHERE email = ?",
    [password, email],
    function(err, result) {
      if (err == null) {
        if (result.affectedRows == 1) {
          resp.send("Password Updated Successfully!");
        } else {
          resp.send("Invalid Email ID");
        }
      } else {
        resp.send(err);
      }
    }
  );
});

