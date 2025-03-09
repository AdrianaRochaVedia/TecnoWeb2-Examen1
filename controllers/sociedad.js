const { response } = require('express');
const Sociedad = require('../models/Sociedad');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

const getSociedades = async (req, res = response) => {
    try {
        // Consulta todas las sociedades no eliminadas
        const sociedades = await Sociedad.find({ isDeleted: false }); // Popula los detalles de los miembros

        if (!sociedades || sociedades.length === 0) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontraron sociedades'
            });
        }

        res.json({
            ok: true,
            sociedades
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener las sociedades'
        });
    }
};


// Obtener una sociedad por ID
const getSociedad = async (req, res = response) => {
    const { id } = req.params; // ID de la sociedad desde los parámetros de la URL

    try {
        const sociedad = await Sociedad.findById(id); // Popula los datos de los usuarios miembros

        if (!sociedad) {
            return res.status(404).json({
                ok: false,
                msg: 'Sociedad no encontrada'
            });
        }

        res.json({
            ok: true,
            sociedad
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener la sociedad'
        });
    }
};

// Crear una nueva sociedad
const crearSociedad = async (req, res = response) => {
    const { name, objetive, start, end, socialLinks } = req.body;

    try {
        // Crear la sociedad
        const nuevaSociedad = new Sociedad({
            name,
            objetive,
            start,
            end,
            socialLinks
        });

        await nuevaSociedad.save();

        res.status(201).json({
            ok: true,
            sociedad: nuevaSociedad
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al crear la sociedad'
        });
    }
};

// Actualizar una sociedad
const actualizarSociedad = async (req, res = response) => {
    const { id } = req.params; // ID de la sociedad a actualizar

    try {
        // Buscar la sociedad por ID
        const sociedad = await Sociedad.findById(id);

        if (!sociedad) {
            return res.status(404).json({
                ok: false,
                msg: 'Sociedad no encontrada'
            });
        }

        // Actualizar la sociedad
        const nuevosDatos = { ...req.body };
        const sociedadActualizada = await Sociedad.findByIdAndUpdate(id, nuevosDatos, { new: true });

        res.json({
            ok: true,
            sociedad: sociedadActualizada
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar la sociedad'
        });
    }
};

// Eliminación lógica de una sociedad
const eliminarSociedad = async (req, res = response) => {
    const { id } = req.params; // ID de la sociedad a eliminar

    try {
        // Buscar la sociedad por ID
        const sociedad = await Sociedad.findById(id);

        if (!sociedad) {
            return res.status(404).json({
                ok: false,
                msg: 'Sociedad no encontrada'
            });
        }

        // Realizar la eliminación lógica
        sociedad.isDeleted = true;
        await sociedad.save();

        res.json({
            ok: true,
            msg: 'Sociedad eliminada lógicamente',
            sociedad
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar la sociedad'
        });
    }
};

module.exports = {
    getSociedades,
    getSociedad,
    crearSociedad,
    actualizarSociedad,
    eliminarSociedad
};
