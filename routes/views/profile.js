var keystone = require('keystone');
var	async = require('async');
var Order = keystone.list('Order');
var User = keystone.list('User');
var express = require('express');
var app = express();

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
		locals.filters = {
			users: req.params.users,
			orders: req.params.orders,
	};
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'profile';

if(req.user.canAccessClients)
	// Render the view
  //view.on('get', function(next) {
	    Order.model.find()
      .where('employee', req.user.id)
      .sort('-dateStart')
      .exec(function(err, posts) {
        console.log(req.user.id);

});

view.on('init', function (next) {
if(req.user.canAccessClients) {
		var q = Order.model.find().where('employee', req.user.id).sort('-dateStart');
}
else if (!req.user.canAccessClients) {
	var q = Order.model.find().where('client', req.user.id).sort('-dateStart');
}
		q.exec(function (err, results) {
			locals.orders = results;
			next(err);
		});

});

view.on('init', function (next) {

		var q = User.model.findOne().where('_id', req.user.id);

		q.exec(function (err, results) {
			locals.users = results;
			next(err);
		});

});

	//});
	view.render('profile');
};
