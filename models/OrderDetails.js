var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Employee Model
 * ==========
 */
var OrderDetails = new keystone.List('OrderDetails');

OrderDetails.add({
  orderId: {type: Types.Relationship, ref: 'Order', refPath: '_id', many: false, initial: true},
	date: { type: Date, default: Date.now, initial: true },
  state: { type: Types.Select, options: 'Admitted, Local repair, Decision to send to producent, In transit to producent, Warrancy repair, Refusal, In transit to service, Ready for receipt', required: true, initial:true, },
  city: {type: String, initial: true},
  comment: {type: Types.Textarea, default: 'n/c', initial: true},
  version: {type: Types.Number, default: 1, initial: true}
});
/*OrderDetails.schema.virtual('url').get(function() {
  return '/details/' + this.orderId;
});*/

OrderDetails.schema.pre('save', function(next) {
  this.wasNew = this.isNew;
  var version;
  var spec = this;
  var q = OrderDetails.model.findOne().where('orderId', this.orderId).sort('-version');
  q.exec(function (err, results) {
    if(err) { console.log("Error creating orderDetail" + err); return next(err);  }
    if(!results) { console.log("!res"); spec.version=1; return next(); }
    //locals.details = results;
    version = results.version + 1;
    spec.version = version;
    console.log("v" + version);
    next();
  });

});
OrderDetails.schema.post('save', function () {
	if (this.wasNew) {
		this.sendNotificationEmail();
	}
});

OrderDetails.schema.methods.sendNotificationEmail = function (callback) {
	if (typeof callback !== 'function') {
		callback = function (err) {
			if (err) {
				console.error('There was an error sending the notification email:', err);
			}
		};
	}

	if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
		console.log('Unable to send email - no mailgun credentials provided');
		return callback(new Error('could not find mailgun credentials'));
	}

	var orderDetails = this;
	var brand = keystone.get('brand');

	//keystone.list('User').model.find().where('_id', req.user.id).exec(function (err, employee) {

	new keystone.Email({
			templateName: 'order_detail',
			transport: 'mailgun',
		}).send({
			to: 'marta.jareckaa@gmail.com',
			from: {
				name: 'Serwis',
				email: 'contact@serwis.com',
			},
			subject: 'Asking about order',
			enquiry: orderDetails,
			brand: brand,
		}, callback);
};

OrderDetails.defaultSort = ('-version');
OrderDetails.register();
