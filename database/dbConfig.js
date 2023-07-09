// required libs : mongoose | colors
// run the following command
// npm i mongoose colors

require('dotenv').config();
const colors = require('colors');
const mongoose = require('mongoose')
mongoose.connect(process.env.DataBase_URI , { useNewUrlParser : true, useUnifiedTopology : true})
.then((res)=>{
    
    console.log('> Connected...'.bgCyan)})
.catch(err=>console.log(`> Error while connecting to mongoDB : ${err.message}`.underline.red ))


/////////// Do not uncomment this code this will truncate all the data from the Database Caution ==============
// ===============================================================================================================

// const connection = mongoose.connection;

//     // Get a list of all collection names
//     connection.db.listCollections().toArray((err, collections) => {
//       if (err) {
//         console.error(`Failed to fetch collections: ${err}`);
//         connection.close();
//         return;
//       }

//       // Drop each collection
//       const dropPromises = collections.map((collection) => {
//         return connection.db.dropCollection(collection.name);
//       });

//       // Wait for all drop promises to resolve
//       Promise.all(dropPromises)
//         .then(() => {
//           console.log('Database truncated successfully.');

//           // Close the connection
//           connection.close();
//         })
//         .catch((err) => {
//           console.error(`Failed to truncate the database: ${err}`);
//           connection.close();
//         });
//     });    