const pool = require("../db");

class Rent {
    static pageLimit = 10;

    constructor(rentId, userId, bookId, createdAt, endAt, finished){
        this.rentId = rentId;
        this.userId = userId;
        this.bookId = bookId;
        this.createdAt = createdAt;
        this.endAt = endAt;
        this.finished = finished
    }

    static async createRent (userId, bookId, createdAt, endAt){
        try{
            const newRent = await pool.query('INSERT INTO rents (user_id, book_id, created_at, end_at) VALUES ($1, $2, $3, $4) RETURNING *', [userId, bookId, createdAt, endAt]);
            const db_update_book = await pool.query('UPDATE books SET rented = $1 WHERE id = $2 RETURNING *', [true, bookId]);
            if (newRent.rows.length>0) {
                return this.buildRent(newRent.rows[0]);
            } else{
                return null;
            }
        } catch(error) {
            console.log(error);
        }
    }

    static async updateRent (userId){
        try{
            const db_update_rent = await pool.query('UPDATE rents SET finished = $1 WHERE id = $2 RETURNING *', [true, userId])
            const db_rent = await pool.query('SELECT * FROM rents WHERE id = $1', [userId])
            const db_update_book = await pool.query('UPDATE books SET rented = $1 WHERE id = $2 RETURNING *', [false, db_rent.rows[0].book_id])
            if (db_update_book.rows.length>0) {
                return true;
            } else{
                return null;
            }
        } catch(error) {
            console.log(error);
        }
    }

    static async deleteRent (rentId){
        try{
            const db_response = await pool.query('DELETE FROM rents WHERE id = $1', [rentId])
            if (db_response.rows.length>0) {
                return true
            } else{
                return null;
            }
        } catch(error) {
            console.log(error);
        }
    }

    static async all(page) {
        try{
            const db_count = await pool.query("SELECT COUNT(*) FROM rents");
            const db_response = await pool.query('SELECT * FROM rents LIMIT ($1) OFFSET ($2)', [this.pageLimit, this.calculateCurrentOffset(page)]);

            if(db_response.rows.length > 0) {
                return {
                    count: db_count.rows[0].count,
                    number_of_pages: Math.ceil(db_count.rows[0].count/this.pageLimit),
                    records: db_response.rows.map(db_rent => this.buildRent(db_rent)),
                }; 
            } else{
                return null;
            }

        } catch(error){
            console.log(`Error during fetching rents`);
            return null;
        }
    }

    static async rentsByCreatedAt(createdAt, page){
        try{
            const db_response = await pool.query('SELECT * FROM rents WHERE created_at = ($1) LIMIT ($2) OFFSET ($3)', [createdAt, this.pageLimit, this.calculateCurrentOffset(page)]);

            if(db_response.rows.length > 0) {
                return db_response.rows.map(db_rent => this.buildRent(db_rent));
            } else{
                return null;
            }

        } catch(error){
            console.log(`Error during fetching rents`);
            return null;
         }
    }

    static async rentsForUser(userId, page){
        try{
            const db_count = await pool.query("SELECT COUNT(*) FROM rents WHERE user_id = ($1)", [userId]);
            const db_response = await pool.query("SELECT * FROM rents WHERE user_id = ($1) LIMIT ($2) OFFSET ($3)", [userId, this.pageLimit, this.calculateCurrentOffset(page)]);

            if(db_response.rows.length > 0) {
                return {
                    count: db_count.rows[0].count,
                    number_of_pages: Math.ceil(db_count.rows[0].count/this.pageLimit),
                    records: db_response.rows.map(db_rent => this.buildRent(db_rent)),
                }; 
            } else{
                return null;
            }

        } catch(error){
            console.log(`Error during fetching rents`);
            return null;
         }
    }

    static buildRent(db_rent) {
        const rentId = db_rent.id; 
        const userId = db_rent.user_id;
        const bookId = db_rent.book_id;
        const createdAt = db_rent.created_at;
        const endAt = db_rent.end_at;
        const finished = db_rent.finished;
        return new Rent(rentId, userId, bookId, createdAt, endAt, finished);
    }

    static calculateCurrentOffset(page) {
        return this.pageLimit * (parseInt(page) - 1);
    }

    getRentId(){
        return this.rentId;
    }
    setRentId(rentId){
        this.rentId = rentId;
    }
    getTitle(){
        return this.userId;
    }
    setTitle(userId){
        this.userId = userId;
    }
    getCategory(){
        return this.createdAt;
    }
    setCategory(createdAt){
        this.createdAt = createdAt;
    }
}

module.exports = Rent;