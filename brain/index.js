var express = require('express');
var app  = express();

app.use('/', express.static('./public'));

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var events = require('events');

require('./motor')(io.of('/motor'));
require('./sensory')(io.of('/sensory'));

server.listen(9000);
