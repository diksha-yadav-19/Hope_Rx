// var express=require("express");
// var app=express();
// app.listen(2003, function(){
//     console.log("Server Started");
// });
var express= require("express");

var app=express();

app.listen(2003,function(){
    console.log("Server Started");
});

app.get("/hello",function(req,resp)
{
    resp.contentType("text/html");
        resp.write("Hello in the world of programming<br>");
        resp.write("Hi<br>");
        resp.write("Bye<br>");
        resp.end();
       
})