var express = require('express');
var router = express.Router();
var Place= require('../../models/place');

var Hotel = require('../../models/hotel');

router.get('/', function(req, res, next){
    Hotel.findAll({
        include: [Place]
    })
    .then(function(hotels){
        res.send(hotels);
    })
    .catch(next);
})

module.exports = router;  
