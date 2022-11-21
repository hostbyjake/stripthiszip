
// importing the dependencies
var spawn = require("child_process").spawn,child;


// const { exec } = require('child_process');
// exec('Write-Output "HII" ', {'shell':'powershell.exe'}, (error, stdout, stderr)=> {
//     // do whatever with stdout
//     console.log(stdout)
// })

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { json } = require("body-parser");

const serviceAccount = require('./firebasekey.json')
const fs = require('fs');
const { getClientBuildManifest } = require("next/dist/client/route-loader");
// fs.initializeApp({
  // credential: fs.credential.cert(serviceAccount)
// })
// 

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');

const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();


// defining the Express app
const app = express();
// defining an array to work as the database (temporary solution)
const ads = [
  {title: 'Back-End Server'}
];

// adding Helmet to enhance your Rest API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// defining an endpoint to return all ads
app.get('/', (req, res) => {
  res.send(ads);
});


app.post('/generate-variables', (req, res) => {
  const jsonData = req.body
  var jsonContent = JSON.stringify(jsonData);

  
fs.writeFile("output.json", jsonContent, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
 
    console.log("JSON file has been saved.");
});



  // // console.log(jsonContent)
  res.send(jsonData);
});


  

app.get('/download-template', (req, res) => {
 const file = './workflowSwitch.json';
 res.download(file); // Set disposition and send it.

})



app.get('/make-json', (req, res) => {
child = spawn("powershell.exe",["c:\\Users\\jjones\\xDev\\stripthiszip\\backend\\switchcasejson.ps1"]);
child.stdout.on("data",function(data){
    console.log("Powershell Data: " + data);
});
child.stderr.on("data",function(data){
    console.log("Powershell Errors: " + data);
});
child.on("exit",function(){
    console.log("Powershell Script finished");
});
child.stdin.end(); //end input

})

const getClients = async () => {
   const clients = await db.collection('accountDetails').get()
   console.log(clients)
   return clients
  }


app.get('/get-clients', (req, res) => {
  const getClients = async () => {
 const snapshot = await db.collection('accountDetails').get();
snapshot.forEach((doc) => {
  console.log(doc.id, '=>', doc.data());
});
  }
 console.log(getClients())
  res.send(getClients())
 
 })
 


// starting the server
app.listen(5000, () => {
  console.log('listening on port 5000');
});


