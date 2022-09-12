const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

module.exports = function (req, res, next) {
    const authHeader = req.headers['authorization']
    if (!authHeader) return res.status(403).send('Access Denied!, no token entered');
    try {
        const verified = jwt.verify(authHeader, process.env.TOKEN_SECRET);
        req.user = verified;
        var decoded = jwt.decode(authHeader, { complete: true });
        res.locals.userId = decoded.payload.id;
        next();
      } catch (err) {
        res.status(400).send({ error: 'auth failed, check headers!' });
      }
}