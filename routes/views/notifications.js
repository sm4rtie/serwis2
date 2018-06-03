var keystone = require('keystone');
var OrderContact = keystone.list('OrderContact');
var User = keystone.list('User');
var Order = keystone.list('Order');


exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.filters = {
		users: req.params.users,
    orders: req.params.orders,
    contacts: req.params.contacts,
	};
  locals.validationErrors = {};
  locals.formData = req.body || {};

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'manage';
  var ids = [];
	view.on('init', function (next) {

		if (req.user.canAccessClients) {
      var x = Order.model.find()
      .where('employee', req.user.id)
      .exec(function(err, orders){
        locals.orders = orders;
        let v;
        for (v of Object.values(locals.orders)){
           ids.push(v._id);
         }

        var y = OrderContact.model.find()
                .where('orderId')
        .in(ids)
        .sort('-createdAt')
        .exec(function(err, contacts){
          locals.contacts = contacts;
          next(err);
        });
	});
}
});
view.on('post', { action: 'newUser' }, function (next) {
  var UserNew = new User.model();

var updater = UserNew.getUpdateHandler(req);

  updater.process(req.body, {
    flashErrors: true,
    fields: 'name, password, email',
    errorMessage: 'There was a problem creating user:',

  }, function (err) {
    if (err) {
      locals.validationErrors = err.errors;
    }
    next();

  });

});
view.on('post', { action: 'getUnread' }, function (next) {
  var count;
  var x = Order.model.find()
  .where('employee', req.user.id)
  .exec(function(err, orders){
    locals.orders = orders;
    let v;
    for (v of Object.values(locals.orders)){
       ids.push(v._id);
     }

    var y = OrderContact.model.find()
    .where('orderId')
    .in(ids)
    .where('read', false);

    y.count(function(err, count){
      console.log(count);
      return res.json(JSON.parse(count));
    });

});

});
  	view.render('manage/notifications');
  };
