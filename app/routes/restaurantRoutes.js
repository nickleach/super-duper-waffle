var bodyParser  = require('body-parser');
var Restaurant  = require('../models/restaurant');
var jwt         = require('jsonwebtoken');
var config      = require('../../config');
var verifyToken = require('../helpers/tokenHelper');
var superSecret = config.secret;

module.exports = function(app, express){
  var restaurantRouter = express.Router();

  restaurantRouter.use('/restaurants', function(req, res, next) {
    verifyToken(req, res, next);
  });

  restaurantRouter.route('/restaurants')
    .get(function(req, res, next){
      Restaurant.find(function(err, restaurants){
        if(err){
          return next(err);
        }
        res.json(restaurants)
      })
    })
    .post(function(req, res, next){
      var restaurant = new restaurant();
      restaurant.name = req.body.name;
      restaurant.description = req.body.description;
      restaurant.type = req.body.type;
      restaurant.location = req.body.location;

      console.log("Making new restaurant " + restaurant);

      restaurant.save(function(err){
        if(err){
          return next(err);
        }
        console.log("restaurant created!");

        res.json({
          message: "Restaurant Saved!",
          created: restaurant
        });
      })
    });
  restaurantRouter.route('/restaurants/:restaurant_id')
      .get(function(req, res, next) {
        Restaurant.findById(req.params.restaurant_id, function(err, restaurant) {


          if(!restaurant){
              var notFound = new Error("restaurant not found");
              notFound.status = 404;
              return next(notFound);
            }

           if (err) {
            next(err);
          }

          res.json(restaurant);
        });
      });

  restaurantRouter.use('/restaurants/:restaurant_id', function(req, res, next) {
    verifyToken(req, res, next);
  });
  restaurantRouter.route('/restaurants/:restaurant_id')

    .put(function(req, res, next) {
      Restaurant.findById(req.params.restaurant_id, function(err, restaurant) {
        if(err) {
            next(err);
         }
        if (req.body.name) restaurant.restaurant = req.body.name;
        if (req.body.description) restaurant.description = req.body.description;
        if (req.body.type) restaurant.type = req.body.type;
        if (req.body.location) restaurant.location = req.body.location;
        restaurant.save(function(err) {
          if(err) {
              next(err)
           }
          res.json({ message: 'restaurant updated!' });
        });

      });
    })
    .delete(function(req, res, next) {
      Restaurant.remove({
        _id: req.params.restaurant_id
      }, function(err, restaurant) {

        if(!restaurant){
          var notFound = new Error("restaurant not found");
          notFound.status = 404;
          return next(notFound);
        }

        if(err) {
            next(err);
         }


        res.json({ message: 'Successfully deleted' });
      });
    });

  return restaurantRouter;
}
