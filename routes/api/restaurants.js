var express = require('express');
var router = express.Router();
var Place= require('../../models/place');

var Restaurant = require('../../models/restaurant');

router.get('/', function(req, res, next){
    Restaurant.findAll({
        include: [Place]
    })
    .then(function(restaurants){
        res.send(restaurants);
    })
    .catch(next);
})

module.exports = router;
