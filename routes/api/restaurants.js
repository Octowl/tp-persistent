var express = require('express');
var router = express.Router();

var Restaurant = require('../../models/restaurant');

router.get('/', function(req, res, next){
    Restaurant.findAll()
    .then(function(restaurants){
        res.send(restaurants);
    })
    .catch(next);
})

module.exports = router;
