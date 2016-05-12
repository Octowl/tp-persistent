var express = require('express');
var router = express.Router();
var Place= require('../../models/place');

var Activity = require('../../models/activity');

router.get('/', function(req, res, next){
    Activity.findAll({
        include: [Place]
    })
    .then(function(activities){
        res.send(activities);
    })
    .catch(next);
})

module.exports = router;
