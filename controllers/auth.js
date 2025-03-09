const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

// Función para validar el formato de un ID de MongoDB
// const esObjectIdValido = (id) => mongoose.Types.ObjectId.isValid(id);


// Obtener todos los docentes activos
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

const crearUsuario = async(req, res = response) => {
    
    const { email, password } = req.body;
    
    try{
        let usuario = await Usuario.findOne({ email });
        console.log(usuario);

        if(usuario){
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            });
        }
        
        usuario = new Usuario( req.body );

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        //Generar JWT Jason Web Token
       const token = await generarJWT( usuario.id, usuario.name ); 

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
const loginUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    try{
        const usuario = await Usuario.findOne({ email });

        console.log(usuario);

        if( !usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }

        //Confirmar los passwords
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }
        //Generar JWT Jason Web Token
       const token = await generarJWT( usuario.id, usuario.name ); 


        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token,
            rol: usuario.rol
        })
        
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }

        
}




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



//Revalidar token
const revalidarToken = async(req, res = response) => {
    const{ uid, name } = req;

    //Generar JWT Jason Web Token y retornarlo en esta peticion

    const token = await generarJWT( uid, name ); 

    res.json({
        ok: true,
        uid,
        name,
        token,
        rol
    })
}



module.exports = { 
    crearUsuario,
    loginUsuario,
    revalidarToken,
    getUsuarios,
    getUsuario
}