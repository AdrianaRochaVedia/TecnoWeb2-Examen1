const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');
const { contarOperaciones } = require('./middlewares/operaciones');

console.log(process.env);

// Crear el servidor de express
const app = express();

// Base de datos
dbConnection();

//Cors
app.use(cors());

// Directorio público
app.use(express.static('public'));

// Lectura y parseo del body
app.use( express.json() );
app.use(contarOperaciones);

// Rutas de la app
app.use('/api/usuario', require('./routes/usuario'));
app.use('/api/producto', require('./routes/producto'));
app.use('/api/contadores', require('./routes/contadores'));
app.use('/api/operaciones', require('./routes/operaciones'));
//Escuchar peticiones
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
});
