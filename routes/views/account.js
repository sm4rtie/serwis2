var keystone = require('keystone');
var User = keystone.list('User');

exports = module.exports = function (req, res) {


		var view = new keystone.View(req, res);
		var locals = res.locals;
		locals.filters = {
			users: req.params.users,

		};
		locals.section = 'account';

	view.on('init', function (next) {
		console.log(req.user.id);
		var q = User.model.findOne().where('_id', req.user.id);

		q.exec(function (err, results) {
			locals.users = results;
			next(err);
		});

	});
	view.on('post', { action: 'account' }, function (next) {
		var q = User.model.findOne().where('_id', req.user.id).exec(function (err, user) {
			if (user) {
				user._.password.compare(req.body.password, function (err, isMatch) {
					if (!err && isMatch) {
						if (req.body.newPassword === req.body.confirmPassword) {
							user.name.first = req.body.name;
							user.name.last = req.body.lastName;
							user.phone = req.body.phone;
							user.streetAddress = req.body.streetAddress;
							user.city = req.body.city;
							user.zipCode = req.body.zipCode;
							user.email = req.body.email;
							user.password = req.body.confirmPassword;
							user.save(function (err, bet) {
								if (err) {
									console.log(err);
								}
								console.log('saved bet aa: ', bet);
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

				req.flash('error', 'The passwords do not match.');
				next();
			}
		});
	});
	view.render('account');

};
