const client = require("../../redis/redis-config");
// data modal 
const chat = require("../../../database/models/chat")
const DEFAULT_EXPIRATION = 3600 * 6; // sec * number
// 3600s === 1 H
async function Add_User(data, id) {
  if(!data.isAuth)
  return 0;

  let response = await client.setEx(data.email,DEFAULT_EXPIRATION,id)
  if(response)
  return 1

  return 0
}

async function Logout_User(data, id) {
  let response = await client.del(data.email)
  if(response)
  return 1

  return 0
}


async function Save_Message(payload,socket){
    try {
    
      // console.log(payload)
        let data = chat(
          {
            from : payload.from,
            to : payload.to,
            sender_email : payload.sender_email,
            receiver_email : payload.receiver_email,
            message : payload.message,
            files : payload.files
          }
        )

        let to = await client.get(payload.receiver_email)

        // console.log(payload)
        socket.to(to).emit("receive_notification", {
          type: "New_Message",
          payload: {
            type: "message",
            from: payload.sender_email,
            email: payload.sender_email,
            receiver_email: payload.receiver_email,
            message: payload.message,
            files : payload.files
          },
        });
        
        data = await data.save();
        return 1
    } catch (error) {
        console.log(error)
    }
}

module.exports = { Add_User, Logout_User, Save_Message };
