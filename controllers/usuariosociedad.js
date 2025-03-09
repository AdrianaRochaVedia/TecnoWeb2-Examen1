const { response } = require('express');
const Usociedad= require('../models/UsuarioSociedad');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Sociedad = require('../models/Sociedad');

// Función para validar el formato de un ID de MongoDB
const esObjectIdValido = (id) => mongoose.Types.ObjectId.isValid(id);
// Función para obtener el ID del centro activo
const obtenerSociedadActivo = async () => {
    try {
        const sociedadActivo = await Sociedad.findOne({ isDeleted: false });
        return sociedadActivo ? sociedadActivo._id : null;
    } catch (error) {
        console.error('Error al obtener a la sociedad activo:', error);
        return null;
    }
};
// Obtener todos los docentes
// Obtener todos los docentes activos
const getUsuariosSociedad = async (req, res) => {
    const sociedadActivoId = await obtenerSociedadActivo();
    if (!sociedadActivoId) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay una sociedad activa disponible'
        });
    }

    try {
        const usociedad = await Usociedad.find({ state: true })
            .populate('usuario', 'name email rol');

        res.json({
            ok: true,
            usociedad
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener los usuarios de la sociedad'
        });
    }
};


// Obtener un docente por ID
const getUsuarioSociedad = async (req, res) => {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
        return res.status(400).json({
            ok: false,
            msg: 'ID inválido'
        });
    }

    try {
        const usociedad = await Usociedad.findOne({ _id: id, state: true })
            .populate('usuario', 'name email password rol');

        if (!usociedad) {
            return res.status(404).json({
                ok: false,
                msg: ' Miembro de la sociedad no encontrado o inactivo'
            });
        }

        res.json({
            ok: true,
            usociedad
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener al miembro de la sociedad'
        });
    }
};

// Crear un nuevo docente
const crearUsociedad = async (req, res = response) => {
    const sociedadActivoId = await obtenerSociedadActivo();
    if (!sociedadActivoId) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay una sociedad activa disponible'
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

            const usociedad = new Usociedad({
                usuario: usuario._id, 
                idsociedad: sociedadActivoId,
                photo,
                socialLinks,
                role,
                state
            });

            await usociedad.save();

            res.status(201).json({
                ok: true,
            usociedad
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
const actualizarUsociedad = async (req, res = response) => {
    const usociedadId = req.params.id;
    const uid = req.uid; // ID del usuario autenticado

    // Validar el ID del docente
    if (!esObjectIdValido(usociedadId)) {
        return res.status(400).json({
            ok: false,
            msg: 'ID de miembro inválido'
        });
    }

    try {
        // Buscar docente por ID y cargar el usuario asociado
        const usociedad = await Usociedad.findById(usociedadId).populate('usuario', 'name email rol');

        // Si no existe el docente
        if (!usociedad) {
            return res.status(404).json({
                ok: false,
                msg: 'Usociedad no existe con ese ID'
            });
        }

        console.log('Usociedad encontrado:', usociedad);
        console.log('ID del usuario autenticado (UID):', uid);

        // Verificar si el usuario autenticado es el propietario del docente
        // El docente solo puede ser editado por el usuario que lo creó
        if (usociedad.usuario._id.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio para editar este docente'
            });
        }

        // Preparar los datos de la actualización
        const nuevosDatosUsociedad = {
            ...req.body, // Campos a actualizar (imagen, redes sociales, etc.)
            usuario: usociedad.usuario._id // Asegurar que el usuario no cambie
        };

        // Actualizar el docente
        const usociedadActualizado = await Usociedad.findByIdAndUpdate(
            usociedadId,
            nuevosDatosUsociedad,
            { new: true }
        );

        // Devolver el docente actualizado
        return res.json({
            ok: true,
            usociedad: usociedadActualizado
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
const eliminarUsociedad = async (req, res = response) => {
    const usociedadId = req.params.id;
    const uid = req.uid;

    console.log('Usociedad ID:', usociedadId); // Debug
    console.log('UID autenticado:', uid); // Debug

    if (!esObjectIdValido(usociedadId)) {
        return res.status(400).json({
            ok: false,
            msg: 'ID de docente inválido',
        });
    }

    try {
        const usociedad = await Usociedad.findById(usociedadId).populate('usuario', 'name email');

        if (!usociedad) {
            return res.status(404).json({
                ok: false,
                msg: 'Usociedad no encontrado',
            });
        }

        console.log('Usociedad encontrado:', usociedad); // Debug

        if (usociedad.usuario._id.toString() !== uid) {
            console.log('UID no coincide con el creador del docente'); // Debug
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegio para eliminar este docente',
            });
        }

        usociedad.state = false;
        await usociedad.save();

        return res.json({
            ok: true,
            msg: 'Usociedad eliminado lógicamente',
            usociedad,
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
    getUsuariosSociedad,
    getUsuarioSociedad,
    crearUsociedad,
    actualizarUsociedad,
    eliminarUsociedad
};
