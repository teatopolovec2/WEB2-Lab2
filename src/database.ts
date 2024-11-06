import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

class Database {
    public pool: Pool;

    constructor() {
        this.pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASSWORD,
            port: 5432,
            ssl : true
        })
    }

    public async createTable() { //kreiranje tablica 'komentari' i 'kartice'
        try {
            const results = await this.pool.query(`
                CREATE TABLE IF NOT EXISTS komentari (
                    id SERIAL PRIMARY KEY,
                    tekst VARCHAR(255) NOT NULL
                );
                CREATE TABLE IF NOT EXISTS kartice (
                    id SERIAL PRIMARY KEY,
                    brojKartice VARCHAR(255) NOT NULL
                );
            `);
            console.log('Tablica kreirana ili već postoji.');
        } catch (err) {
            console.error('Greška prilikom kreiranja tablice.', err);
            throw err;
        }
    }

    public async createKomentar(tekst : string) {
        try {
            const query = `INSERT INTO komentari (tekst) VALUES ($1) RETURNING *`;
            return await this.pool.query(query, [tekst]);
        } catch (err) {
            console.error('Greška prilikom kreiranja komentara.', err);
            throw err;
        }
    }

    public async createKartica(broj : string) {
        try {
            const query = `INSERT INTO kartice (brojKartice) VALUES ($1) RETURNING *`;
            return await this.pool.query(query, [broj]);
        } catch (err) {
            console.error('Greška prilikom kreiranja kartice.', err);
            throw err;
        }
    }

    public async komentari() { //dohvat svih komentara
        try {
            const query = `SELECT * FROM komentari`;
            return await this.pool.query(query);
        } catch (err) {
            console.error('Greška prilikom kreiranja komentara.', err);
            throw err;
        }
    }
}

const dbInstance = new Database();
export default dbInstance;
