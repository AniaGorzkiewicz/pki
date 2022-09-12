const pool = require("../db").default;
const Book = require("../models/book");

const index = async (req,res) => {
    const description = req.query;
    const category = description.category || null;
    const title = description.title || null;
    const page = description.page || 1;

    // let books = null;
    // if (category) {
    //     books = await Book.booksByCategory(category, page);
    // } else if (title) {
    //     books = await Book.booksByTitle(title, page);
    // } else {
    //     books = await Book.all(title, category, page);
    // }
    const books = await Book.all(title, category, page);
    console.log(books);
    res.send(books)
}

const createBook = async (req,res) => {
    const description = req.body;
    const title = description.title;
    const bookDescription = description.description;
    const category = description.category;

    newBook = await Book.createBook(title, bookDescription, category);
    res.send(newBook)
}

const deleteBook = async (req,res) => {
    const id = req.params.id;

    results = await Book.deleteBook(id);
    
    if(!results || results === undefined) return res.status(400).send({message: "Book is currently rented!"});
    res.status(200);
}

module.exports = {
    index,
    createBook,
    deleteBook
}