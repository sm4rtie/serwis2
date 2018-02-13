var keystone = require('keystone');
var Order = keystone.list('Order');
var User = keystone.list('User');


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

	if (req.user.canAccessClients) {
	// Render the view
  // view.on('get', function(next) {
		Order.model.find()
      .where('employee', req.user.id)
      .sort('-dateStart')
      .exec(function (err, posts) {
	console.log(req.user.id);

}); }

	view.on('init', function (next) {
		if (req.user.canAccessClients) {
			var q = Order.model.find().where('employee', req.user.id).sort('-dateStart');
		}
		else if (!req.user.canAccessClients) {
			var q = Order.model.find().where('client', req.user.id).sort('-dateStart');
			Order.model.find().where('client', req.user.id).sort('-dateStart');
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
	view.on('post', { action: 'account' }, function (next) {
		console.log(req.body.newPassword);
		var q = User.model.findOne().where('_id', req.user.id).exec(function (err, user) {
			if (user) {
				user._.password.compare(req.body.password, function (err, isMatch) {
					if (!err && isMatch) {
						if (req.body.newPassword === req.body.confirmPassword) {
							user.name.first = req.body.name;
							user.name.last = req.body.lastName;
							user.phone = req.body.phone;
							user.email = req.body.email;
							user.password = req.body.confirmPassword;
							user.save(function (err, bet) {
								if (err) {
									console.log(err);
								}
								console.log('saved bet: ', bet);
								return next();
							});
						}
						else {
							req.flash('error', 'The passwords do not match.');
							return next();
						}
					}
					else {
						req.flash('error', 'Given password is incorrect.');
						return next();
					}
				});
			}

			else {
				console.log('No such user');
				/* var updater = q.getUpdateHandler(req);
				updater.process(req.body, {
					flashErrors: true,
					fields: 'name, email, phone, newPassword',
					errorMessage: 'There was a problem updating your profile',
				}, function (err) {
					if (err) {
						locals.validationErrors = err.errors;
					} else {
						// locals.enquirySubmitted = true;
					}*/
				req.flash('error', 'The passwords do not match.');
				next();
			
				// });
			}
		});
		//return next();
	});

	// });
	view.render('profile');
};
