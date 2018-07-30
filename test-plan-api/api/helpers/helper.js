'use strict';

module.exports = {
  addUserLogs:addUserLogs,
};
const fs = require('fs');
const config = require('../../config/config').getconfig();
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = config.mondbBaseUrl;

function addUserLogs(log){
  log.timestamp = new Date();
  // insert
  MongoClient.connect(mongoUrl, function(err, db) {
    if (err) throw err;
    var dbo = db.db()
    dbo.collection("userlog").insertOne(log, function(err, res) {
      if (err) throw err;
      console.log("user logged");
      db.close();
    });
  });
}

function getUserLogs(){
  MongoClient.connect(mongoUrl, function(err, db) {
    if (err) throw err;
    var dbo = db.db();
    dbo.collection("userlog").find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
    });
  });
}