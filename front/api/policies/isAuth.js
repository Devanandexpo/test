var jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  var bearerToken;
  var bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== 'undefined') {
    // console.log(bearerHeader,'bearerHeader');
    var bearer = bearerHeader.split(" ");
    // console.log(bearer);
    bearerToken = bearer[1];

    // if (bearer[0] !== "Bearer") {
    //   return res.forbidden("bearer not understood");
    // }

    // console.log(bearerToken,"mytoken");
    //verify if this token was from us or not
    jwt.verify(bearerHeader, env2.DB_TOKEN_KEY, function (err, decoded) {
      if (err) {
        sails.log("verification error", err);
        if (err.name === "TokenExpiredError")
          return res.forbidden("Session timed out, please login again");
        else
          return res.forbidden("Error authenticating, please login again");
      }
    console.log(decoded.userid,'decoded');
    console.log(req.session.userid,'req');
    if(decoded.userid==req.session.userid) {
        req.user = decoded;
        next();
    }
    else {
        return res.forbidden("Error authenticating, please login again");
    }
    //   Chatbotuser.findOne({email:decoded.email}).exec(function callback(error, user) {
    //     if (error) return res.serverError(err);

    //     if (!user) return res.serverError("User not found");

    //     req.user = user;
    //     next();
    //   });

    });

  } 
  else {
    return res.forbidden("No token provided");
  }

};
