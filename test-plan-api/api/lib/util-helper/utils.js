'use strict';

const config = require('../../../config/config').getconfig();
const fs = require('fs');
const path = require('path');
var lockFile = require('lockfile');
const {Connection }= require("../../dbConnection/connection");

module.exports = {
  getDescription:getDescription,
  cleanUpJobObject:cleanUpJobObject,
  dbFind: dbFind,
  isTest: isTest,
  prelock: prelock,
  getTestObject: getTestObject,
  getPathObject: getPathObject,
  asyncForEach: asyncForEach,
  getFindQueryAndUpdateQueryKey:  getFindQueryAndUpdateQueryKey,
};

function getDescription(fullPath){
  try{
    var content = fs.readFileSync(path.join(fullPath,'.test'), 'utf-8')
    return content
  }
  catch(err){
    console.log('getDescription:',err.message);
    return null
  }
}

function dbFind(query){
  return Connection.db.collection(config.job).find(query);
}

function cleanUpJobObject(jobObject){
  var testTree = jobObject.tests;
  testTree.forEach((childTest) => {
    if (testObjectCanBeDeleted(childTest)){
      testTree.splice( testTree.indexOf(childTest), 1 );
    }
  });
}

function testObjectCanBeDeleted(testObject){
  if (isTest(testObject)){
    return false;
  }
  if(testObject.subset.length == 0 ){
    return true;
  }else{
    var deleteQueue = []
    testObject.subset.forEach((childTest)=>{
      if(testObjectCanBeDeleted(childTest)){
        deleteQueue.push(childTest);
      }
    })
    if (deleteQueue.length != 0){
      deleteQueue.forEach((childTest)=>{
        testObject.subset.splice(testObject.subset.indexOf(childTest),1 );
      })
    }
    if (testObject.subset.length == 0){
      return true;
    }else{
      return false;
    }
  }
}

function isTest(testObject){// {"name": "", ....} judge by check if subset is undefined
  return testObject.subset === undefined || testObject.subset === null;
}

function prelock(lockPath){
  var locked = true;
  var start = new Date();
  var now = new Date();
  var interval = now - start;
  while(locked && interval<5*1000){
    locked = lockFile.checkSync(lockPath);
    now = new Date();
    interval = now - start;
  }
  if(interval >= 5*1000 && locked){
    throw new  Error("Job is still locked, plz request later or check server")
  }
  try{
    lockFile.lockSync(lockPath)
    return null
  }catch(err){
    var logs="Fail to lock file " + lockPath;
    throw new Error(logs)
  }
}

function getTestObject(testTree, pathObject){
  var result = null;
  testTree.forEach((child) => {
    if (pathObject.name === child.name){
      if( isTest(child) && isTest(pathObject)){
        result = child;
      }
      if (!isTest(child) && !isTest(pathObject)){
        result = getTestObject(child.subset, pathObject.subset[0]);
      }
    }
  })
  return result;
}

function getPathObject(testTree, pathObject){
  var result = null;
  testTree.forEach((child) => {
    if (pathObject.name === child.name){
      if(isTest(pathObject)){
        result = child;
      }
      if (!isTest(child) && !isTest(pathObject)){
        result = getPathObject(child.subset, pathObject.subset[0]);
      }
    }
  })
  return result;
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

function getFindQueryAndUpdateQueryKey(testObject){
  var findQuery = {};
  var updateQueryKey = "tests";
  var findQueryKey = "tests";
  var arrayFilters = [];
  var options = {
    findQuery: findQuery,
    findQueryKey: findQueryKey,
    updateQueryKey, updateQueryKey,
    arrayFilters: arrayFilters,
  }
  var level = 0;
  getFindQueryAndUpdateQueryKeyRecursive(testObject, options, level)
  return options
}

function getFindQueryAndUpdateQueryKeyRecursive(testObject, options, level){
  options.findQuery[options.findQueryKey + ".name"] = testObject.name;
  var levelKey = `level${level}`;
  options.updateQueryKey = options.updateQueryKey + `.$[${levelKey}]`
  var newFilter = {}
  newFilter[levelKey + ".name"] = testObject.name
  options.arrayFilters.push(newFilter)
  if(!isTest(testObject)){
    options.findQueryKey = options.findQueryKey + ".subset";
    options.updateQueryKey = options.updateQueryKey + ".subset";
    level ++;
    getFindQueryAndUpdateQueryKeyRecursive(testObject.subset[0], options, level);
  }
}