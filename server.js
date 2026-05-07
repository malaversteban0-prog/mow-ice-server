const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

let database = {
    productos: [],
    historial: [],
    ventasActuales: []
};

app.get('/', (req, res) => {
    res.send('MOW ICE ONLINE');
});

app.get('/datos', (req, res) => {
    res.json(database);
});

app.post('/guardar', (req, res) => {

    database = req.body;

    console.log('DATOS GUARDADOS');

    res.json({
        ok: true
    });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('SERVIDOR ONLINE ' + PORT);
});