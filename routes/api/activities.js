var express = require('express');
var router = express.Router();

var Activity = require('../../models/activity');

router.get('/', function(req, res, next){
    Activity.findAll()
    .then(function(activities){
        res.send(activities);
    })
    .catch(next);
})

module.exports = router;
