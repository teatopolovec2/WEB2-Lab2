import { Pool } from 'pg';
declare class Database {
    pool: Pool;
    constructor();
    createTable(): Promise<void>;
    createKomentar(tekst: string): Promise<import("pg").QueryResult<any>>;
    createKartica(broj: string): Promise<import("pg").QueryResult<any>>;
    komentari(): Promise<import("pg").QueryResult<any>>;
}
declare const dbInstance: Database;
export default dbInstance;
