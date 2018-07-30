'use strict';

const config = require('../../../config/config').getconfig();
const utils = require("../util-helper/utils")
const {Connection }= require("../../dbConnection/connection");

module.exports = {
  listAllJobs: listAllJobs,
  getJob: getJob,
}

async function listAllJobs(options, callback){
  var result = {"jobs":[]};
  var list = [];
  try{
    list = await listAllDocument();
  }catch(err){
    console.log('listAllJobs:', err.message);
    return callback(err);
  }
  result.jobs = list;
  return callback(null, result);
}

async function listAllDocument(options){
  var query = {};
  var sortQuery = { createDate: -1};
  var fieldQuery ={
    _id: 0,
    name: 1,
    status: 1,
    createDate: 1,
    lastModified: 1,
  };
  try {
    var list = await utils.dbFind(query).project(fieldQuery).sort(sortQuery).toArray();
  }catch(err){throw err}
  return list;
}

function getJob(options, callback){
  var jobName = options.jobName;
  var findJobQuery = {
    name: jobName,
  }
  var fieldQuery ={
    _id: 0,
  }
  Connection.db.collection(config.job).findOne(findJobQuery, function(err, result){
    if (err) {
      console.log('getJob:' ,err.message);
      return callback(err)
    };
    if(!result){
      var err = new Error("Not exist");
      err.code = 'ENOENT';
      return callback(err);
    }
    return callback(null, result)
  });
}

