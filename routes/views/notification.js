var keystone = require('keystone');
var OrderContact = keystone.list('OrderContact');
var User = keystone.list('User');
var Order = keystone.list('Order');


exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.filters = {
		mail: req.params.mail,
    previous: req.params.previous,
	};
  locals.validationErrors = {};
  locals.formData = req.body || {};

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'manage';
  var ids = [];
	view.on('init', function (next) {

		if (req.user.canAccessClients) {
      console.log("ID: " + req.params.notificationId);
      var x = OrderContact.model.findOne()
      .where('_id', req.params.notificationId)
      .exec(function(err, mail){
        locals.mail = mail;
        if(!mail.read) {
        mail.update({'read': true},{upsert: true},function(err,updMail){
    if(err) return next(err);
    console.log('Upd: ' + updMail)

});
      }
      OrderContact.model.find().where('orderId', mail.orderId).where({ "_id": { "$ne": req.params.notificationId }}).sort('-createdAt').exec(function(err, previousContacts) {
        locals.previous = previousContacts;
          next(err);
      })

        });
}
});
view.on('post', { action: 'reply' }, function (next) {
  var q = OrderContact.model.findOne().where('_id', req.params.notificationId).exec(function (err, contact) {
            contact.response = req.body.response;
            contact.save(function (err, bet) {
              if (err) {
                console.log(err);
                req.flash('error', 'Error!');
              }
            });
            req.flash('success', 'Updated!');
          });

      next();

  });
  	view.render('manage/notification');
  };
