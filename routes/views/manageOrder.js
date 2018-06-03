var keystone = require('keystone');
var OrderDetails = keystone.list('OrderDetails');
var Order = keystone.list('Order');
var User = keystone.list('User');


exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.filters = {
		user: req.params.user,
		order: req.params.order,
    details: req.params.details,
	};
  locals.client;
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'manage';
  locals.states = Order.fields.state.ops;
  locals.statesDetails = OrderDetails.fields.state.ops;

	locals.formData = req.body || {};
	locals.validationErrors = {};
	view.on('init', function (next) {
		if (req.user.canAccessClients) {
			var q = Order.model.findOne()
        .where('_id', req.params.orderId)
        .exec(function (err, results) {
        locals.order = results;
        var client = results.client;
        OrderDetails.model.find()
          .where('orderId', req.params.orderId)
          .exec(function (err, details) {
            locals.details = details;
            User.model.findOne()
              .where('_id', client)
              .exec(function (err, user) {
                locals.user = user;
        next(err);

    });
  });

});
}
});

view.on('post', { action: 'orderUpdate' }, function (next) {
  var q = Order.model.findOne().where('_id', req.params.orderId).exec(function (err, order) {
            order.state = req.body.status;
            order.product = req.body.product;
            order.damage = req.body.damage;
            order.save(function (err, bet) {
              if (err) {
                console.log(err);
                req.flash('error', 'Error!');
              }
              console.log('saved bet: ', bet);
            });
          });
          req.flash('success', 'Updated!');
      next();

  });
  view.on('post', { action: 'newOrderDetails' }, function (next) {
    var Details = new OrderDetails.model();
  var updater = Details.getUpdateHandler(req);
    updater.process(req.body, {
      flashErrors: true,
      fields: 'date, state, city, comment, orderId, version ',
      errorMessage: 'There was a problem creating details:',

    }, function (err) {
      if (err) {
        locals.validationErrors = err.errors;
      }
      next();
    });

    });

  	view.render('manage/order');
  };
