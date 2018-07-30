'use strict';

const config = require('../../../config/config').getconfig();
const utils = require('../util-helper/utils');
const {Connection }= require("../../dbConnection/connection");

module.exports ={
  editJobTestResult: editJobTestResult,
  editTestOwner: editTestOwner,
};

async function editJobTestResult(options, callback){
  var jobName = options.jobName;
  var status = options.status;
  var error = options.error || null;
  var test = options.test;
  var queryOption = utils.getFindQueryAndUpdateQueryKey(test);
  var findQuery = queryOption.findQuery;
  findQuery.name = jobName;
  var updateQuery={};
  if(status !== undefined && status !== null){
    var statusText = ["pending", "failure", "success"][status]
    var updateQueryKeyStatus = queryOption.updateQueryKey + ".status";
    updateQuery[updateQueryKeyStatus] = statusText;
  }
  if(error){
    var updateQueryKeyError = queryOption.updateQueryKey + ".error";
    updateQuery[updateQueryKeyError] = error;
  }
  var arrayFilters = queryOption.arrayFilters;
  try{
    await Connection.db.collection(config.job).updateOne(
      findQuery,
      {'$set': updateQuery, '$currentDate': {lastModified: true}},
      {'arrayFilters': arrayFilters}
    )
  }catch(err){
    console.log("editJobTestResult:", err.message);
    return callback(err)
  }
  return callback(null, "Success")
}

async function editTestOwner(options, callback){
  var jobName = options.jobName;
  var owner = options.owner;
  var test = options.test;
  var queryOption = utils.getFindQueryAndUpdateQueryKey(test);
  var findQuery = queryOption.findQuery;
  findQuery.name = jobName;
  var updateQueryKey = queryOption.updateQueryKey + ".owner";
  var updateQuery={};
  updateQuery[updateQueryKey] = owner;
  var arrayFilters = queryOption.arrayFilters;
  try{
    await Connection.db.collection(config.job).updateOne(
      findQuery,
      {'$set': updateQuery, '$currentDate': {lastModified: true}},
      {'arrayFilters': arrayFilters}
    )
  }catch(err){
    console.log("editTestOwner:", err.message);
    return callback(err)
  }
  return callback(null, "Success")
}
