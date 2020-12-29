import { BenchMarker } from './benchmark/base-benchmarker';
import * as mqtt from "mqtt";
const client  = mqtt.connect('mqtt://localhost:1883')

const THRESHOLD = 3;
const bm = new BenchMarker();

client.on('connect', function () {
  client.subscribe('/allow-in:passagers', function (err) {
    if (!err) {
      console.log('Hello Encontras!')
    }
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log("context", message.toString())   
  const context = JSON.parse(message.toString());
  console.log("Allow In",  context["passagers"] <= THRESHOLD ? "allowed" : "not allowed");
  bm.thresholdReached({id: context["id"], passagers: context["passagers"], threshold: THRESHOLD}); 
  client.publish('/allow-in:allow',JSON.stringify({id: context["id"] , allow: parseInt(message.toString()) <= THRESHOLD ? true : false}));
})