const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

app.get('/', (req, res) => {
    res.send('MOW ICE ONLINE');
});


// ======================
// OBTENER DATOS
// ======================

app.get('/datos', async (req, res) => {

    try {

        const result = await pool.query(
            'SELECT * FROM sistema WHERE id = 1'
        );

        if (result.rows.length === 0) {

            return res.json({
                productos: [],
                historial: [],
                ventasActuales: []
            });

        }

        res.json(result.rows[0].data);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: 'error cargando datos'
        });

    }

});


// ======================
// GUARDAR DATOS
// ======================

app.post('/guardar', async (req, res) => {

    try {

        const data = req.body;

        await pool.query(`
            INSERT INTO sistema (id, data)
            VALUES (1, $1)
            ON CONFLICT (id)
            DO UPDATE SET data = $1
        `, [data]);

        res.json({
            ok: true
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: 'error guardando'
        });

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('SERVIDOR ONLINE ' + PORT);
});