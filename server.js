const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.get('/', (req, res) => {
  res.send('MOW ICE ONLINE');
});

app.get('/productos', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM productos ORDER BY id DESC'
    );

    res.json(result.rows);

  } catch(err) {
    console.log(err);
    res.status(500).json({
      error: 'error'
    });
  }
});

app.post('/productos', async (req, res) => {

  try {

    const {
      nombre,
      precio,
      stock,
      img,
      costos
    } = req.body;

    const result = await pool.query(
      `INSERT INTO productos
      (nombre, precio, stock, img, costos)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        nombre,
        precio,
        stock,
        img,
        JSON.stringify(costos)
      ]
    );

    res.json(result.rows[0]);

  } catch(err) {
    console.log(err);

    res.status(500).json({
      error: 'error'
    });
  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Servidor funcionando');
});