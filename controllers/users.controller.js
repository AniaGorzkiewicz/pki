const pool = require("../db").default;
const User = require("../models/user");

const index = async (req,res) => {
    const page = req.query.page || 1;

    const users = await User.all(page);
    res.send(users)
}

const deleteUser = async (req,res) => {
    const id = req.params.id;

    results = await User.deleteUser(id);
    res.send(results);
}

const adminUpdateUser = async (req,res) => {
    const id = req.params.id;
    const requestBody = req.body;
    const isActive = requestBody.is_active;
    const isAdmin = requestBody.is_admin;

    results = await User.adminUserUpdate(id, isAdmin, isActive);
    if(!results) {
        res.status(400).send({'message': 'Could not update user'});
    } else {
        res.send({"message": results})
    }
}

module.exports = {
    index,
    deleteUser,
    adminUpdateUser
}