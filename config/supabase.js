const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error("Missing required Supabase environment variables");
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = supabase;



// this is code from formerly database.js
/*

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


*/ 