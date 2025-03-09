const { response } = require('express');
const Evento = require('../models/Evento');

const getEventoPorId = async (req, res = response) => {
    const eventoId = req.params.id; // Obtener el ID desde los parámetros de la solicitud

    try {
        // Buscar la noticia activa por ID
        const eventos = await Evento.findOne({ _id: eventoId, state: true })
            .populate('user', 'name'); // Obtener solo el nombre del usuario

        // Si no se encuentra la noticia
        if (!eventos) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontró el evento con ese ID'
            });
        }

        res.json({
            ok: true,
            eventos
        });
    } catch (error) {
        console.error('Error al obtener el evento', error.message);
        res.status(500).json({
            ok: false,
            msg: 'Hubo un error al obtener la noticia'
        });
    }
};

const getEventos = async(req, res = response) => {
    try{
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

        const eventos = await Evento.find({state: true}).populate('user', 'name').skip(offset)
                .limit(limit);


        res.json({
            ok:true,
            eventos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Hubo un error al obtener los eventos',
        });
    }
}


const crearEvento = async(req, res = response) => {
    //verificar que tenga el evento
    //console.log(req.body);
    const evento = new Evento(req.body);

    try{

        evento.user = req.uid;

        const eventoGuardado = await evento.save();

        return res.json({
            ok:true,
            evento: eventoGuardado
        });
        
    }catch(error){
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

    // res.json({
    //     ok:true,
    //     msg: 'crearEventos'

    // });
}


 const actualizarEvento = async (req, res = response) => {
     const eventoId = req.params.id; // ID de la noticia a actualizar
     const uid = req.uid; // ID del usuario que realiza la solicitud
 
     try {
         // Buscar evento por ID
         const evento = await Evento.findById(eventoId);
 
         // Validar si el evento existe
         if (!evento) {
             return res.status(404).json({
                 ok: false,
                 msg: 'Evento no existe con ese ID',
             });
         }
 
         // Verificar si el usuario es el propietario de la noticia
         if (evento.user.toString() !== uid) {
             return res.status(401).json({
                 ok: false,
                 msg: 'No tiene privilegio para editar este evento',
             });
         }
 
         // Preparar los datos de la actualización
         const nuevaEvento = {
             ...req.body, // Campos a actualizar
             user: uid, // Asegurar que el usuario propietario no cambie
         };
 
         // Actualizar la noticia
         const eventoActualizada = await Evento.findByIdAndUpdate(
             eventoId,
             nuevaEvento,
             { new: true } // Retornar la noticia actualizada
         );
 
         // Responder con la noticia actualizada
         return res.json({
             ok: true,
             evento: eventoActualizada,
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
 
 const eliminarEvento = async (req, res = response) => {
     const eventoId = req.params.id;
     const uid = req.uid;
 
     try {
         const evento = await Evento.findById(eventoId);
 
         if (!evento) {
             return res.status(404).json({
                 ok: false,
                 msg: 'Evento no existe por ese id'
             });
         }
 
         if (evento.user.toString() !== uid) {
             return res.status(401).json({
                 ok: false,
                 msg: 'No tiene privilegio de eliminar este evento'
             });
         }
 
         evento.state = false;
 
         await evento.save();
 
         res.json({
             ok: true,
             msg: 'Evento eliminado lógicamente',
             evento
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
    getEventos,
    getEventoPorId,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}


