var keystone = require('keystone');
var OrderContact = keystone.list('OrderContact');
var User = keystone.list('User');

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.filters = {
		users: req.params.users,
	};
  locals.validationErrors = {};
  locals.formData = req.body || {};

	locals.section = 'manage';

	view.on('init', function (next) {
		if (req.user.canAccessClients) {
			var q = User.model.find()
        .where('isAdmin' && 'isEmployee', false)
        .exec(function (err, users) {
			locals.users = users;
			next(err);

	});
}
});

view.on('post', { action: 'newUser' }, function (next) {
  var UserNew = new User.model();
var updater = UserNew.getUpdateHandler(req);
  updater.process(req.body, {
    flashErrors: true,
    fields: 'name, password, email, phone, streetAddress, city, zipCode',
    errorMessage: 'There was a problem creating user:',

  }, function (err) {
    if (err) {
      locals.validationErrors = err.errors;
    }
    next();

  });

});
  	view.render('manage/users');
  };
