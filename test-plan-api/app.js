'use strict';

var SwaggerExpress = require('swagger-express-mw');
const {Connection }= require("./api/dbConnection/connection");
var app = require('express')();
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10011;
  Connection.connectToMongo(app.listen(port));
  console.log(`Your app is listening on port ${port}`)
});
