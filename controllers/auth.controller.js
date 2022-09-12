const pool = require("../db").default;
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signIn = async (req,res) => {
    const description = req.body;
    const email = description.email;
    const password = description.password;

    const user = await User.findUser(email, password);
    if(!user) {
        res.status(404);
        res.send({ message: `User not found!`} );
        return;
    }
    const user_id = user.getUserId();


    const accessToken = jwt.sign({id: user_id},process.env.TOKEN_SECRET, { expiresIn: '1d' })
    res.send({accessToken})
}

const signUp = async (req,res) => {
    const description = req.body;
    const username = description.username;
    const password = description.password;
    const lastname = description.lastname;
    const name = description.name;
    const email = description.email

    await bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
            return res.status(500).json({ error: err });
        } else {
            newUser = await User.createUser(username, name, lastname, email, hash);
            if(!newUser) {
                res.status(400);
                res.send({ message: `User cannot be created!`} );
                return;
            }
            const user_id = newUser.getUserId();

            const accessToken = jwt.sign({id: user_id}, process.env.TOKEN_SECRET, { expiresIn: '1d' })
            console.log(accessToken);
            res.status(201);
            res.send({accessToken})
        }
    })
}

const me = async (req, res) => {
    const userId = res.locals.userId;

    newRent = await User.findUserById(userId);
    res.send(newRent)
}

module.exports = {
    signIn,
    signUp,
    me
}