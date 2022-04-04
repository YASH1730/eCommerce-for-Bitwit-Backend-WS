// required libs : mongoose | colors
// run the following command
// npm i mongoose colors

require('dotenv').config();
const colors = require('colors');
const mongoose = require('mongoose')
mongoose.connect(process.env.DataBase_URI , { useNewUrlParser : true, useUnifiedTopology : true})
.then((res)=>console.log('> Connected...'.bgCyan))
.catch(err=>console.log(`> Error while connecting to mongoDB : ${err.message}`.underline.red ))