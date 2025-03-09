const { response } = require('express');
const Graduado = require('../models/Graduado');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Función para validar el formato de un ID de MongoDB
const esObjectIdValido = (id) => mongoose.Types.ObjectId.isValid(id);

// Obtener todos los docentes
// Obtener todos los docentes activos
const getGraduados = async (req, res) => {
    try {
        const graduados = await Graduado.find({ state: true })
            .populate('usuario', 'name email password rol');

        res.json({
            ok: true,
            graduados
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener los graduados'
        });
    }
};


// Obtener un docente por ID
const getGraduado = async (req, res) => {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
        return res.status(400).json({
            ok: false,
            msg: 'ID inválido'
        });
    }

    try {
        const graduados = await Graduado.findOne({ _id: id, state: true })
            .populate('usuario', 'name email password rol');

        if (!docente) {
            return res.status(404).json({
                ok: false,
                msg: 'Graduado no encontrado o inactivo'
            });
        }

        res.json({
            ok: true,
           graduados
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener el graduado'
        });
    }
};

// Crear un nuevo graduado
const crearGraduado = async (req, res = response) => {
    const { name, email, password, rol, imagen, gestion,description,excelencia,socialLinks, state} = req.body;
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
        
        // Guardar el Usuario
        await usuario.save();

        // Crear el Graduado, asociando el Usuario creado
        const graduado = new Graduado({
            usuario: usuario._id, // Usamos el _id del usuario creado
            imagen,
            gestion,
            description,
            excelencia,
            socialLinks,
            state
        });

        // Guardar el Graduado
        await graduado.save();

        res.status(201).json({
            ok: true,
            graduado // Retornar el graduado creado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al crear el graduado'
        });
    }
};



// Actualizar un docente
const actualizarGraduado = async (req, res = response) => {
    const graduadoId = req.params.id;
    const uid = req.uid; // ID del usuario autenticado

    // Validar el ID del graduado
    if (!esObjectIdValido(graduadoId)) {
        return res.status(400).json({
            ok: false,
            msg: 'ID de graduado inválido'
        });
    }

    try {
        // Buscar graduado por ID y cargar el usuario asociado
        const graduado = await Graduado.findById(graduadoId).populate('usuario', 'name email rol');

        // Si no existe el graduado
        if (!graduado) {
            return res.status(404).json({
                ok: false,
                msg: 'Graduado no existe con ese ID'
            });
        }

        console.log('Graduado encontrado:', graduado);
        console.log('ID del usuario autenticado (UID):', uid);

        // Verificar si el usuario autenticado es el propietario del graduado
        // El graduado solo puede ser editado por el usuario que lo creó
        if (graduado.usuario._id.toString() === uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio para editar este graduado'
            });
        }

        // Preparar los datos de la actualización
        const nuevosDatosGraduado = {
            ...req.body, // Campos a actualizar (imagen, redes sociales, etc.)
            usuario: graduado.usuario._id // Asegurar que el usuario no cambie
        };

        // Actualizar el graduado
        const graduadoActualizado = await Graduado.findByIdAndUpdate(
            graduadoId,
            nuevosDatosGraduado,
            { new: true }
        );

        // Devolver el graduado actualizado
        return res.json({
            ok: true,
            graduado: graduadoActualizado
        });

    } catch (error) {
        console.error('Error al actualizar el graduado:', error.message);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
};




// Eliminar un docente de forma lógica
const eliminarGraduado = async (req, res = response) => {
    const graduadoId = req.params.id;
    const uid = req.uid;

    // console.log('Docente ID:', docenteId); // Debug
    // console.log('UID autenticado:', uid); // Debug

    if (!esObjectIdValido(graduadoId)) {
        return res.status(400).json({
            ok: false,
            msg: 'ID de graduado inválido',
        });
    }

    try {
        const graduados = await Graduado.findById(graduadoId).populate('usuario', 'name email');

        if (!graduados) {
            return res.status(404).json({
                ok: false,
                msg: 'Graduado no encontrado',
            });
        }

        console.log('Graduado encontrado:', graduados); // Debug

        if (graduados.usuario._id.toString() === uid) {
            console.log('UID no coincide con el creador del graduado'); // Debug
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegio para eliminar este graduado',
            });
        }

        graduados.state = false;
        await graduados.save();

        return res.json({
            ok: true,
            msg: 'Graduado eliminado lógicamente',
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
    getGraduados,
    getGraduado,
    crearGraduado,
    actualizarGraduado,
    eliminarGraduado
};
