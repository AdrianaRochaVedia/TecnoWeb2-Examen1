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
app.use('/api/events', require('./routes/events'));

//haz lo mismo con news
app.use('/api/news', require('./routes/news'));
//Rutas de empresas aliadas
app.use('/api/empresas', require('./routes/empresas'));

//Rutas de dcoentes
app.use('/api/docente', require('./routes/docente'));

//Rutas de sociedad
app.use('/api/sociedad', require('./routes/sociedad'));

//Rutas de centro
app.use('/api/centro', require('./routes/centro'));

//Rutas de centro
app.use('/api/ucentro', require('./routes/ucentro'));

//Rutas de centro
app.use('/api/usociedad', require('./routes/usociedad'));

//Rutas de sociedad
app.use('/api/graduado', require('./routes/graduado'));

//haz lo mismo con news
app.use('/api/faqs', require('./routes/faqs'));

//Escuchar peticiones
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
});
