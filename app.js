const express = require("express");
const port = express();
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
require("dotenv").config();

const MAPI_KEY = process.env.API_KEY

const MLIST_ID = process.env.LIST_ID

const MAPI_SERVER = process.env.API_SERVER


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
const url = "https://" + MAPI_SERVER + ".api.mailchimp.com/3.0/lists/" + MLIST_ID;
const options = {
method: "POST",
auth: "vinutha:MAPI_KEY"
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
