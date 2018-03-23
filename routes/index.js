/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.get('/', routes.views.index);
	app.all('/contact', routes.views.contact);
	app.all('/warrancies', middleware.requireUser, routes.views.profile);
	//app.all('/:order', middleware.requireUser, routes.views.orderContact);
	app.all('/account', middleware.requireUser, routes.views.account);
	//app.use('/auth/', forgottenPassword); // routes are mounted on /auth/ auth/forgot, auth/change-password will be added
	app.all('/details/:orderId', middleware.requireUser, routes.views.orderDetails);
	app.all('/manage/orders', middleware.requireEmployee, routes.views.manageOrders);
	app.all('/manage/orders/:orderId', middleware.requireEmployee, routes.views.manageOrder);
	app.all('/manage/users', middleware.requireEmployee, routes.views.manageUsers);
	//app.get('/manage/users/clients', middleware.requireEmployee, routes.views.manageUsers.getClients);

	app.all('/manage/notifications', middleware.requireEmployee, routes.views.notifications);
	app.post('/manage/notifications', middleware.requireEmployee, routes.views.notifications);
	app.all('/manage/notification/:notificationId', middleware.requireEmployee, routes.views.notification);
	app.all('/reset-password/:resetPasswordKey', routes.views.resetPassword);
	app.all('/profile', middleware.requireUser, routes.views.account);
	//app.post('/details/:orderId', middleware.requireUser, routes.views.orderContact);


	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
