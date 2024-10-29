const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration
let pool;
if (process.env.DATABASE_URL) {
  // Check if it's the Render URL (contains 'render.com')
  const isRenderDB = process.env.DATABASE_URL.includes('render.com');
  
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isRenderDB ? {
      rejectUnauthorized: false
    } : false
  });
} else {
  // Use individual config variables for local development
  pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
  });
}

// Database connection
pool.connect()
  .then(client => {
    console.log('Successfully connected to PostgreSQL database');
    client.release();
  })
  .catch(err => {
    console.error('Database connection error:', err.message);
  });

// API endpoints
app.get('/api/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/items', async (req, res) => {
  const { id, name, imageLink, team } = req.body;
  
  try {
    const updateQuery = `
      UPDATE items 
      SET 
        ${team === 'Cinnamon Toast Crunch' ? 'ctc_name' : 'lc_name'} = $1,
        ${team === 'Cinnamon Toast Crunch' ? 'ctc_link' : 'lc_link'} = $2,
        ${team === 'Cinnamon Toast Crunch' ? 'collected_ctc' : 'collected_lc'} = true
      WHERE id = $3
      RETURNING *`;
    
    const result = await pool.query(updateQuery, [name, imageLink, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Item not found with id: ${id}` });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 