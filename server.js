console.log('server starting');
var express = require('express');
var app = express();
var server = app.listen(3000);
app.use(express.static('public'));

app.get('/', index);

function index(request, response){       
    response.sendFile('/public/index.html', {root: __dirname});
}