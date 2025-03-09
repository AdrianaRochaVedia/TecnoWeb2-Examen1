const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');


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

// Rutas de la app
app.use('/api/auth', require('./routes/auth'));
app.use('/api/producto', require('./routes/producto'));

//Escuchar peticiones
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
});
