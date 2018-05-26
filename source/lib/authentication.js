const jwt = require('jsonwebtoken');

const key = process.env.KEY || "catsanddogs123";

function genToken(username){
  return new Promise((resolve, reject) => {
    const payload = {sub: username};
    jwt.sign(payload, key, { expiresIn: '3h' }, function (err, token) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}

function requireAuthentication(req, res, next){
  const authHeader = req.get('Authorization') || '';
  const authHeaderParts = authHeader.split(' ');
  const token = null;

  if(authHeaderParts[0] === 'Bearer'){
    token = authHeaderParts[1];
  }

  jwt.verify(token, key, function (err, payload) {
    if (!err) {
      req.user = payload.sub;
      next();
    } else {
      res.status(401).json({
        error: "Invalid authentication token"
      });
    }
});
}

exports.genToken = genToken;
exports.requireAuthentication = requireAuthentication;
