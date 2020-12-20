const mqtt = require('mqtt')
const client  = mqtt.connect('mqtt://localhost:1883')

client.on('connect', function () {
  client.subscribe('/allow-in:passagers', function (err) {
    if (!err) {
      console.log('Hello Encontras!')
    }
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log("passagers", message.toString())   
  console.log("Allow In",  parseInt(message.toString()) < 3 ? "allowed" : "not allowed");  
  client.publish('/allow-in:allow',JSON.stringify({allow: parseInt(message.toString()) < 3 ? true : false}));
})