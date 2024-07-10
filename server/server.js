const PORT = process.env.PORT || 8000;
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
const cors = require('cors');
const pool = require('./db'); // Assuming db.js is in the same directory as this file
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Assuming you're using JWT for token generation

app.use(cors());
app.use(express.json());

app.get('/to/:userEmail', async (req, res) => {
  const { userEmail } = req.params.userEmail;
  try {
    const todoapp = await pool.query('SELECT * FROM todos WHERE user_email = $1', [userEmail]);
    res.json(todoapp.rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/to', async (req, res) => {
  const { user_email, title, progress, date } = req.body;
  const id = uuidv4();
  try {
    const newToDo = await pool.query('INSERT INTO todos(id, user_email, title, progress, date) VALUES($1, $2, $3, $4, $5)', [id, user_email, title, progress, date]);
    res.json(newToDo.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/to/:id', async (req, res) => {
  const { id } = req.params;
  const { user_email, title, progress, date } = req.body;
  try {
    const editToDo = await pool.query('UPDATE todos SET user_email = $1, title = $2, progress = $3, date = $4 WHERE id = $5', [user_email, title, progress, date, id]);
    res.json(editToDo.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const newUser = await pool.query('INSERT INTO users (email, hashed_password) VALUES ($1, $2) RETURNING *', [email, hashedPassword]);
    const token = jwt.sign({ email: newUser.rows[0].email }, 'secret', { expiresIn: '1hr' });
    res.json({ email: newUser.rows[0].email, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(404).json({ detail: 'User does not exist!' });
    }
    const success = await bcrypt.compare(password, user.rows[0].hashed_password);
    if (success) {
      const token = jwt.sign({ email: user.rows[0].email }, 'secret', { expiresIn: '1hr' });
      res.json({ email: user.rows[0].email, token });
    } else {
      res.status(401).json({ detail: 'Login failed' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
