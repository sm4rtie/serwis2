var keystone = require('keystone');
var Types = keystone.Field.Types;

var OrderContact = new keystone.List('OrderContact', {
	nocreate: true,
	noedit: true,
});

OrderContact.add({
	//name: { type: Types.Relationship, ref: 'User', many: false, required: false },
	//email: { type: Types.Relationship, ref: 'User', many: false, required: false },
  orderId: { type: Types.Relationship, ref: 'Order', many: false, required: false, initial:false },
	message: { type: Types.Markdown, required: true, initial:false },
	createdAt: { type: Date, default: Date.now },
	response: {type: Types.Textarea, initial: false},
	responseAt: { type: Date, default: Date.now },
	read: {type: Types.Boolean, default: false, initial: false},
	from: {type: Types.Email, initial: false}
});

OrderContact.schema.pre('save', function (next) {
	if(this.isModified('read')) return next();
	this.wasNew = this.isNew;
	next();
});

OrderContact.schema.post('save', function () {
	if (this.wasNew || this.isModified) {
		this.sendNotificationEmail();
	}

});

OrderContact.schema.methods.sendNotificationEmail = function (callback) {
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

	var orderContact = this;
	var brand = keystone.get('brand');

	//keystone.list('User').model.find().where('_id', req.user.id).exec(function (err, employee) {
	keystone.list('Order').model.findOne().where('_id', orderContact.orderId).exec(function (err, order) {
    if(err) return callback();
	keystone.list('User').model.findOne().where('_id', order.employee).exec(function (err, employee) {
    if(err) return callback();
		if (err) return callback(err);
		new keystone.Email({
			templateName: 'order_contact',
			transport: 'mailgun',
		}).send({
			to: 'marta.jareckaa@gmail.com' || employee.email,
			from: orderContact.from,
			subject: 'Asking about order',
			enquiry: orderContact,
			brand: brand,
		}, callback);
	});
});
};

OrderContact.defaultSort = '-createdAt';
OrderContact.defaultColumns = 'name, email, createdAt';
OrderContact.register();
