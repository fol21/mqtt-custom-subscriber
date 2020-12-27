const mqtt = require('mqtt')
const client  = mqtt.connect('mqtt://localhost:1883')

const THRESHOLD = 3;

client.on('connect', function () {
  client.subscribe('/allow-in:passagers', function (err) {
    if (!err) {
      console.log('Hello Encontras!')
    }
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  const context = JSON.parse(message.toString());
  console.log("context", message.toString())   
  console.log("Allow In",  context["passagers"] < 3 ? "allowed" : "not allowed");  
  client.publish('/allow-in:allow',JSON.stringify({id: context["id"] , allow: parseInt(message.toString()) < THRESHOLD ? true : false}));
})