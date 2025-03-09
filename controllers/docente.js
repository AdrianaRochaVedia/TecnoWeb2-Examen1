const { response } = require('express');
const Docente = require('../models/Docente');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Función para validar el formato de un ID de MongoDB
const esObjectIdValido = (id) => mongoose.Types.ObjectId.isValid(id);

// Obtener todos los docentes
// Obtener todos los docentes activos
const getDocentes = async (req, res) => {
    try {
        const docentes = await Docente.find({ state: true })
            .populate('usuario', 'name email rol');

        res.json({
            ok: true,
            docentes
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener los docentes'
        });
    }
};


// Obtener un docente por ID
const getDocente = async (req, res) => {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
        return res.status(400).json({
            ok: false,
            msg: 'ID inválido'
        });
    }

    try {
        const docente = await Docente.findOne({ _id: id, state: true })
            .populate('usuario', 'name email password rol');

        if (!docente) {
            return res.status(404).json({
                ok: false,
                msg: 'Docente no encontrado o inactivo'
            });
        }

        res.json({
            ok: true,
            docente
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener el docente'
        });
    }
};

// Crear un nuevo docente
const crearDocente = async (req, res = response) => {
    const { name, email, password, rol, imagen, socialLinks,designation,state } = req.body;
    const uid = req.uid; // El uid del usuario que está autenticado

    try {
        // Crear el Usuario
        let usuario = new Usuario({
            name,
            email,
            password,
            rol
        });

        // Encriptar la contraseña de forma asíncrona
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);
        await usuario.save();

        // Crear el Docente, asociando el Usuario creado
        const docente = new Docente({
            usuario: usuario._id, // Aquí asociamos el usuario autenticado al docente
            imagen,
            socialLinks,
            designation,
            state
        });

        await docente.save();

        res.status(201).json({
            ok: true,
            docente
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al crear el docente'
        });
    }
};


// Actualizar un docente
const actualizarDocente = async (req, res = response) => {
    const docenteId = req.params.id;
    const uid = req.uid; // ID del usuario autenticado

    // Validar el ID del docente
    if (!esObjectIdValido(docenteId)) {
        return res.status(400).json({
            ok: false,
            msg: 'ID de docente inválido'
        });
    }

    try {
        // Buscar docente por ID y cargar el usuario asociado
        const docente = await Docente.findById(docenteId).populate('usuario', 'name email rol');

        // Si no existe el docente
        if (!docente) {
            return res.status(404).json({
                ok: false,
                msg: 'Docente no existe con ese ID'
            });
        }

        console.log('Docente encontrado:', docente);
        console.log('ID del usuario autenticado (UID):', uid);

        // Verificar si el usuario autenticado es el propietario del docente
        // El docente solo puede ser editado por el usuario que lo creó
        if (docente.usuario._id.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio para editar este docente'
            });
        }

        // Preparar los datos de la actualización
        const nuevosDatosDocente = {
            ...req.body, // Campos a actualizar (imagen, redes sociales, etc.)
            usuario: docente.usuario._id // Asegurar que el usuario no cambie
        };

        // Actualizar el docente
        const docenteActualizado = await Docente.findByIdAndUpdate(
            docenteId,
            nuevosDatosDocente,
            { new: true }
        );

        // Devolver el docente actualizado
        return res.json({
            ok: true,
            docente: docenteActualizado
        });

    } catch (error) {
        console.error('Error al actualizar el docente:', error.message);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
};



// Eliminar un docente de forma lógica
const eliminarDocente = async (req, res = response) => {
    const docenteId = req.params.id;
    const uid = req.uid;

    console.log('Docente ID:', docenteId); // Debug
    console.log('UID autenticado:', uid); // Debug

    if (!esObjectIdValido(docenteId)) {
        return res.status(400).json({
            ok: false,
            msg: 'ID de docente inválido',
        });
    }

    try {
        const docente = await Docente.findById(docenteId).populate('usuario', 'name email');

        if (!docente) {
            return res.status(404).json({
                ok: false,
                msg: 'Docente no encontrado',
            });
        }

        console.log('Docente encontrado:', docente); // Debug

        if (docente.usuario._id.toString() !== uid) {
            console.log('UID no coincide con el creador del docente'); // Debug
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegio para eliminar este docente',
            });
        }

        docente.state = false;
        await docente.save();

        return res.json({
            ok: true,
            msg: 'Docente eliminado lógicamente',
            docente,
        });
    } catch (error) {
        console.error('Error al intentar eliminar el docente:', error.message);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor. Hable con el administrador.',
        });
    }
};






module.exports = {
    getDocente,
    getDocentes,
    crearDocente,
    actualizarDocente,
    eliminarDocente
};
