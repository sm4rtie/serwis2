var keystone = require('keystone');
var Types = keystone.Field.Types;


/**
 * User Model
 * ==========
 */
var User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	resetPasswordKey: { type: String }

}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true, default: false },
	isEmployee: { type: Boolean, label: 'Can access Clients', default: false },

	//isClient: { type: Boolean, label: 'Can access Dashboard' },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});

User.schema.virtual('canAccessClients').get(function() {
	return this.isAdmin || this.isEmployee;
});
/*User.schema.virtual('canAccessProfile').get(function() {
	return this.isClient;
});*/
User.schema.pre('save', function(next) {
		this.wasNew = this.isNew;
  var user = this;
  user.resetPasswordKey = keystone.utils.randomString([16,24]);
    next();
  });

/*User.schema.pre('save', function (next) {
	console.log(token);
	console.log('GOING NEXT');
	this.wasNew = this.isNew;
	next();

});*/
User.schema.post('save', function () {
	if(this.wasNew || this.isModified) {
		this.sendNotificationEmail();
	}
});

User.schema.methods.sendNotificationEmail = function (callback) {
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

	var user = this;
	var brand = keystone.get('brand');

	//keystone.list('User').model.find().where('_id', req.user.id).exec(function (err, employee) {
	keystone.list('User').model.find().where('isAdmin', true).exec(function (err, employee) {
		if (err) return callback(err);
		new keystone.Email({
			templateName: 'reset_password',
			transport: 'mailgun',
		}).send({
			to: 'marta.jareckaa@gmail.com',
			from: {
				name: 'Serwis',
				email: 'contact@serwis.com',
			},
			subject: 'Asking about order',
			enquiry: user,
			brand: brand,
		}, callback);
	});
}


/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin, isEmployee';
User.register();
