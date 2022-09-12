const pool = require("../db").default;
const Rent = require("../models/rent");

const index = async (req,res) => {
    const rentQuery = req.query;
    const page = rentQuery.page || 1;

    let rents = await Rent.all(page);

    res.send(rents)
}

const createRent = async (req,res) => {
    var newDate = new Date();

    const rentBody = req.body;
    const userId = res.locals.userId;
    const bookId = rentBody.bookId;
    const createdAt = newDate;

    var holdDate = new Date();
    const endAt = new Date(holdDate.setDate(newDate.getDate() + rentBody.duration));


    newRent = await Rent.createRent(userId, bookId, createdAt, endAt);
    res.send(newRent)
}

const deleteRent = async (req,res) => {
    const id = req.params.id;

    results = await Rent.deleteRent(id);
    res.send(results)
}

const updateRent = async (req,res) => {
    const id = req.params.id;
    
    results = await Rent.updateRent(id);
    res.status(200).send({message: results});
}

const myRents = async (req,res) => {
    const userId = res.locals.userId;
    const page = req.query.page || 1;

    newRent = await Rent.rentsForUser(userId, page);
    res.send(newRent)
}
module.exports = {
    index,
    createRent,
    updateRent,
    deleteRent,
    myRents
}