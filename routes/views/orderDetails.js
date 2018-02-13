var keystone = require('keystone');
var OrderDetails = keystone.list('OrderDetails');
var Order = keystone.list('Order');
var OrderContact = keystone.list('OrderContact');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	//console.log(req);
	locals.userEmail = req.user.email;
	locals.section = 'details';
	locals.formData = req.body || {};
	locals.validationErrors = {};
  locals.filters = {
    details: req.params.details,
  };
  locals.user = req.user;


	view.on('init', function(next){
		//var q = Order.model.findOne().where('_id', req.body.orderId);
    var z = OrderDetails.model.find().where('orderId', req.params.orderId);
		z.exec(function (err, results) {
			locals.details = results;
			if(err) return res.status(404).send(keystone.wrapHTMLError('Sorry, no details yet(404)'));
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
			fields: 'message, orderId',
			errorMessage: 'There was a problem submitting your enquiry:',

		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
			} //else {
				//locals.enquirySubmitted = true;
			//}
			next();

			//newOrderContact.save();
		});

	});
			//newOrderContact.save();;
	view.render('details');
};
