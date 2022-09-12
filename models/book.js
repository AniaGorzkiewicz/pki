const { query } = require("express");
const pool = require("../db");

class Book {
    static pageLimit = 10;

    constructor(bookId, title, description, category, rented){
        this.bookId = bookId;
        this.title = title;
        this.description = description;
        this.category = category;
        this.rented = rented;
    }

    static async createBook (title, description, category){
        try{
            const newBook = await pool.query('INSERT INTO books (title, description, category) VALUES ($1, $2, $3) RETURNING *', [title, description, category]);
            if (newBook.rows.length>0) {
                return this.buildBook(newBook.rows[0]);
            } else{
                return null;
            }
        } catch(error) {
            console.log(error);
        }
    }

    static async deleteBook (bookId){
        try{
            const db_response = await pool.query('DELETE FROM books WHERE id = $1', [bookId])
            if (db_response.rowCount>0) {
                return true;
            } else{
                return null;
            }
        } catch(error) {
            console.log(error);
        }
    }
    
    static async all(title, category, page){
        try{
            const db_count = await this.prepareQueryCount(title, category);
            const db_response = await this.prepareQuery(title, category, page);

            if(db_response.rows.length > 0) {
                return {
                    count: db_count.rows[0].count,
                    number_of_pages: Math.ceil(db_count.rows[0].count/this.pageLimit),
                    records: db_response.rows.map(db_book => this.buildBook(db_book)),
                };    
            } else{
                return {
                    count: 0,
                    number_of_pages: 0,
                    records: [],
                };  
            }

        } catch(error){
            console.log(`Error during fetching books`);
            return null;
        }
    }

    static prepareQueryCount(title, category) {
        if(title && category) {
            return pool.query("SELECT COUNT(*) FROM books WHERE title ILIKE ($1) AND category ILIKE ($2)", [('%' + title + '%'), ('%' + category + '%')]);
        } else if (title) {
            return pool.query("SELECT COUNT(*) FROM books WHERE title ILIKE ($1)", [('%' + title + '%')]);
        } else if (category) {
            return pool.query("SELECT COUNT(*) FROM books WHERE category ILIKE ($1)", [('%' + category + '%')]);
        }
        return pool.query("SELECT COUNT(*) FROM books");
    }

    static prepareQuery(title, category, page) {
        if(title && category) {
            return pool.query("SELECT * FROM books WHERE title ILIKE ($1) AND category ILIKE ($2) LIMIT ($3) OFFSET ($4)", [('%' + title + '%'), ('%' + category + '%'), this.pageLimit, this.calculateCurrentOffset(page)]);
        } else if (title) {
            return pool.query("SELECT * FROM books WHERE title ILIKE ($1) LIMIT ($2) OFFSET ($3)", [('%' + title + '%'), this.pageLimit, this.calculateCurrentOffset(page)]);
        } else if (category) {
            return pool.query("SELECT * FROM books WHERE category ILIKE ($1) LIMIT ($2) OFFSET ($3)", [('%' + category + '%'), this.pageLimit, this.calculateCurrentOffset(page)]);
        }
        return pool.query('SELECT * FROM books LIMIT ($1) OFFSET ($2)', [this.pageLimit, this.calculateCurrentOffset(page)]);
    }

    static buildBook(db_book) {
        const bookId = db_book.id; 
        const title = db_book.title;
        const description = db_book.description;
        const category = db_book.category;
        const rented = db_book.rented;
        return new Book(bookId, title, description, category, rented);
    }

    static calculateCurrentOffset(page) {
        return this.pageLimit * (parseInt(page) - 1);
    }

    getBookId(){
        return this.bookId;
    }
    setBookId(bookId){
        this.bookId = bookId;
    }
    getTitle(){
        return this.title;
    }
    setTitle(title){
        this.title = title;
    }
    getCategory(){
        return this.category;
    }
    setCategory(category){
        this.category = category;
    }
}

module.exports = Book;