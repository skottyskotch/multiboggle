console.log('server starting');

var express = require('express');
var app = express();
var server = app.listen(3000);
app.use(express.static('website'));