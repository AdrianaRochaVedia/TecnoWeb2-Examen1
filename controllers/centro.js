const { response } = require('express');
const Centro = require('../models/Centro');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

// Obtener todas las sociedades (Centros)
const getCentros = async (req, res = response) => {
    try {
        // Consulta todos los centros no eliminados
        const centros = await Centro.find({ isDeleted: false }); // Popula los detalles de los miembros

        if (!centros || centros.length === 0) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontraron centros'
            });
        }

        res.json({
            ok: true,
            centros
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener los centros'
        });
    }
};

// Obtener un centro por ID
const getCentro = async (req, res = response) => {
    const { id } = req.params; // ID del centro desde los parámetros de la URL

    try {
        const centro = await Centro.findById(id); // Popula los datos de los usuarios miembros

        if (!centro) {
            return res.status(404).json({
                ok: false,
                msg: 'Centro no encontrado'
            });
        }

        res.json({
            ok: true,
            centro
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener el centro'
        });
    }
};

// Crear un nuevo centro
const crearCentro = async (req, res = response) => {
    const { name, objetive, start, end, socialLinks } = req.body;

    try {
        // Crear el centro
        const nuevoCentro = new Centro({
            name,
            objetive,
            start,
            end,
            socialLinks
        });

        await nuevoCentro.save();

        res.status(201).json({
            ok: true,
            centro: nuevoCentro
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al crear el centro'
        });
    }
};

// Actualizar un centro
const actualizarCentro = async (req, res = response) => {
    const { id } = req.params; // ID del centro a actualizar

    try {
        // Buscar el centro por ID
        const centro = await Centro.findById(id);

        if (!centro) {
            return res.status(404).json({
                ok: false,
                msg: 'Centro no encontrado'
            });
        }

        // Actualizar el centro
        const nuevosDatos = { ...req.body };
        const centroActualizado = await Centro.findByIdAndUpdate(id, nuevosDatos, { new: true });

        res.json({
            ok: true,
            centro: centroActualizado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar el centro'
        });
    }
};

// Eliminación lógica de un centro
const eliminarCentro = async (req, res = response) => {
    const { id } = req.params; // ID del centro a eliminar

    try {
        // Buscar el centro por ID
        const centro = await Centro.findById(id);

        if (!centro) {
            return res.status(404).json({
                ok: false,
                msg: 'Centro no encontrado'
            });
        }

        // Realizar la eliminación lógica
        centro.isDeleted = true;
        await centro.save();

        res.json({
            ok: true,
            msg: 'Centro eliminado lógicamente',
            centro
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar el centro'
        });
    }
};

module.exports = {
    getCentros,
    getCentro,
    crearCentro,
    actualizarCentro,
    eliminarCentro
};