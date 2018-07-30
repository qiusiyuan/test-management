
const fs = require('fs');
const config = require('../../config/config').getconfig();
var MongoClient = require('mongodb').MongoClient;
var url = config.mondbBaseUrl;
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db();
  dbo.collection("userlog").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
});
function addUserLogs(log){
  var mongoUrl = config.mondbBaseUrl;
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
logs = [{
  "reqIp": "::ffff:9.26.79.238",
  "op": "download",
  "target": "/root/Data/kubectl plugins/editconfigmap/edit_configmap_json.py"
},
{
  "reqIp": "::ffff:9.108.125.136",
  "op": "download",
  "target": "/root/Data/kubectl plugins/editconfigmap/edit_configmap_json.py"
},
{
  "reqIp": "::ffff:9.108.123.226",
  "op": "download",
  "target": "/root/Data/kubectl plugins/editconfigmap/plugin.yaml",
  "timestamp": "2018-05-08T20:08:00.629Z"
},
{
  "reqIp": "::ffff:9.108.120.115",
  "op": "download",
  "target": "/root/Data/kubectl plugins/editconfigmap/edit_configmap_json.py",
  "timestamp": "2018-05-08T21:35:34.083Z"
},
{
  "reqIp": "::ffff:9.108.120.115",
  "op": "download",
  "target": "/root/Data/kubectl plugins/editconfigmap/plugin.yaml",
  "timestamp": "2018-05-08T21:35:55.772Z"
},
{
  "reqIp": "::ffff:9.108.120.115",
  "op": "download",
  "target": "/root/Data/kubectl plugins/editconfigmap/test.sh",
  "timestamp": "2018-05-08T21:35:56.374Z"
},
{
  "reqIp": "::ffff:9.108.124.251",
  "op": "download",
  "target": "/root/Data/mylabel.cert",
  "timestamp": "2018-05-15T19:26:29.551Z"
}
]

// logs.forEach(log => {
//   console.log(log)
// });