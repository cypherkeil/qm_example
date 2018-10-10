var express = require('express');
var router = express.Router();
var path = require('path')

// serve React frontend
router.use('/', express.static(path.resolve('./client/build')))

// API to convert clauses to sql
var sql_routes = require('./sql');
router.use('/', sql_routes);

module.exports = router;