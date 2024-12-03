const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

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

app.get("/users/profiles", checkAuth, async (req, res) => {
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

app.post("/users/register", async (req, res) => {
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

app.post("/users/login", async (req, res) => {
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

app.get("/users/test_auth", checkAuth, (req, res) => {
  res.json({
    message: "You are authenticated!",
    user: req.user.email,
  });
});

app.get("/users/connection", (req, res) => {
  res.json({
    answer: "connected!!!",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});