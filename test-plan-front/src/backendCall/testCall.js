import axios from 'axios';
const url = require('url');
const config = require('./config.json');
const hostIP = config.hostIP;

//getAllTests
export function getAllTests(callback){
  var endpoint = '/v1/testtemp/getAllTests';
  var urladd = url.resolve(hostIP, endpoint);
  axios.get(urladd)
  .then((res)=>{
    if(res.data.success){
      return callback(null, res.data.tests);
    }else{
      return callback(new Error(res.data.message));
    }
  })
  .catch(err =>{
    return callback(err);
  });
}

//

