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