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

	// locals.section is used to set the currently selected
	// item in the header navigation.
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
/*view.on('get', function(next){
  if (req.user.canAccessClients) {
    var q = User.model.find()
      .where('isAdmin' || 'isEmployee', false)
      .exec(function (err, users) {
    console.log(users);
    return res.json(users);

});
}
});*/

view.on('post', { action: 'newUser' }, function (next) {
  //var q = Order.model.findOne().where('_id', req.user.id);
  var UserNew = new User.model();
  //newOrderContact.set({email: 'res.locals.user.email', name: 'res.locals.user.name.first'});
  //newOrderContact._req_user = req.user;
var updater = UserNew.getUpdateHandler(req);
//console.log(req);
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
