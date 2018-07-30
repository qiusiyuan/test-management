'use strict';

const configs = require('./config.json');
const path = require('path');

module.exports.getconfig = function () {
  configs.homeDir = process.env.HOME_DIR || configs.homeDir;
  configs.mondbBaseUrl = process.env.mondbBaseUrl || configs.mondbBaseUrl;
  configs.database = process.env.database || configs.database;
  configs.job = process.env.job || configs.job;
  configs.suite = process.env.suite || configs.suite;
  configs.jobDir = path.join(configs.homeDir, configs.job)
  configs.suiteDir = path.join(configs.homeDir, configs.suite)
  return configs;
};