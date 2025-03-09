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

//Funcion para crear usuario
const crearUsuario = async(req, res = response) => {
    
    const { nombre, edad, ocupacion } = req.body;
    
    try{
        
        let usuario = new Usuario( req.body );

        //Encriptar contraseña
        // const salt = bcrypt.genSaltSync();
        // usuario.password = bcrypt.hashSync(password, salt);

        // await usuario.save();

        //Generar JWT Jason Web Token
       const token = await generarJWT( usuario.id, usuario.nombre ); 

        res.status(201).json({
            ok: true,
           uid: usuario.id,
           name: usuario.name,
           token
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
    
}

//Login de usuario
// const loginUsuario = async(req, res = response) => {

//     const { email, password } = req.body;

//     try{
//         const usuario = await Usuario.findOne({ email });

//         console.log(usuario);

//         if( !usuario ){
//             return res.status(400).json({
//                 ok: false,
//                 msg: 'El usuario no existe con ese email'
//             });
//         }

//         //Confirmar los passwords
//         const validPassword = bcrypt.compareSync(password, usuario.password);

//         if( !validPassword ){
//             return res.status(400).json({
//                 ok: false,
//                 msg: 'Password incorrecto'
//             });
//         }
//         //Generar JWT Jason Web Token
//        const token = await generarJWT( usuario.id, usuario.name ); 


//         res.json({
//             ok: true,
//             uid: usuario.id,
//             name: usuario.name,
//             token,
//             rol: usuario.rol
//         })
        
//     }catch(error){
//         console.log(error);
//         res.status(500).json({
//             ok: false,
//             msg: 'Por favor hable con el administrador'
//         })
//     }

        
// }




// const esObjectIdValido = (id) => mongoose.Types.ObjectId.isValid(id);

// Obtener un docente por ID
const getUsuario = async (req, res) => {
    const { id } = req.params;

    // if (!esObjectIdValido(id)) {
    //     return res.status(400).json({
    //         ok: false,
    //         msg: 'ID inválido'
    //     });
    // }

    try {
        const usuarios = await Usuario.findOne({ _id: id, isDeleted: false });

        if (!usuarios) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado o inactivo'
            });
        }

        res.json({
            ok: true,
            usuarios
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener el usuario'
        });
    }
};


// Actualizar un docente
const actualizarUsuario = async (req, res = response) => {
    const usuarioId = req.params.id;
    const uid = req.uid; // ID del usuario autenticado

    // Validar el ID del us
    if (!esObjectIdValido(usuarioId)) {
        return res.status(400).json({
            ok: false,
            msg: 'ID del usuario inválido'
        });
    }

    try {
        // Buscar usuario por ID y cargar el usuario asociado
        const usuario = await Usuario.findById(usuarioId).populate('usuario', 'nombre edad ocupacion');

        // Si no existe el usuario
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe con ese ID'
            });
        }

        console.log('Usuario encontrado:', usuario);
        console.log('ID del usuario autenticado (UID):', uid);

        //Verificar si el usuario autenticado es el propietario del docente
        //El docente solo puede ser editado por el usuario que lo creó
        // if (usuario._id.toString() !== uid) {
        //     return res.status(401).json({
        //         ok: false,
        //         msg: 'No tiene privilegio para editar este usuario'
        //     });
        // }

        // Preparar los datos de la actualización
        const nuevosDatosUsuario = {
            ...req.body, // Campos a actualizar (imagen, redes sociales, etc.)
            usuario: usuario._id // Asegurar que el usuario no cambie
        };

        // Actualizar el docente
        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            usuarioId,
            nuevosDatosUsuario,
            { new: true }
        );

        // Devolver el docente actualizado
        return res.json({
            ok: true,
            usuario: usuarioActualizado
        });

    } catch (error) {
        console.error('Error al actualizar el usuario:', error.message);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
};



// Eliminar un docente de forma lógica
const eliminarUsuario = async (req, res = response) => {
    const usuarioId = req.params.id;
    const uid = req.uid;

    console.log('Usuario ID:', usuarioId); // Debug
    console.log('UID autenticado:', uid); // Debug

    if (!esObjectIdValido(usuarioId)) {
        return res.status(400).json({
            ok: false,
            msg: 'ID de usuario inválido',
        });
    }

    try {
        const usuario = await Usuario.findById(usuarioId).populate('usuario', 'nombre edad ocupacion');

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado',
            });
        }

        console.log('Usuario encontrado:', usuario); // Debug

        // if (docente.usuario._id.toString() !== uid) {
        //     console.log('UID no coincide con el creador del docente'); // Debug
        //     return res.status(403).json({
        //         ok: false,
        //         msg: 'No tiene privilegio para eliminar este docente',
        //     });
        // }

        usuario.state = false;
        await usuario.save();

        return res.json({
            ok: true,
            msg: 'Usuario eliminado lógicamente',
            usuario,
        });
    } catch (error) {
        console.error('Error al intentar eliminar el usuario:', error.message);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor. Hable con el administrador.',
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