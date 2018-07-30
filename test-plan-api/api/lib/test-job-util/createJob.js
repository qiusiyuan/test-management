'use strict';

const config = require('../../../config/config').getconfig();
const {Connection }= require("../../dbConnection/connection");

module.exports = {
  createJob: createJob
};

async function createJob(options, callback){
  var jobName = options.jobName;
  var isValid= await checkJobNameValid(jobName);
  if(!isValid){
    return callback(Error("Cannot create job " + jobName + ", plz try again or with another name"));
  }
  else{// valid
    var createFile = await initiateJobDocument(jobName);
    if(!createFile){
      return callback(Error("Failed to create the job file " + jobName));
    }
    else{
      var message = "New job file " + createFile + " created"
      console.log(message);
      return callback(null, message);
    }
  }
}

async function checkJobNameValid(jobName){
  var findJobNameQuery={
    name: jobName,
  };
  try{
    var res = await Connection.db.collection(config.job).find(findJobNameQuery).toArray()
  }catch(err){
    console.log("checkJobNameValid:", err.message);
    return false;
  }
  if(res.length) return false;
  return true
}

async function initiateJobDocument(jobName){
  var nowDate = new Date();
  var jobObject = {
    "name": jobName,
    "status": "pending",
    "createDate": nowDate,
    "lastModified": nowDate,
    "descriptions": "",
    "tests": [],
    "jobErrors":{},
  }
  try{
    var res = await Connection.db.collection(config.job).insertOne(jobObject)
  }catch(err){
    console.log("initiateJobDocument:", err.message);
    return null;
  }
  return res.ops[0].name;
}
