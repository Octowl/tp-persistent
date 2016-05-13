var express = require('express');
var router = express.Router();
var Day = require('../../models/day'); 
var Hotel = require('../../models/hotel');
var Restaurant = require('../../models/restaurant');
var Activity = require('../../models/activity');

router.param('id', function(req,res,next, id){
	Day.findById(id, {
		include: [Hotel, Restaurant, Activity]
	}) 
	.then(function(day){
		console.log(day);
		req.day= day; 
		next(); 
	})
	.catch(next); 

});

//return all days
router.get('/', function(req,res,next){
	Day.findAll()
	.then(function(days){
		res.send(days); 
	})
	.catch(next); 
});

//return a specific day
router.get('/:id', function(req, res, next){
	res.send(req.day);
});

//create and return new day
router.post('/', function(req,res,next){
	Day.create({
		num: req.body.num
	})
	.then(function(day){
		res.send(day); 
	})
	.catch(next);

});

//updates and returns a specific day
// router.put('/:id', function(req,res,next){

// });

// deletes a specific day
router.delete('/:id', function(req,res,next){
	req.day.destroy().
	then(function(){
		res.send("Deleted that bitch"); 
	})
	.catch(next); 

});

router.post('/:id/hotels', function(req, res, next){
	console.log(req.body);
	Hotel.findById(req.body.hotelId)
	.then(function(hotel) {
		return req.day.setHotel(hotel);
	})
	.then(function(day){
		res.send(day);
	})
	.catch(next);
});

router.post('/:id/restaurants', function(req, res, next){
	Restaurant.findById(req.body.restaurantId)
	.then(function(restaurant) {
		return req.day.addRestaurant(restaurant);
	})
	.then(function(day){
		res.send(day);
	})
	.catch(next);
});

router.post('/:id/activities', function(req, res, next){
	Activity.findById(req.body.activityId)
	.then(function(activity) {
		return req.day.addActivity(activity);
	})
	.then(function(day){
		res.send(day);
	})
	.catch(next);
});

router.delete('/:id/hotels/:hotelId', function(){

});

router.delete('/:id/restaurants/:restaurantId', function(){

});

router.delete('/:id/activities/:activityId', function(){

});

module.exports= router; 
 
 //*****Router.params *********
