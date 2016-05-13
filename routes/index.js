var express = require('express');
var router = express.Router();
var apiRouter = require('./api');
var Hotel = require('../models/hotel');
var Restaurant = require('../models/restaurant');
var Activity = require('../models/activity');
var Place = require('../models/place');
var Promise = require('bluebird');

router.get('/', function (req, res, next) {
    res.render('index');
});

router.use('/api', apiRouter);

module.exports = router;
 