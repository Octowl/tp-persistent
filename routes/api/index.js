var express = require('express');
var router = express.Router();
var hotelsRouter = require('./hotels');
var restaurantsRouter = require('./restaurants');
var activitiesRouter = require('./activities');

var Promise = require('bluebird');

router.use('/hotels', hotelsRouter);
router.use('/restaurants', restaurantsRouter);
router.use('/activities', activitiesRouter);

module.exports = router;
