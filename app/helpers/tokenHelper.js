
var jwt         = require('jsonwebtoken');
var config      = require('../../config');
var superSecret = config.secret;

function verifyToken(req, res, next){
      var token = req.body.token || req.query.token || req.headers['x-access-token'];
      if (token) {
        jwt.verify(token, superSecret, function(err, decoded) {

          if (err) {
            res.status(403).send({
              success: false,
              message: 'Failed to authenticate token.'
          });
          } else {
            req.decoded = decoded;
            next();
          }
        });

      } else {
        res.status(403).send({
          success: false,
          message: 'No token provided.'
        });
      }
}


module.exports = verifyToken;
