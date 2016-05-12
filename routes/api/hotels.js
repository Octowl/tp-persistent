var express = require('express');
var router = express.Router();

var Hotel = require('../../models/hotel');

router.get('/', function(req, res, next){
    Hotel.findAll()
    .then(function(hotels){
        res.send(hotels);
    })
    .catch(next);
})

module.exports = router;
