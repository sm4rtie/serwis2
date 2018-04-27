var keystone = require('keystone'),
    async = require('async');


exports = module.exports = function(req, res) {

    if(req.user) {
        return res.redirect('/profile')
    }

    var locals = res.locals,
        view = new keystone.View(req, res);

    // Set locals
    locals.section = 'session';

    //Set form
    locals.form = req.body;


    view.on('post', { action: 'signin' }, function(next) {

        if (!req.body.signin_email || !req.body.signin_password) {
            req.flash('error', 'Please enter your username and password.');
            return next();
        }

        var onSuccess = function() {
            if (req.query && req.query.from) {
                res.redirect(req.query.from);
            } else {
                res.redirect('/');
            }
        }

        var onFail = function() {
            req.flash('error', 'Your username or password were incorrect, please try again.');
            return next();
        }

        keystone.session.signin({ email: req.body.signin_email, password: req.body.signin_password }, req, res, onSuccess, onFail);

    });
    view.on('post', { action: 'forgottenPassword' }, function(next) {
      if (typeof callback !== 'function') {
        callback = function (err) {
          if (err) {
            console.error('There was an error sending the notification email:', err);
          }
        };
      }
    	keystone.list('User').model.findOne().where('email', req.body.forgottenEmail).exec(function (err, user) {
    		if (err) return callback(err);
    		new keystone.Email({
    			templateName: 'reset_password',
    			transport: 'mailgun',
    		}).send({
    			to: 'marta.jareckaa@gmail.com' || employee.email,
    			from: 'noreply@serwis.com',
    			subject: 'Asking about order',
    			enquiry: user,
    		}, callback);
    	});
    res.redirect('/signin');
    });

    // Render the view
    view.render('session/signin');
}
