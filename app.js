const express = require("express");
const port = express();
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");


port.use(express.static("public"));
port.use(bodyParser.urlencoded({extended: true}));


port.get("/", function(req, res){
res.sendFile(__dirname + "/signup.html");
});


port.post("/", function(req, res){
const firstName = req.body.firstName; //req.body.firstName(comes frome name attribute of input tag in html)
const lastName = req.body.lastName;
const email = req.body.email;

var data = {
   members: [
      {
         email_address: email,
         status: "subscribed",
         merge_fields: {
              FNAME: firstName,
              LNAME: lastName
           }
        }
     ]
}


const jsonData = JSON.stringify(data);
const url = "https://us21.api.mailchimp.com/3.0/lists/de9531e5c0";
const options = {
method: "POST",
auth: "vinutha:d305917c3f0d82116256efd79bff47e9-us21"
};

const request = https.request(url, options, function(response){
   if(response.statusCode===200){
      res.sendFile(__dirname + "/success.html");
   }else{
      res.sendFile(__dirname + "/failure.html");
   }
response.on("data", function(data){
console.log(JSON.parse(data));

});
});

request.write(jsonData);
request.end();

});

port.post("/failure", function(req, res){
   res.redirect("/");
})

port.listen(3000, function(req, res){
    console.log("the server is running");
});