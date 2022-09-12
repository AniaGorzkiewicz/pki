const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const User = require('../models/user');

module.exports = async function (_req, res, next) {
    user = await User.findUserById(res.locals.userId);
    if (user) {
        if(user.getIsAdmin()) return next();
    }
    res.status(403).send({ error: 'You are not admin.' });
}