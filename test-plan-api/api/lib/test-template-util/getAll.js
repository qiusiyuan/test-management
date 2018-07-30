'use strict';

const config = require('../../../config/config').getconfig();
const fs = require('fs');
const path = require('path');
const utils = require("../util-helper/utils")

exports.getAllTests = function getAllTests(options, callback){
  var suiteDir = config.suiteDir;
  fs.readdir(suiteDir, (err, files) => {
    if(err){
      console.log('getAllTests:', err.message);
      return callback(err);
    }
    var object = {"tests":[]}
    files.forEach((file)=>{
      var test = getTestTree(path.join(suiteDir, file));
      if (test){
        object.tests.push(test);
      }
    })
    return callback(null, object)
  });
}

function getTestTree(abspath){
  var testObject = {
    "name":path.basename(abspath),
  }
  var fullFileStats = fs.statSync(abspath);
  if (fullFileStats.isDirectory()){
    try{
      var files = fs.readdirSync(abspath);
    }catch(err){
      console.log('getTestTree:', err.message)
      return null;
    }
    if( files.indexOf('.test') != -1){//test case
      testObject.description = utils.getDescription(abspath);
      return testObject;
    }
    if( files.indexOf('.group') != -1){//test group
      files = files.filter(function(file){
        return file !== '.group';
      })
      testObject.subset = [];
      files.forEach((file)=>{
        var newPath = path.join(abspath, file)
        var childTest = getTestTree(newPath)
        if (childTest){
          testObject.subset.push(childTest)
        } 
      })
      return testObject;   
    }
    else{//not an object
      console.log(abspath, " is not a test thing, plz check")
      return null
    }
  }
  else{ //not a diretory
    return null;
  }
}
