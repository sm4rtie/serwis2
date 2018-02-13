var keystone = require('keystone');
var User = keystone.List('User');


exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.section = 'account';
	locals.userData;
	var locals = res.locals;
	locals.filters = {
		users: req.user,
	};
	locals.formData = req.body || {};
	locals.validationErrors = {};

	view.on('init', function (next) {
		/*console.log(req.user);

		var q = User.model.findOne().where('_id', req.user._id);

		q.exec(function (err, results) {
			locals.userData = results;
			next(err);
		});*/
	});
	view.on('post', { action: 'account' }, function (next) {
		if (!req.body.password || !req.body.password_confirm) {
			req.flash('error', 'Please enter, and confirm your new password.');
			return next();
		}

		if (req.body.newPassword != req.body.confirmNewPassword) {
			req.flash('error', 'Please make sure both passwords match.');
			return next();
		}

		locals.found.password = req.body.password;
		locals.found.resetPasswordKey = '';
		locals.found.save(function (err) {
			if (err) return next(err);
			req.flash('success', 'Your password has been reset, please sign in.');
			res.redirect('/signin');
		});

	});
	view.render('account');

};
