require("dotenv").config();
const express = require('express');
const app = express();
const port = 3000;
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

client.setConfig({
    apiKey: process.env.API_KEY,
    server: process.env.SERVER_ZONE,
  });

app.post("/", function(req, res){
    const suscriber = {
        name: req.body.fName,
        lastName: req.body.lName,
        email: req.body.email,
    };

    const run = async () => {
        try{
            const response = await client.lists.addListMember(process.env.AUDIENCE_ID, {
            email_address: suscriber.email,
            status: "subscribed",
            merge_fields: {
                FNAME: suscriber.name,
                LNAME: suscriber.lastName
            }
            });
            console.log(response.status);
            res.sendFile(__dirname + "/success.html");
        } catch(error){
            res.sendFile(__dirname + "/failure.html");
        }
    };

    run();
 
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.listen(port, () => {console.log(`Server is running on port: ${port}!`)});