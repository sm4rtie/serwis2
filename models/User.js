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
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
	isEmployee: { type: Boolean, label: 'Can access Clients'},
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


/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin, isEmployee';
User.register();
