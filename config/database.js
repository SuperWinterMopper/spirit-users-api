import pkg from "pg";
import dotenv from "dotenv";

const { Pool, Query } = pkg;
dotenv.config();

if(!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required.");
}

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});