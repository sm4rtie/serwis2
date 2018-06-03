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
		var newOrderContact = new OrderContact.model();

		console.log('ordercnt');
var updater = newOrderContact.getUpdateHandler(req);

		updater.process(req.body, {
			flashErrors: true,
			fields: 'message, orderId, from',
			errorMessage: 'There was a problem submitting your enquiry:',

		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.enquirySubmitted = true;
			}
			next();

		});

	});

	view.render('order');
};
