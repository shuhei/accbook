/* eslint-env node */
var express = require('express');

var port = process.env.PORT || 5000;
var app = express();
app.use(express.static('public'));

var server = app.listen(port, function() {
  var address = server.address();
  console.log('Listening on http://%s:%s', address.address, address.port);
});
