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
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Prepare the statements
const preparedStatements = {
  getAllItems: {
    name: 'get-all-items',
    text: 'SELECT * FROM items'
  },
  updateItem: {
    name: 'update-item',
    text: `
      UPDATE items 
      SET 
        ctc_name = CASE WHEN $1 = 'Cinnamon Toast Crunch' THEN $3 ELSE ctc_name END,
        ctc_link = CASE WHEN $1 = 'Cinnamon Toast Crunch' THEN $4 ELSE ctc_link END,
        lc_name = CASE WHEN $1 = 'Lucky Charms' THEN $3 ELSE lc_name END,
        lc_link = CASE WHEN $1 = 'Lucky Charms' THEN $4 ELSE lc_link END,
        collected_ctc = CASE WHEN $1 = 'Cinnamon Toast Crunch' THEN true ELSE collected_ctc END,
        collected_lc = CASE WHEN $1 = 'Lucky Charms' THEN true ELSE collected_lc END
      WHERE id = $2
      RETURNING *`
  }
};

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
    const result = await pool.query(preparedStatements.getAllItems);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/items', async (req, res) => {
  const { id, name, imageLink, team } = req.body;
  
  try {
    // Validate inputs
    if (!id || !name || !imageLink || !team) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Use prepared statement for update
    const result = await pool.query(preparedStatements.updateItem, [
      team,
      id,
      name,
      imageLink
    ]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Item not found with id: ${id}` });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating item:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 