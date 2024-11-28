
// PSQL code before hw-8
/*

import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";

const { Pool } = pkg;
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
      rejectUnauthorized: false,
  },
});

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({ error: "Failed to fetch users."});
  }
});

app.post("/users", async(req, res) => {
  try {
    const { first_name, last_name, email, profile_icon, bio, artist_tags, genre_tags, followers, following } = req.body;
    const result = await pool.query(
      'INSERT INTO users (first_name, last_name, email, profile_icon, bio, artist_tags, genre_tags, followers, following) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', 
      [first_name, last_name, email, profile_icon, bio, artist_tags, genre_tags, followers, following]
    );
    res.status(201).json(result.rows[0]);
  } catch(err) {
    console.error("Query error:", err);
    res.status(500).json({ error: "Failed to post user."});
  }
});

app.delete("/users/:id", async(req, res) => {
  try {
    const { id } = req.params;  
    await pool.query('DELETE FROM users WHERE id=$1', [id]);
    res.status(204).send();
  } catch(err) {
    console.error("Query error:", err);
    res.status(500).json({ error: "Failed to delete user."});
  }
});

app.put("/users/:id", async(req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, profile_icon, bio, artist_tags, genre_tags, followers, following } = req.body;

    const result = await pool.query(
      `UPDATE users 
       SET first_name = $1,
          last_name = $2,
          email = $3,
          profile_icon = $4,
          bio = $5,
          artist_tags = $6,
          genre_tags = $7,
          followers = $8,
          following = $9
       WHERE id = $10
       RETURNING *`,
      [first_name, last_name, email, profile_icon, bio, artist_tags, genre_tags, followers, following, id]
    );
    res.json(result.rows[0]);
  } catch(err) {
    console.error("Query error:", err);
    res.status(500).json({ error: "Failed to update user."});
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
*/


// import express from "express";
// import cors from "cors";
// import pkg from "pg";
// import dotenv from "dotenv";
// import { createClient } from "@supabase/supabase-js";



const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const supabaseUrl = 'https://kxjwaaqqoanouxvwkgmv.supabase.co'
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey)

app.use(
  cors({
    origin: "http://localhost:3002",
    credentials: true,
  })
);

app.use(express.json());

app.get("/users/profiles", async (req, res) => {
  try {
    const { data, error } = await supabase
    .from('users')
    .select(`
      id,
      first_name,
      last_name,
      email,
      profile_icon,
      followers,
      following,
      artist_tags,
      genre_tags,
      bio,
      dob:user_profiles(
        date_of_birth
      )
    `);
    if (error) throw new Error(error.message); 
    return res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});



// rest of code is rest of code ethan had in his server.js. i think it's auth stuff 
/*
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    res.json({ message: "Registration successful!", user: data.user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    res.json({ token: data.session.access_token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const checkAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    if (error) throw error;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

app.get("/api/protected", checkAuth, (req, res) => {
  res.json({
    message: "You are authenticated!",
    user: req.user.email,
    timestamp: new Date().toISOString(),
  });
});

*/