const express = require("express");
const fs = require("file-system");
const bodyParser = require("body-parser");
let hospitalList = require("./hospital.json");
let patientList = require("./patient.json");

let app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,x-access-token, Content-Type, Accept");
    next();
  });

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json({type:"application/json"}));

app.get("/api/hospitals", (req, res, next)=>{
    res
    .status(200)
    .send({
        auth: true,
        response: hospitalList
    });
});

app.post("/api/hospital", function (req, res, next){
    let body =  req.body;
    let inPatients =  [];
    let outPatients =  [];
    console.log(body);
    patientList.find((element)=>{
        if(element.hospitalName == body.name){
            if(element.left === false){
                inPatients.push(element);
            }else if(element.left === true){
                outPatients.push(element);
            }
        }
    });
    res
    .status(200)
    .send({
        auth: true,
        response:{
            "inPatients": inPatients,
            "outPatients": outPatients
        }
    })
});

app.post("/api/addPatient", (req, res, next)=>{
    let body = req.body;
    body.left = false;
    patientList.push(body);
    console.log(patientList.length);
    fs.writeFileSync("patient.json", JSON.stringify(patientList));
    res
    .status(200)
    .send({
        auth: true,
        message: "File uploaded succesfully"
    });
});

app.post("/api/editPatient", (req, res, next)=>{
    let body = req.body;
    patientList.find((element)=>{
        if(element.name == body.body.name){
            element.left = body.body.left;
            element.outDate = body.body.outDate;
        }
    });
    fs.writeFile("patient.json", JSON.stringify(patientList), (err)=>{
        if(err){
            console.log("Error while editing JSON file", err);
        }
        console.log("Changes saved");
    });
    res
    .status(200)
    .send({
        auth: true,
        message: "Patient's details edited successfully"
    });
});

const PORT = "2000";

app.listen(PORT, (error, data)=>{
    if(!error){
        console.log("Server running on port", PORT);
    }
});