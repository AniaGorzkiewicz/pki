const pool = require("../db");
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { pageLimit } = require("./book");
dotenv.config();
process.env.TOKEN_SECRET;

class User{
    static pageLimit = 10;

    constructor(name, lastname, email, userId, username, isAdmin, activated, password){
        this.name = name;
        this.lastname = lastname;
        this.email = email;
        this.userId = userId;
        this.username = username;
        this.isAdmin = isAdmin;
        this.activated = activated;
        this.password = password;
    }

    static async createUser (username, name, lastname, email, password){
        try{
            const newUser = await pool.query('INSERT INTO users (username, name, lastname, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *', [username, name, lastname, email, password]);
            if (newUser.rows.length>0) {
                return this.buildUser(newUser.rows[0]);
            } else{
                return null;
            }
        } catch(error) {
            console.log(error);
        }
    }

    static async deleteUser (userId){
        try{
            const db_response = await pool.query('DELETE FROM users WHERE id = $1', [userId])
            if (db_response.rows.length>0) {
                return true;
            } else{
                return null;
            }
        } catch(error) {
            console.log(error);
        }
    }

    static async adminUserUpdate (userId, is_admin, activated){
        try{
            const db_response = await pool.query('UPDATE users SET is_admin = $1, activated = $2 WHERE id = $3 RETURNING *', [is_admin, activated, userId])
            if (db_response.rows.length>0) {
                return true;
            } else{
                return null;
            }
        } catch(error) {
            console.log(error);
        }
    }

    static async all(page) {
        try{
            const db_count = await pool.query("SELECT COUNT(*) FROM users");
            const db_response = await pool.query('SELECT * FROM users LIMIT ($1) OFFSET ($2)', [this.pageLimit, this.calculateCurrentOffset(page)]);

            if(db_response.rows.length > 0) {
                return {
                    count: db_count.rows[0].count,
                    number_of_pages: Math.ceil(db_count.rows[0].count/this.pageLimit),
                    records: db_response.rows.map(db_rent => this.buildUser(db_rent)),
                }; 
            } else{
                return null;
            }

        } catch(error){
            console.log(`Error during fetching users`);
            return null;
        }
    }

    static async findUser (email, password){
        try{
            const db_response = await pool.query('SELECT * FROM users WHERE email = ($1)', [email]);

            let newUser = null;
            if(db_response.rows.length>0) {
                newUser = this.buildUser(db_response.rows[0]);
            } else{
                return null;
            }

            const result = bcrypt.compareSync(password, db_response.rows[0].password)
            if (result) return newUser;
            return null;
        } catch(error){
            console.log(`User not found!`);
         }
    }

    static async findUserById(id){
        try{
            const db_response = await pool.query('SELECT * FROM users WHERE id = ($1)', [id]);
            if(db_response.rows.length>0) {
                return this.buildUser(db_response.rows[0]);
            }
            return null;
        } catch(error){
            console.log(`User not found!`);
            return null;
        }
    }

    static buildUser(db_user) {
        const name = db_user.name;
        const lastName = db_user.lastname;
        const email = db_user.email;
        const nameUser = db_user.username;
        const id = db_user.id;
        const isAdmin = db_user.is_admin;
        const activated = db_user.activated;
        return new User(name, lastName, email, id, nameUser, isAdmin, activated);
    }

    static calculateCurrentOffset(page) {
        return this.pageLimit * (parseInt(page) - 1);
    }

    getUserId(){
        return this.userId;
    }
    setUserId(userId){
        this.userId = userId;
    }
    getUsername(){
        return this.username;
    }
    setUsername(username){
        this.username = username;
    }
    getIsAdmin(){
        return this.isAdmin;
    }
    setIsAdmin(isAdmin){
        this.isAdmin = isAdmin;
    }
    getPassword(){
        return this.password;
    }
    setPassword(password){
        this.password = password;
    }
    getActivated(){
        return this.activated;
    }
    setActivated(activated){
        this.activated = activated;
    }
    getIsAdmin(){
        return this.isAdmin;
    }
}

module.exports = User;