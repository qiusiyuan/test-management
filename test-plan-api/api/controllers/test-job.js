'use strict';

const config = require('../../config/config').getconfig();
const listAll = require("../lib/test-job-util/listAll");
const create = require('../lib/test-job-util/createJob');
const edit = require('../lib/test-job-util/editJob');
const editTest = require('../lib/test-job-util/editJobTestResult');

module.exports = {
  listAllJobs: listAllJobs,
  getJob: getJob,
  createJob: createJob,
  editJob: editJob,
  editTestResult: editTestResult,
  editJobDescription: editJobDescription,
  editTestOwner: editTestOwner,
  editJobErrors: editJobErrors,
};

function listAllJobs(req, res){
  var options = {}
  listAll.listAllJobs(options, function(err, result){
    if(err){
      res.status(200);
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

function getJob(req, res){
  const reqIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var options = {
    jobName: req.swagger.params.jobName.value
  };
  listAll.getJob(options, function(err, result){
    if(err){
      if(err.code === 'ENOENT'){
        res.status(404);
        return res.json({
          success:false,
          message: options.jobName + " job doesn't exist"
        });
      }else{
        res.status(400);
        return res.json({
          success:false,
          message:err.message,
        });
      }
    }
    if(result){
      res.status(200);
      return res.json({
        success: true,
        job: result
      });
    }
  })
}

function createJob(req, res){
  const reqIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var options = {
    jobName: req.swagger.params.jobName.value
  };
  create.createJob(options, function(err, result){
    if(err){
      res.status(200);
      return res.json({
        success: false,
        message: err.message,
      });
    }
    if(result){
      res.status(200);
      return res.json({
        success: true,
        message: result,
      });
    }
  })
}

function editJob(req, res){
  const reqIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var options = req.swagger.params.options.value;
  options.jobName = req.swagger.params.jobName.value;
  edit.editJobTests(options, function(err, logs){
    if(err){
      res.status(400)
      return res.json({
        success: false,
        message: err.message,
      });
    }
    if(logs){
      var fullLog = ""
      logs.forEach(log => {
        fullLog += log+"\n"
      });
      res.status(200);
      return res.json({
        success: true,
        message: fullLog,
      })
    }
  });
}

function editTestResult(req, res){
  const reqIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var options = req.swagger.params.options.value;
  options.jobName = req.swagger.params.jobName.value
  editTest.editJobTestResult(options, function(err, result){
    if(err){
      res.status(400);
      return res.json({
        success: false,
        message: err.message,
      });
    }
    if(result){
      res.status(200);
      return res.json({
        success: true,
        message: result,
      });
    }
  })
}

function editJobDescription(req, res){
  const reqIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var options = req.swagger.params.options.value;
  options.jobName = req.swagger.params.jobName.value
  edit.editJobDescription(options, function(err, result){
    if(err){
      res.status(200);
      return res.json({
        success: false,
        message: err.message,
      });
    }
    if(result){
      res.status(200);
      return res.json({
        success: true,
        message: result,
      });
    }
  });
}

function editTestOwner(req, res){
  const reqIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var options = req.swagger.params.options.value;
  options.jobName = req.swagger.params.jobName.value
  editTest.editTestOwner(options, function(err, result){
    if(err){
      res.status(200);
      return res.json({
        success: false,
        message: err.message,
      });
    }
    if(result){
      res.status(200);
      return res.json({
        success: true,
        message: result,
      });
    }
  });
}

function editJobErrors(req, res){
  const reqIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var options = req.swagger.params.options.value;
  options.jobName = req.swagger.params.jobName.value
  edit.editJobErrors(options, function(err, result){
    if(err){
      res.status(200);
      return res.json({
        success: false,
        message: err.message,
      });
    }
    if(result){
      res.status(200);
      return res.json({
        success: true,
        message: result,
      });
    }
  });
}