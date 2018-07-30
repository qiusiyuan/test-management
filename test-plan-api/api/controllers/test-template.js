'use strict';

const getAll = require("../lib/test-template-util/getAll");

module.exports = {
  getAllTests: getAllTests,
  addTest: addTest,
  deleteTest : deleteTest,
  editTestDescription: editTestDescription,
  renameTest: renameTest,
};

function getAllTests(req, res){
  var options = {};
  getAll.getAllTests(options, function(err, result){
    if(err){
      res.status(500);
      return res.json({
        success:false,
        message: err.message
      });
    }
    if(result){
      result.success = true;
      res.status(200);
      return res.json(result);
    }
  })
}

function addTest(req, res){
  const reqIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var options = req.swagger.params.options.value;
  console.log(options)
}

function deleteTest(req, res){
  const reqIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var options = req.swagger.params.options.value;
  console.log(options)
}

function editTestDescription(req, res){
  const reqIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var options = req.swagger.params.options.value;
  console.log(options)
}

function renameTest(req, res){
  const reqIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var options = req.swagger.params.options.value;
  console.log(options)
}
