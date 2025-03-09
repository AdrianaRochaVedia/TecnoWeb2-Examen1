const Usuario = require('./Usuario');
const { Schema, model } = require('mongoose');

const UsuarioSociedadSchema = Schema({  
        usuario: {
           type: Schema.Types.ObjectId,
            ref: 'Usuario',
            required: true 
        },
        role: {
            type: String, 
            required: true
        },
        socialLinks: {
            type: [String], 
            default: []
        },
        idsociedad: {
            type: String
        },
        photo: {
            type: String, 
        },
        state: {
            type: Boolean,
            default: true
        }
    
    });
    
module.exports = model('UsuarioSociedad', UsuarioSociedadSchema);