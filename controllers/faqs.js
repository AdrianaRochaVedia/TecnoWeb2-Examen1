const { response } = require('express');
const Faqs = require('../models/Faqs');

const getFaqs = async(req, res = response) => {
    
   // const noticias = await News.find().populate('user', 'name');
    const tutoriales = await Faqs.find({state: true}).populate('user', 'name');
    

    res.json({
        ok:true,
        tutoriales
    });
}


const crearFaqs = async(req, res = response) => {
    //verificar que tenga el evento
    //console.log(req.body);
    const tutorial = new Faqs(req.body);

    try{

        tutorial.user = req.uid;
        tutorial.name = req.name;

        const tutorialGuardado = await tutorial.save();

        return res.json({
            ok:true,
            tutorial: tutorialGuardado
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

// Actualizacion de Faqs

const actualizarFaqs = async(req, res = response) => {
    const tutorialId = req.params.id;
    const uid = req.uid;

    try{
        const tutorial = await Faqs.findById( tutorialId );

        if(!tutorial){        
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            });
        }

        if( tutorial.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            });
        }

        const nuevoTutorial = {
            ...req.body,
            user: uid
        }

        const tutorialActualizado = await Faqs.findByIdAndUpdate( tutorialId, nuevoTutorial, { new: true });

        res.json({
            ok:true,
            tutorial: tutorialActualizado
        });
        
    }catch(error){
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

//eliminacion logica

const eliminarFaqs = async(req, res = response) => {
    
        const tutorialId = req.params.id;
        const uid = req.uid;
    
        try{
            const tutorial = await Faqs.findById( tutorialId );
    
            if(!tutorial){        
                return res.status(404).json({
                    ok: false,
                    msg: 'Faqs no existe por ese id'
                });
            }
    
            if( tutorial.user.toString() !== uid ){
                return res.status(401).json({
                    ok: false,
                    msg: 'No tiene privilegio de eliminar este Faqs'
                });
            }
    
            tutorial.state = false;
    
            await Faqs.findByIdAndUpdate( tutorialId, tutorial, { new: true });
    
            res.json({
                ok:true,
            });
            
        }catch(error){
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador'
            });
        }
    }



module.exports = {
    getFaqs,
    crearFaqs,
    actualizarFaqs,
    eliminarFaqs
}


