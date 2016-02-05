var bodyParser  = require('body-parser');
var User        = require('../models/user');
var jwt         = require('jsonwebtoken');
var config      = require('../../config');
var sendMail    = require('../helpers/emailHelper');
var verifyToken = require('../helpers/tokenHelper');
var superSecret = config.secret;


module.exports = function(app, express) {

	var userRouter = express.Router();

	userRouter.post('/login', function(req, res, next) {

	  // find the user
	  User.findOne({
	    username: req.body.username
	  }).select('name username password email _id').exec(function(err, user) {

	    if (err) next(err);

	    // no user with that username was found
	    if (!user) {
	      var notFound = new Error("Could not find user");
            notFound.status = 404;
            return next(notFound);
	    } else if (user) {

	      // check if password matches
	      var validPassword = user.comparePassword(req.body.password);
	      if (!validPassword) {
	        var notFound = new Error("Password and username doesn't match our records");
            notFound.status = 404;
            return next(notFound);
	      } else {
	        // if user is found and password is right
	        // create a token
	        var token = jwt.sign({
	        	name: user.name,
	        	username: user.username,
	        }, superSecret, {
	          expiresIn: 172800 // expires in 24 hours
	        });

	        // return the information including token as JSON
	        res.json({
	          success: true,
	          message: 'Enjoy your token!',
	          token: token,
	          id : user._id
	        });
	      }
	    }
	  });
	});

	// userRouter.post('/forgotPassword', function(req, res, next) {
	//
	//   // find the user
	//   User.findOne({
	//     email: req.body.email
	//   }).select('name username password _id').exec(function(err, user) {
	//
	//     if (err) next(err);
	//
	//     // no user with that username was found
	//     if (!user) {
	//       var notFound = new Error("Could not find user with the email address provided");
    //         notFound.status = 404;
    //         return next(notFound);
	//     } else if (user) {
	//
	//         // create a token
	//         var token = jwt.sign({
	//         	id: user._id
	//         }, superSecret, {
	//           expiresIn: 172800 // expires in 24 hours
	//         });
	//
	//         var email = "<p>Your password reset request from Food stuff.</p> \
	//         <p>Please go to " + config.appUrl + "/resetPassword/" + user._id + '/' + token + " to choose a new password</p>";
	//
	//         var response = sendMail(req.body.email, "Password Reset", email, email, "noreply@fake.com", "Food app" );
	//
	//         console.log("Password reset requested for user:" + user);
	//
	//         if(response){
	//         	var emailFailed = new Error("Something went wrong with the email server!");
	//         	console.log("Password reset email failed " + response);
	//
    //         emailFailed.status = 500;
    //         return next(emailFailed);
	//         }
	//         else{
	//         	response = "A link to reset your password has been sent to your email address.";
	//         }
	//         res.json({
	//           success: true,
	//           message: response
	//         });
	//
	//     }
	//
	//   });
	// });

	// route middleware to verify a token
	userRouter.use('/users', function(req, res, next) {
		verifyToken(req, res,next);
	});

	// test route to make sure everything is working
	// accessed at GET http://localhost:8080/api
	userRouter.get('/', function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });
	});

	// on routes that end in /users
	// ----------------------------------------------------
	userRouter.route('/users')

		// create a user (accessed at POST http://localhost:8080/users)
		.post(function(req, res, next) {

			var user = new User();		// create a new instance of the User model
			user.name = req.body.name;  // set the users name (comes from the request)
			user.username = req.body.username;  // set the users username (comes from the request)
			user.password = req.body.password;  // set the users password (comes from the request)
			user.email = req.body.email;

			console.log("Creating new user: " + user);

			user.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000){
              var userExists = new Error("The user with that username already exists!");
              userExists.status = 500;
              return next(userExists);
              }
					else
						return next(err);
				}
				// return a message
				res.json({ message: 'User created!' });
			});

		})

		.get(function(req, res, next) {

			User.find({}, function(err, users) {
				if (err) {
					return next(err);
				}
				// return the users
				res.json(users);
			});
		});

	userRouter.route('/users/:user_id')
		.get(function(req, res, next) {
			User.findById(req.params.user_id, function(err, user) {
			if(!user){
	            var notFound = new Error("User not found");
	            notFound.status = 404;
	            return next(notFound);
          }

         if (err) {
					next(err);
				}

				// return that user
				res.json(user);
			});
		})

		// update the user with this id
		.put(function(req, res, next) {
			User.findById(req.params.user_id, function(err, user) {

				if(err) {
            next(err);
         }

				// set the new user information if it exists in the request
				if (req.body.name) user.name = req.body.name;
				if (req.body.username) user.username = req.body.username;
				if (req.body.password) user.password = req.body.password;
				if (req.body.email) user.email = req.body.email;
				// save the user
				user.save(function(err) {
					if(err) {
		              next(err)
		           }
					res.json({ message: 'User updated!' });
				});

			});
		})
		.delete(function(req, res, next) {
			User.remove({
				_id: req.params.user_id
			}, function(err, user) {

        if(!user){
          var notFound = new Error("User not found");
          notFound.status = 404;
          return next(notFound);
        }

        if(err) {
            next(err);
         }
				res.json({ message: 'Successfully deleted' });
			});
		});
	// route middleware to verify a token
	userRouter.use('/me', function(req, res, next) {
		verifyToken(req, res, next);
	});
	// api endpoint to get user information
	userRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});

	return userRouter;
};
