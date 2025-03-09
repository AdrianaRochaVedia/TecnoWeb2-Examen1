const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

// Función para validar el formato de un ID de MongoDB
// const esObjectIdValido = (id) => mongoose.Types.ObjectId.isValid(id);


// Obtener todos los usuarios activos
const getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find({ isDeleted: false });

        res.json({
            ok: true,
            usuarios
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener los usuarios'
        });
    }
};
// Obtener un producto por ID
const getUsuario = async (req, res = response) => {
    const { id } = req.params; 

    try {
        const usuario= await Usuario.findById(id); 

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado'
            });
        }

        res.json({
            ok: true,
            usuario
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener el usuario'
        });
    }
};
// Crear un nuevo producto
const crearUsuario = async (req, res = response) => {
    const { nombre, edad, ocupacion } = req.body;

    try {
        // Crear el producto
        const nuevoUsuario = new Usuario({
            nombre,
            edad,
            ocupacion
        });
        
        console.log(nuevoUsuario);
        await nuevoUsuario.save();

        res.status(201).json({
            ok: true,
            usuario: nuevoUsuario
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al crear el usuario'
        });
    }
};

// Actualizar un producto
const actualizarUsuario = async (req, res = response) => {
    const { id } = req.params; 

    try {
        // Buscar el producto por ID
        const usuario = await Usuario.findById(id);

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado'
            });
        }

        // Actualizar el producto
        const nuevosDatos = { ...req.body };
        const usuarioActualizado = await Usuario.findByIdAndUpdate(id, nuevosDatos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar el usuario'
        });
    }
};

// Eliminación lógica de un producto
const eliminarUsuario = async (req, res = response) => {
    const { id } = req.params; // ID del producto a eliminar

    try {
        // Buscar el centro por ID
        const usuario = await Usuario.findById(id);

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado'
            });
        }

        // Realizar la eliminación lógica
        usuario.isDeleted = true;
        await usuario.save();

        res.json({
            ok: true,
            msg: 'Usuario eliminado lógicamente',
            usuario
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar el usuario'
        });
    }
};


//Revalidar token
// const revalidarToken = async(req, res = response) => {
//     const{ uid, name } = req;

//     //Generar JWT Jason Web Token y retornarlo en esta peticion

//     const token = await generarJWT( uid, name ); 

//     res.json({
//         ok: true,
//         uid,
//         name,
//         token,
//         rol
//     })
// }



module.exports = { 
    crearUsuario,
    // loginUsuario,
    // revalidarToken,
    getUsuarios,
    getUsuario,
    actualizarUsuario,
    eliminarUsuario
}