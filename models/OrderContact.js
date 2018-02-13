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
});

OrderContact.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	this.name = this._req_user.name;
	this.email = this._req_user.email;
	next();
});

OrderContact.schema.post('save', function () {
	if (this.wasNew) {
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
	keystone.list('User').model.find().where('isAdmin', true).exec(function (err, employee) {
		if (err) return callback(err);
		new keystone.Email({
			templateName: 'order_contact',
			transport: 'mailgun',
		}).send({
			to: 'marta.jareckaa@gmail.com',
			from: {
				name: 'Serwis',
				email: 'contact@serwis.com',
			},
			subject: 'Asking about order',
			enquiry: orderContact,
			brand: brand,
		}, callback);
	});
};

OrderContact.defaultSort = '-createdAt';
OrderContact.defaultColumns = 'name, email, createdAt';
OrderContact.register();
