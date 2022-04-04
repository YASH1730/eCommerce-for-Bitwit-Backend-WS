const express = require('express');
const app = express();
const port = process.env.PORT || 80;
const bodyparser = require('body-parser')
const path = require('path')
const mongo = require('./database/dbConfig');

// midilwear to parse the body 
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}));

// public path
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', './src/public');

//set up the view engine 
app.set('view engine','pug')
app.set('views','views')

// requiring the routes
app.use(require('./server/routes'))

app.listen(port,()=>{
    console.log('Server is running at port 80');
})