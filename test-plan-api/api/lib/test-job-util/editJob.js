'use strict';

const config = require('../../../config/config').getconfig();
const fs = require('fs');
const path = require('path');
const utils = require('../util-helper/utils');
const lodash = require('lodash');
const {Connection }= require("../../dbConnection/connection");

var suiteDir = config.suiteDir;

module.exports = {
  editJobTests: editJobTests,
  editJobDescription: editJobDescription,
  editJobErrors: editJobErrors,
};

async function editJobTests(options, callback){
  var operation = options.operation;
  if(operation == "add"){
    try{
      var logs = await addJobTests(options);
      return callback(null, logs)
    }catch(err){
      console.log("addJobTests:", err);
      return callback(err);
    }
  }else if(operation =="delete"){
    try{
      var logs = deleteJobTests(options);
      return callback(null, logs)
    }catch(err){
      console.log("deleteJobTests:", err);
      return callback(err);
    }
  }else{
    return callback(Error("Must specify correct operations"))
  }
}

async function addJobTests(options){
  var logs =[]
  var testAddSet = options.test;
  var jobName = options.jobName;
  if(testAddSet.length == 0){
    console.log("addJobTests:", " empty test add set")
    return logs;
  }
  await utils.asyncForEach(testAddSet, async (test)=>{
    var testPath = path.join(suiteDir, test.name);
    var findQuery = {name: jobName};
    var lastFindQuery = "tests";
    findQuery[lastFindQuery] = {
      "$not": {
          "$elemMatch": {
              "name": test.name
          }
      }
    }
    var arrayFilters = [];
    var addQueryKey = "tests";
    var level = 0;
    await addTestRecursive(test, testPath, findQuery, lastFindQuery, addQueryKey, arrayFilters, level, jobName, logs);
  })
  return logs;
}

async function addTestRecursive(test, testPath, findQuery, lastFindQuery, addQueryKey, arrayFilters, level, jobName, logs){
  //var findQuery = JSON.parse(JSON.stringify(findQuery));
  //var addQuery = JSON.parse(JSON.stringify(addQuery));
  try{
    var fullFileStats = fs.statSync(testPath);
  }catch(err){
    console.log("addTestRecursive:", err.message);
    logs.push(test.name + " failed to be added")
    return;
  }
  if (fullFileStats.isDirectory()){
    try{
      var files = fs.readdirSync(testPath);
    }catch(err){
      console.log('addTestRecursive:', err.message)
      logs.push(test.name + " failed to be added")
      return;
    }
    if( files.indexOf('.test') != -1 && utils.isTest(test)){//test case
      var addingObject= {
        "name":test.name,
        "description":utils.getDescription(testPath),
        "owner":"",
        "status": "pending",
        "error": ""
        }
      try{
        var addQuery = {}
        addQuery[addQueryKey]=addingObject
        await Connection.db.collection(config.job).updateOne(
          findQuery,
          {"$addToSet": addQuery,  '$currentDate': {lastModified: true}},
          {"arrayFilters": arrayFilters}
        )
      }catch(err){
        console.log("addTestRecursive:", err.message)
        logs.push(test.name + " failed to be added")
      }
    }
    else if( files.indexOf('.group') != -1 && !utils.isTest(test)){//test group
      var groupObject ={
        "name":test.name,
        "owner":"",
        "subset":[]
      }
      try{
        var addQuery = {}
        addQuery[addQueryKey]=groupObject
        await Connection.db.collection(config.job).updateOne(
          findQuery,
          {"$addToSet": addQuery, '$currentDate': {lastModified: true}},
          {"arrayFilters": arrayFilters}
        )
      }catch(err){
        console.log("addTestRecursive:", err.message)
        logs.push(test.name + " failed to be added")
      }
      delete findQuery[lastFindQuery];
      await utils.asyncForEach(test.subset, async(childTest)=>{
        var newFindQuery = JSON.parse(JSON.stringify(findQuery));
        var newLastFindQuery = lastFindQuery + ".subset";
        var newFindNameQuery = lastFindQuery + ".name";
        newFindQuery[newFindNameQuery] = test.name;
        newFindQuery[newLastFindQuery] = {
          "$not": {
              "$elemMatch": {
                  "name": childTest.name
              }
          }
        };
        var newArrayFilters = JSON.parse(JSON.stringify(arrayFilters));
        var newTestPath = path.join(testPath, childTest.name);
        var newLevel = level + 1 ;
        var newFilterKey = `level${newLevel}`;
        var newAddQueryKey = addQueryKey + `.$[${newFilterKey}].subset`;
        var newFilter = {};
        newFilter[newFilterKey+'.name'] = test.name;
        newArrayFilters.push(newFilter)
        await addTestRecursive(childTest, newTestPath, newFindQuery, newLastFindQuery, newAddQueryKey, newArrayFilters, newLevel, jobName, logs);
      })
      return;   
    }
    else{//not an object
      console.log(testPath, " is not a test thing, plz check")
      logs.push(test.name + " failed to be added")
      return;
    }
  }
  else{ //not a diretory
    logs.push(test.name + " failed to be added")
    return;
  }
}



function deleteJobTests(options){
  var logs = [];
  var testDeleteSet = options.test;
  var jobName = options.jobName;
  var jobFile = utils.composeJobFileName(jobName);
  var jobPath = path.join(jobDir,jobFile);
  var jobObject = utils.readJobContent(jobPath);
  var testTree = jobObject.tests;
  if (testDeleteSet.length == 0){
    console.log("deleteJobTests: no items to delete")
    return;
  }
  testDeleteSet.forEach((delTest)=>{
    var testPath = path.join(suiteDir, delTest.name);
    deleteTestRecursive(testTree, delTest, testPath, jobName, logs);
  })
  utils.updateJobFile(jobObject, jobPath);
  return logs;
}

function deleteTestRecursive(target, source, testPath, jobName, logs){
  var searchLst = lodash.filter(target, x=>x.name === source.name)
  if (searchLst.length == 0){
    logs.push(source.name + " not exist in this job")
    return
  }
  var targetSet = searchLst[0]
  if (source.subset === undefined){ //delete every thing under this
    if (targetSet.subset === undefined){ //test
      var unlink = unlinkJobFile(jobName, testPath);
      if (unlink){
        target.splice( target.indexOf(targetSet), 1 );
        return;
      }else{
        logs.push(source.name + " failed to delete");
        return;
      }
    }else{//group
      targetSet.subset.forEach((childTest)=>{
        var newTestPath = path.join(testPath, childTest.name);
        deleteTestRecursive(targetSet.subset, childTest, newTestPath, jobName, logs);
      });
    }
  }else{ //looking for a subset to delete
    if(source.subset.length == 0){
      logs.push("Bad request, cannot have empty subset");
      return;
    }
    if(targetSet.subset === undefined){
      logs.push(source.name + " failed to delete because of bad request");
      return;
    }else{
      source.subset.forEach((childTest)=>{
        var newTestPath = path.join(testPath, childTest.name);
        deleteTestRecursive(targetSet.subset, childTest, newTestPath, jobName, logs);
      })
    }
  }
}

function unlinkJobFile(jobName, testPath){
  try{
    fs.unlinkSync(path.join(testPath, jobName));
    return true;
  }catch(err){
    console.log("unlinkJobFile:", err.message);
    return null;
  }
}


async function editJobDescription(options, callback){
  var jobName = options.jobName;
  var descriptions = options.descriptions;
  var findQuery = {name: jobName}
  var updateQuery = {descriptions: descriptions}
  try{
    await Connection.db.collection(config.job).updateOne(findQuery, {"$set": updateQuery, '$currentDate': {lastModified: true}});
    return callback(null, "Succeeded")
  }catch(err){
    console.log("editJobDescription:", err.message);
    return callback(err);
  }
}

function editJobErrors(options, callback){
  var jobName = options.jobName;
  var errorID = options.errorID;
  var status = null;
  var descriptions = null;
  if(options.status !== null && options.status !== undefined){
    if (options.status!==0 && options.status!==1){
      return callback(new Error("status must be 0(pending) or 1(solved)"))
    }
    status = ["pending", "solved"][options.status];
  }
  if (options.descriptions !== null && options.descriptions !== undefined){
    descriptions = options.descriptions;
  }
  var findQuery = {name: jobName}
  var setQuery = {}
  if (errorID === "new"){ //new
    Connection.db.collection(config.job).findOne(findQuery, function(err, result){
      if(err){
        console.log('editJobErrors.findOne:' ,err.message);
        return callback(err)
      }
      if(!result){
        var err = new Error("Not exist");
        err.code = 'ENOENT';
        return callback(err);
      }
      var length = Object.keys(result.jobErrors).length;
      errorID = `er${length+1}`;
      if(status !== null){
        setQuery[`jobErrors.${errorID}.status`] = status;
      }
      if(descriptions !== null){
        setQuery[`jobErrors.${errorID}.descriptions`] = descriptions;
      }
      Connection.db.collection(config.job).updateOne(findQuery, {"$set": setQuery}, function(err,res){
        if(err){
          console.log('editJobErrors.updateOne:' ,err.message);
          return callback(err)
        }
        if(res.result.nModified){
          return callback(null, errorID)
        }else{
          return callback(new Error(`Failed to add new error`))
        }
      });
    });
  }else{
    findQuery[`jobErrors.${errorID}`] = { "$exists" : true };
    if(status !== null){
      setQuery[`jobErrors.${errorID}.status`] = status;
    }
    if(descriptions !== null){
      setQuery[`jobErrors.${errorID}.descriptions`] = descriptions;
    }
    Connection.db.collection(config.job).updateOne(findQuery, {"$set": setQuery}, function(err,res){
      if(err){
        console.log('editJobErrors.updateOne:' ,err.message);
        return callback(err)
      }
      if(res.result.n){
        return callback(null, errorID)
      }else{
        return callback(new Error(`Doesn't find ${errorID}`))
      }
    });
  }
}
