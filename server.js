const express = require('express');
const app = express();
// const port = process.env.PORT || 0; // for dynemically chaging the port
const port = process.env.PORT || 8000; 
const bodyParser = require('body-parser')
const path = require('path')
const mongo = require('./database/dbConfig');
const cors = require('cors')

// midilwear to parse the body 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors())

// public path
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', './src/public');

//set up the view engine 
app.set('view engine','pug')
app.set('views','views')


// set uploads as static

app.use('/upload',express.static(path.join(__dirname, 'upload')));

// requiring the routes
app.use('/api/',require('./server/routes'))

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });

app.listen(port,()=>{
        console.log('Server is running at port',port);
        // console.log(app.address());
    })
