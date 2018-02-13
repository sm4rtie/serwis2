var keystone = require('keystone');
var Enquiry = keystone.list('Enquiry');
var Order = keystone.list('Order');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.filters = {
		users: req.params.users,
		orders: req.params.orders,
	};
	// Set locals
	locals.section = 'contact';
	locals.enquiryTypes = Enquiry.fields.enquiryType.ops;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;
	locals.user = req.user;

	view.on('init', function (next) {
		if (req.user.canAccessClients) { locals.loggedIn = false; }
		else if (!req.user.canAccessClients) { locals.loggedIn = true; }
		else locals.loggedIn = false;
		if (locals.loggedIn) {
			var q = Order.model.find().where('client', req.user.id);
		}
		q.exec(function (err, results) {
			locals.orders = results;
			console.log(locals.orders);
			next(err);
		});
	});

	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'contact' }, function (next) {

		var newEnquiry = new Enquiry.model();
		var updater = newEnquiry.getUpdateHandler(req);

		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, email, phone, enquiryType, orderId, message',
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

	view.render('contact');
};
