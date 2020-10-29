//* brings in the Express module from the npm install express --save
const express = require('express');
//* path module when used to call a sendFile callback
const path = require('path');
let app = express();
//* adding filesystem which writes out a file when a request comes in
const fs = require('fs');
const bodyParser = require('body-parser');
writePath = path.join(__dirname, "../formsubmissions.json");
//* HARD WAY IS NOT SCALABLE IF YOU WILL HAVE A LOT OF FILES! ROUTING NIGHTMARE!
//* HARD WAY responds to the HTTP GET method request at the root level into a callback function 
//app.get('/', (req, res) => {
//    //* sends the requester (browser in this case) an HTML file from the specified path from dirname root folder
//    res.sendFile(path.join(__dirname, '../public/index.html'));
//});
//
//* add another get route for styles.css the HARD WAY
//app.get('/css/styles.css', (req, res) => {
//    res.sendFile(path.join(__dirname, '/public/css/styles.css'));
//});

//* serves up any file in the public file when available the EASY WAY
//* express static must be on top of use or get middleware
app.use(express.static(path.join(__dirname, '../public')));


//* express runs middleware things in order you want to pass them
//* add this before static if you want this get middleware to run first in order

//* Create your own middleware using app.use that console.logs every req.url and passes flow to the next function
//* creating a special middleware logger
app.use((req, res, next) => {
    console.log(req.originalUrl);
    next();
})

//* runs this handler and then does not pass the next handler on 
//* Create an express server that responds to the root get request ('/') with "Hello from the web server side..."
app.get('/', (req, res) => {
    res.send('Hello from the web server side...'); //responds with ID itself
}); 


//* creating a static middleware to respond to other types of routes not just root
//* middleware displaying the id input of the route /order/... of the localhost:3000
//* this is a route parameter middleware where it listens to a specific route request
app.get('/order/:id', (req, res) => {
    let id = req.params.id;
    res.send(id); //responds with ID itself
});

//app.use((req, res, next) => {
//    fs.appendFileSync('log.txt', `${req.url}/n`)
//    next();
//});

//* uses express to take urlencoded body payloads using the bodyparser which takes form post data and transforms it into object that is available on request.body in the route handler
app.use(bodyParser.urlencoded({extended: false}));
//* this is the route handler that  app.use(bodyParser.urlencoded({extended: false})); transforms data to objects 
//* in HTML make these changes
//* <form action="/formsubmissions" method="POST">
//* add the necessary variable to be used by req.body in the <input name="">
//* this handler collects the signed-up form submission from the HTML file
app.post('/formsubmissions', (req, res) => {
    console.log(req.body.firstName);
    console.log(req.body.lastName);
    console.log(req.body.email);
    let outputArr = [];
    let signedupMember = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    };
    outputArr.push(signedupMember);
    const jsonData = JSON.stringify(outputArr);
    fs.writeFile(writePath, jsonData, (err)=> {
        console.log(err);
    });
    fs.readFile('./formsubmissions.json', "utf8", (err, json) => {
        if (err) {
            console.log(err)
        } else {
            const data = JSON.parse(json);
            data.push(signedupMember);
            console.log(outputArr);
        }
    });
    res.send(`Hello from the web server side... Thank you for signing up the dummy labs page ^^`);
});

//* turns server ON by listening in on a specific port: 3000
//* 480 for http and 443 for https
//* local host is a loopback IP which allows browser to hit the local server which is pc
//* localhost:3000 in google chrome sends a request to the server and  server.js sends a response back 
app.listen(3000);