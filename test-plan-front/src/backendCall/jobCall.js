import axios from 'axios';
const url = require('url');
const config = require('./config.json');
const hostIP = config.hostIP;

//listAllJobs
export function listAllJobs(callback){
  var endpoint = '/v1/testjob/listAllJobs';
  var urladd = url.resolve(hostIP, endpoint);
  axios.get(urladd)
  .then((res)=>{
    if(res.data.success){
      return callback(null, res.data.jobs);
    }else{
      return callback(new Error(res.data.message));
    }
  })
  .catch(err =>{
    return callback(err);
  });
}

//getJob
export function getJob(jobName, callback){
  var endpoint = `/v1/testjob/job/${jobName}`;
  var urladd = url.resolve(hostIP, endpoint);
  axios.get(urladd)
  .then((res)=>{
    if(res.data.success){
      return callback(null, res.data.job);
    }else{
      return callback(new Error(res.data.message));
    }
  })
  .catch(err =>{
    return callback(err);
  });
}

//createJob
export function createJob(jobName, callback){
  var endpoint = `/v1/testjob/create/${jobName}`;
  var urladd = url.resolve(hostIP, endpoint);
  axios.post(urladd)
  .then(res=>{
    if(res.data.success){
      return callback(null, res.data.message);
    }else{
      return callback(new Error(res.data.message));
    }
  })
  .catch(err =>{
    return callback(err);
  });
}

//edit job test (add)
export function addJobTests(jobName, test, callback){
  var endpoint = `/v1/testjob/edit/${jobName}`;
  var urladd = url.resolve(hostIP, endpoint);
  var operation = 'add';
  var body = {
    "operation": operation,
    "test": test,
  }
  axios.post(urladd, body)
  .then(res=>{
    if(res.data.success){
      return callback(null, res.data.message);
    }else{
      return callback(new Error(res.data.message));
    }
  })
  .catch(err =>{
    return callback(err);
  });
}

//edit job test (delete)
export function deleteJobTests(jobName, test, callback){
  var endpoint = `/v1/testjob/edit/${jobName}`;
  var urladd = url.resolve(hostIP, endpoint);
  var operation = 'delete';
  var body = {
    "operation": operation,
    "test": test,
  }
  axios.post(urladd, body)
  .then(res=>{
    if(res.data.success){
      return callback(null, res.data.message);
    }else{
      return callback(new Error(res.data.message));
    }
  })
  .catch(err =>{
    return callback(err);
  });
}

// edit test result
export function editTestResult(jobName, body, callback){
  var endpoint = `/v1/testjob/editTestResult/${jobName}`;
  var urladd = url.resolve(hostIP, endpoint);
  axios.post(urladd, body)
  .then(res=>{
    if(res.data.success){
      return callback(null, res.data.message);
    }else{
      return callback(new Error(res.data.message));
    }
  })
  .catch(err =>{
    return callback(err);
  });
}

export function editJobDescription(jobName, descriptions, callback){
  var endpoint = `/v1/testjob/editJobDescription/${jobName}`;
  var urladd = url.resolve(hostIP, endpoint);
  var body = { descriptions: descriptions};
  axios.post(urladd, body)
  .then(res=>{
    if(res.data.success){
      return callback(null, res.data.message);
    }else{
      return callback(new Error(res.data.message));
    }
  })
  .catch(err =>{
    return callback(err);
  });
}

export function editTestOwner(jobName, body, callback){
  var endpoint = `/v1/testjob/editTestOwner/${jobName}`;
  var urladd = url.resolve(hostIP, endpoint);
  axios.post(urladd, body)
  .then(res=>{
    if(res.data.success){
      return callback(null, res.data.message);
    }else{
      return callback(new Error(res.data.message));
    }
  })
  .catch(err =>{
    return callback(err);
  });
}

export function editJobErrors(jobName, body, callback){
  var endpoint = `/v1/testjob/editJobErrors/${jobName}`;
  var urladd = url.resolve(hostIP, endpoint);
  axios.post(urladd, body)
  .then(res=>{
    if(res.data.success){
      return callback(null, res.data.message);
    }else{
      return callback(new Error(res.data.message));
    }
  })
  .catch(err =>{
    return callback(err);
  });
}


