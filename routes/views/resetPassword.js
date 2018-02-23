var keystone = require('keystone');
var User = keystone.list('User');


exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'reset-password';

	view.on('post', { action: 'reset-password' }, function (next) {
		console.log(req.body.newPassword);
		var q = User.model.findOne().where('email', req.body.email).exec(function (err, user) {
			if (user) {
        if(req.params.resetTokenKey===user.resetTokenKey) {
						if (req.body.password === req.body.newPassword) {
							user.password = req.body.password;
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
	view.render('reset-password');
};
