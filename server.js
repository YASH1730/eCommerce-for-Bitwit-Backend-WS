const express = require("express");
const app = express();
// const port = process.env.PORT || 0; // for dynamically changing the port
const port = process.env.PORT || 8000;
const bodyParser = require("body-parser");
const path = require("path");
const mongo = require("./database/dbConfig");
const http =require('http')
const cors = require("cors");
// server call 
const server= http.createServer(app)
// SOCKET 
const {Server} = require('socket.io');
// chat Function 
const chat = require('./server/controller/chat/chat_operations');
const instance = new Server(server, {
  cors: {
    origin: [process.env.CLIENT,process.env.CLIENT_FRONTEND],
  },
});
// active users
const users = require('./server/controller/chat/online.json')


// middleware to parse the body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(cors());

// public path
app.use(express.static(path.join(__dirname, "public")));
app.set("views", "./src/public");

//set up the view engine
app.set("view engine", "pug");
app.set("views", "views");

// set uploads as static
app.use("/upload", express.static(path.join(__dirname, "upload")));
app.use(express.static("frontEnd/build"));

// requiring the routes
app.use("/api/", require("./server/routes"));


// Socket IO 
instance.on('connection',(socket)=>{
  // console.log(`Connection were made here on ID :: ${socket.id}`)
  
  // on the connection of the new user
  socket.on('connect_user',(data)=>{
    // adding user in file
    chat.Add_User(data,socket.id)
    // sending ID to the sender
    socket.emit('receive_id',socket.id)
    // inform all the existing user about the new entry
    socket.emit('receive_notification',{
      type : "Adding_New_User",
      payload : users
    })
    socket.broadcast.emit('receive_notification',{
      type : "Adding_New_User",
      payload : users
    })
  })
  
  // message transactions 
  socket.on('send_message',(message)=>{
    chat.Save_Message(message)
    socket.to(message.to).emit('receive_notification',{
      type : "New_Message",
      payload : {
           type : "message",
           from : message.from,
           email :message.sender_email,
           receiver_email :message.receiver_email,
           message : message.message
      }
    })
   })
  // message transactions from frontend Site woodshala.in
  socket.on('send_message_site',(message)=>{
    chat.Save_Message(message)
    socket.broadcast.emit('receive_notification',{
      type : "New_Message",
      payload : {
           type : "message",
           from : message.from,
           email :message.sender_email,
           message : message.message
      }
    })
   })

   socket.on('is_typing',data=>{
    socket.broadcast.emit('typing',data)
  })
  
  socket.on('logout',data=>{
    chat.Logout_User(data)
    // for removing the user on the current time
    const current_user_mail = users.filter((row) => data.email !== row.email);
    socket.broadcast.emit('receive_notification',{
      type : "User_Logout",
      payload : current_user_mail
    })
  })

})


app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontEnd", "build", "index.html"));
});

server.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
