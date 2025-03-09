const { response } = require('express');
const Empresas = require('../models/EmpresasAliadas');

// const getEmpresa = async(req, res = response) => {
    
//    // const noticias = await News.find().populate('user', 'name');
//     const empresa = await Empresas.find({state: true});
    

//     res.json({
//         ok:true,
//         empresa
//     });
// }

const getEmpresa = async(req, res = response) => {
    try {
        // Buscar las empresas aliadas con estado activo
        const empresas = await Empresas.find({ state: true });

        // Verificar si se encontraron empresas
        if (empresas.length === 0) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontraron empresas aliadas activas'
            });
        }

        // Responder con las empresas encontradas
        return res.json({
            ok: true,
            empresas
        });
    } catch (error) {
        // Manejo de errores
        console.error('Error al obtener las empresas:', error.message);
        return res.status(500).json({
            ok: false,
            msg: 'Hubo un error al obtener las empresas aliadas'
        });
    }
};


const crearEmpresa = async (req, res = response) => {
    try {
        // Verificar que req.body tenga datos válidos
        console.log('Datos recibidos:', req.body);

        // Crear noticia con los datos del cuerpo de la solicitud
        let empresa  = new Empresas(req.body);

        // Asegurarse de que req.uid esté definido
        if (!req.uid) {
            throw new Error('UID no definido. Verifica el middleware de autenticación.');
        }

        empresa.user = req.uid;

        // Guardar noticia en la base de datos
        const empresaGuardado = await empresa.save();

        // Obtener la noticia nuevamente (si necesitas actualizar más campos)
        empresa = await Empresas.findById(empresaGuardado._id);
        empresa.state = true;

        return res.json({
            ok: true,
            empresa: empresaGuardado,
        });
    } catch (error) {
        console.error('Error al crear noticia:', error.message);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }
};



const actualizarEmpresa = async (req, res = response) => {
    const empresaId = req.params.id; 
    const uid = req.uid; 

    try {
        // Buscar empresa por ID
        const empresa = await Empresas.findById(empresaId);

        // Validar si la empresa existe
        if (!empresa) {
            return res.status(404).json({
                ok: false,
                msg: 'Empresa no existe con ese ID',
            });
        }


        // Verificar si el usuario es el propietario de la empresa
        // if (empresa.user.toString() !== uid) {
        //     return res.status(401).json({
        //         ok: false,
        //         msg: 'No tiene privilegio para editar la empresa',
        //     });
        // }

        // Preparar los datos de la actualización
        const nuevaEmpresa = {
            ...req.body, 
            user: uid, 
        };

        // Actualizar la empresa
        const empresaActualizada = await Empresas.findByIdAndUpdate(
            empresaId,
            nuevaEmpresa,
            { new: true } 
        );

        return res.json({
            ok: true,
            empresa: empresaActualizada,
        });
    } catch (error) {
        // Capturar errores inesperados
        console.error('Error al actualizar la empresa:', error.message);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }
};



//eliminacion logica

const eliminarEmpresa = async (req, res = response) => {
    const empresaId = req.params.id;
    const uid = req.uid;

    try {
        const empresa = await Empresas.findById(empresaId);

        if (!empresa) {
            return res.status(404).json({
                ok: false,
                msg: 'Empresa no existe por ese id'
            });
        }

        empresa.state = false;

        await empresa.save();

        res.json({
            ok: true,
            msg: 'Empresa eliminada lógicamente',
            empresa
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
};




module.exports = {
    getEmpresa,
    crearEmpresa,
    actualizarEmpresa,
    eliminarEmpresa
}

