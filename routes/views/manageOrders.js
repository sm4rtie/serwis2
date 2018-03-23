var keystone = require('keystone');
var OrderDetails = keystone.list('OrderDetails');
var Order = keystone.list('Order');
var User = keystone.list('User');


exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.filters = {
		users: req.params.users,
		orders: req.params.orders,
    employee: req.params.employee,
	};
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'orders';
  locals.formData = req.body || {};
  locals.validationErrors = {};
  locals.states = Order.fields.state.ops;
  var q = Order.model.find()
    .where('employee', req.user.id)
    .sort('-dateStart')
    .exec(function (err, results) {
  locals.orders = results;
});
	view.on('init', function (next) {
    console.log("INIT");
        locals.employee = req.user.id;
			var q = Order.model.find()
        .where('employee', req.user.id)
        .sort('-dateStart')
        .exec(function (err, results) {
			locals.orders = results;
      User.model.find().where('isEmployee' || 'isAdmin', false).exec(function (err, users) {
        locals.users = users;
        next(err);
      });
	});
});

view.on('post', { action: 'newOrder' }, function (next) {
  //var q = Order.model.findOne().where('_id', req.user.id);
  var newOrder = new Order.model();
  //newOrderContact.set({email: 'res.locals.user.email', name: 'res.locals.user.name.first'});
  //newOrderContact._req_user = req.user;
var updater = newOrder.getUpdateHandler(req);
console.log(req.body);
  updater.process(req.body, {
    flashErrors: true,
    fields: 'client, product, damage, employee',
    errorMessage: 'There was a problem creating order:',

  }, function (err) {
    if (err) {
      locals.validationErrors = err.errors;
    }
    next();
  });
  //res.redirect('orders');

});

  	view.render('manage/orders');
  };
