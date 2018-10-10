const express = require('express');
const app = express();

var body_parser = require('body-parser');

app.use(body_parser.json());

var routes = require('./routes');
app.use('/', routes);

module.exports = app;