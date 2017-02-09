'use strict';

// simple express server
var express = require('express');
var app = express();
var router = express.Router();

app.use(express.static('dist/dev'));
app.get('/**/*.*', function(req, res) {
    const srcpath = req.path.split('/')
    const file = srcpath[(srcpath.length - 1)]
    res.sendFile('./dist/dev/' + file , { root: __dirname });
});

app.get('/**/*', function(req, res) {
    res.sendFile('./dist/dev' + req.path + '/index.html', { root: __dirname });
});

app.get('/', function(req, res) {
    res.sendFile('./dist/dev/index.html', { root: __dirname });
});

app.listen(5000);
