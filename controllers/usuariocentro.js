const { response } = require('express');
const Ucentro = require('../models/UsuarioCentro');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Centro = require('../models/Centro');

// Función para validar el formato de un ID de MongoDB
const esObjectIdValido = (id) => mongoose.Types.ObjectId.isValid(id);
// Función para obtener el ID del centro activo
const obtenerCentroActivo = async () => {
    try {
        const centroActivo = await Centro.findOne({ isDeleted: false });
        return centroActivo ? centroActivo._id : null;
    } catch (error) {
        console.error('Error al obtener el centro activo:', error);
        return null;
    }
};
// Obtener todos los docentes
// Obtener todos los docentes activos
const getUsuariosCentro = async (req, res) => {
    const centroActivoId = await obtenerCentroActivo();
    if (!centroActivoId) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay un centro activo disponible'
        });
    }

    try {
        const ucentro = await Ucentro.find({ state: true })
            .populate('usuario', 'name email rol');

        res.json({
            ok: true,
            ucentro
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener los usuarios del centro'
        });
    }
};


// Obtener un docente por ID
const getUsuarioCentro = async (req, res) => {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
        return res.status(400).json({
            ok: false,
            msg: 'ID inválido'
        });
    }

    try {
        const ucentro = await Ucentro.findOne({ _id: id, state: true })
            .populate('usuario', 'name email password rol');

        if (!ucentro) {
            return res.status(404).json({
                ok: false,
                msg: ' Miembro del centro no encontrado o inactivo'
            });
        }

        res.json({
            ok: true,
            ucentro
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
const crearUcentro = async (req, res = response) => {
    const centroActivoId = await obtenerCentroActivo();
    if (!centroActivoId) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay un centro activo disponible'
        });
    }
    else{
        const { name, email, password, rol, photo, socialLinks,role,state } = req.body;
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

            const ucentro = new Ucentro({
                usuario: usuario._id, 
                idcentro: centroActivoId,
                photo,
                socialLinks,
                role,
                state
            });

            await ucentro.save();

            res.status(201).json({
                ok: true,
            ucentro
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                ok: false,
                msg: 'Error al crear el miembro'
            });
        }
    }
    
};


// Actualizar un docente
const actualizarUcentro = async (req, res = response) => {
    const ucentroId = req.params.id;
    const uid = req.uid; // ID del usuario autenticado

    // Validar el ID del docente
    if (!esObjectIdValido(ucentroId)) {
        return res.status(400).json({
            ok: false,
            msg: 'ID de miembro inválido'
        });
    }

    try {
        // Buscar docente por ID y cargar el usuario asociado
        const ucentro = await Ucentro.findById(ucentroId).populate('usuario', 'name email rol');

        // Si no existe el docente
        if (!ucentro) {
            return res.status(404).json({
                ok: false,
                msg: 'Ucentro no existe con ese ID'
            });
        }

        console.log('Ucentro encontrado:', ucentro);
        console.log('ID del usuario autenticado (UID):', uid);

        // Verificar si el usuario autenticado es el propietario del docente
        // El docente solo puede ser editado por el usuario que lo creó
        if (ucentro.usuario._id.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio para editar este docente'
            });
        }

        // Preparar los datos de la actualización
        const nuevosDatosUcentro = {
            ...req.body, // Campos a actualizar (imagen, redes sociales, etc.)
            usuario: ucentro.usuario._id // Asegurar que el usuario no cambie
        };

        // Actualizar el docente
        const ucentroActualizado = await Ucentro.findByIdAndUpdate(
            ucentroId,
            nuevosDatosUcentro,
            { new: true }
        );

        // Devolver el docente actualizado
        return res.json({
            ok: true,
            ucentro: ucentroActualizado
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
const eliminarUcentro = async (req, res = response) => {
    const ucentroId = req.params.id;
    const uid = req.uid;

    console.log('Ucentro ID:', ucentroId); // Debug
    console.log('UID autenticado:', uid); // Debug

    if (!esObjectIdValido(ucentroId)) {
        return res.status(400).json({
            ok: false,
            msg: 'ID de docente inválido',
        });
    }

    try {
        const ucentro = await Ucentro.findById(ucentroId).populate('usuario', 'name email');

        if (!ucentro) {
            return res.status(404).json({
                ok: false,
                msg: 'Docente no encontrado',
            });
        }

        console.log('Docente encontrado:', ucentro); // Debug

        if (ucentro.usuario._id.toString() !== uid) {
            console.log('UID no coincide con el creador del docente'); // Debug
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegio para eliminar este docente',
            });
        }

        ucentro.state = false;
        await ucentro.save();

        return res.json({
            ok: true,
            msg: 'Docente eliminado lógicamente',
            ucentro,
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
    getUsuariosCentro,
    getUsuarioCentro,
    crearUcentro,
    actualizarUcentro,
    eliminarUcentro
};
