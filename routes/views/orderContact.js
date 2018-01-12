var keystone = require('keystone');
var OrderContact = keystone.list('OrderContact');
var Order = keystone.list('Order');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	//console.log(req);
	locals.userEmail = req.user.email;
	locals.section = 'order';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;

	view.on('init', function(next){
		var q = Order.model.findOne().where('_id', req.body.orderId);

		q.exec(function (err, results) {
			locals.employee = results;
			next(err);
		});
	});
	view.on('post', { action: 'order' }, function (next) {
		//var q = Order.model.findOne().where('_id', req.user.id);
		var newOrderContact = new OrderContact.model();
		//newOrderContact.set({email: 'res.locals.user.email', name: 'res.locals.user.name.first'});
		//newOrderContact._req_user = req.user;
		console.log(req.body);
var updater = newOrderContact.getUpdateHandler(req);
//console.log(req);
		updater.process(req.body, {
			flashErrors: true,
			fields: 'message, email',
			errorMessage: 'There was a problem submitting your enquiry:',

		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.enquirySubmitted = true;
			}
			next();

			//newOrderContact.save();
		});

	});

	view.render('order');
};
