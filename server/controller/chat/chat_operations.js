const fs = require("fs");

// last Data
const lastData = require("./online.json");

// data modal 
const chat = require("../../../database/models/chat")

async function Add_User(data, id) {
  const current_user_mail = lastData.map((row) => row.email);

  // console.log(data)
  // console.log(current_user_mail)
  // deleting unnecessary data from obj 
  delete data.access
  delete data.token
  delete data.expireIn

  // append user in the list
  if (data && data.isAuth && current_user_mail.includes(data.email)) {
    lastData[current_user_mail.indexOf(data.email)] = { ...data, id };
  } else {
    lastData.push({ ...data, id });
  }

  // now write the data into the connection file here
  fs.writeFile("server/controller/chat/online.json", JSON.stringify(lastData), (err) => {
    if (err) {
      // console.log(err);
    }
    // console.log("User Added");
    return 1;
  });

}

async function Logout_User(data, id) {
  const current_user_mail = lastData.filter((row) => data.email !== row.email);

  // now write the data into the connection file here
  fs.writeFile("server/controller/chat/online.json", JSON.stringify(current_user_mail), (err) => {
    if (err) {
      // console.log(err);
    }
    // console.log("User Added");
    return 1;
  });

}

async function Save_Message(payload){
    try {
      // console.log(payload)
        let data = chat(
          {
            from : payload.from,
            to : payload.to,
            sender_email : payload.sender_email,
            receiver_email : payload.receiver_email,
            message : payload.message,
          }
        )
        
        data = await data.save();

        if(data)
        {
          // console.log("Message Saved")
        }
        return 1
    } catch (error) {
        // console.log(error)
    }
}


module.exports = { Add_User, Logout_User, Save_Message };
