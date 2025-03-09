const { response } = require('express');
const Noticia = require('../models/News');

const getNoticiaPorId = async (req, res = response) => {
    const noticiaId = req.params.id; // Obtener el ID desde los parámetros de la solicitud

    try {
        // Buscar la noticia activa por ID
        const noticia = await Noticia.findOne({ _id: noticiaId, state: true })
            .populate('user', 'name'); // Obtener solo el nombre del usuario

        // Si no se encuentra la noticia
        if (!noticia) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontró la noticia con ese ID'
            });
        }

        res.json({
            ok: true,
            noticia
        });
    } catch (error) {
        console.error('Error al obtener la noticia:', error.message);
        res.status(500).json({
            ok: false,
            msg: 'Hubo un error al obtener la noticia'
        });
    }
};

const getNoticias = async (req, res = response) => {
    try {
        // Limite de noticias por pagina
        const limit = parseInt(req.header('limit'));
        const page = parseInt(req.header('page'));

        if (!limit || !page || limit <= 0 || page <= 0) {
            return res.status(400).json({
                ok: false,
                msg: 'Es obligatorio proporcionar valores válidos para "limit" y "page".',
            });
        }

        const offset = (page - 1) * limit;
        
        const total = await Noticia.countDocuments({ state: true });


        const noticias = await Noticia.find({ state: true })
            .populate('user', 'name')
            .skip(offset)
            .limit(limit);

        if (noticias.length === 0) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontraron noticias',
            });
        }

        res.json({
            ok: true,
            noticias,
            total
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Hubo un error al obtener las noticias',
        });
    }
};

   // const noticias = await News.find().populate('user', 'name');
    // const noticias = await Noticia.find({state: true}).populate('tittle', 'user');
    

    // res.json({
    //     ok:true,
    //     noticias
    // });


const crearNoticias = async (req, res = response) => {
    try {
        // Verificar que req.body tenga datos válidos
        console.log('Datos recibidos:', req.body);

        // Crear noticia con los datos del cuerpo de la solicitud
        let noticia = new Noticia(req.body);

        // Asegurarse de que req.uid esté definido
        if (!req.uid) {
            throw new Error('UID no definido. Verifica el middleware de autenticación.');
        }

        noticia.user = req.uid;

        // Guardar noticia en la base de datos
        const noticiaGuardado = await noticia.save();

        // Obtener la noticia nuevamente (si necesitas actualizar más campos)
        noticia = await Noticia.findById(noticiaGuardado._id);
        noticia.state = true;

        return res.json({
            ok: true,
            noticia: noticiaGuardado,
        });
    } catch (error) {
        console.error('Error al crear noticia:', error.message);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }
};



const actualizarNoticia = async (req, res = response) => {
    const noticiaId = req.params.id; // ID de la noticia a actualizar
    const uid = req.uid; // ID del usuario que realiza la solicitud

    try {
        // Buscar noticia por ID
        const noticia = await Noticia.findById(noticiaId);

        // Validar si la noticia existe
        if (!noticia) {
            return res.status(404).json({
                ok: false,
                msg: 'Noticia no existe con ese ID',
            });
        }

        // Verificar si el usuario es el propietario de la noticia
        if (noticia.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio para editar esta noticia',
            });
        }

        // Preparar los datos de la actualización
        const nuevaNoticia = {
            ...req.body, // Campos a actualizar
            user: uid, // Asegurar que el usuario propietario no cambie
        };

        // Actualizar la noticia
        const noticiaActualizada = await Noticia.findByIdAndUpdate(
            noticiaId,
            nuevaNoticia,
            { new: true } // Retornar la noticia actualizada
        );

        // Responder con la noticia actualizada
        return res.json({
            ok: true,
            noticia: noticiaActualizada,
        });
    } catch (error) {
        // Capturar errores inesperados
        console.error('Error al actualizar la noticia:', error.message);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }
};


//eliminacion logica

const eliminarNoticia = async (req, res = response) => {
    const noticiaId = req.params.id;
    const uid = req.uid;

    try {
        const noticia = await Noticia.findById(noticiaId);

        if (!noticia) {
            return res.status(404).json({
                ok: false,
                msg: 'Noticia no existe por ese id'
            });
        }

        if (noticia.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar esta noticia'
            });
        }

        noticia.state = false;

        await noticia.save();

        res.json({
            ok: true,
            msg: 'Noticia eliminada lógicamente',
            noticia
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
    getNoticiaPorId,
    getNoticias,
    crearNoticias,
    actualizarNoticia,
    eliminarNoticia
}

