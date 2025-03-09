const Usuario = require('./Usuario');
const { Schema, model } = require('mongoose');

const GraduadoSchema = Schema({
        usuario: {
           type: Schema.Types.ObjectId,
            ref: 'Usuario',
            required: true 
        },
       imagen: {
        type: String,
        required: function() {
            return this.usuario && this.usuario.isGraduado === true;
            }
        },
        gestion: {
            type:String
        },
        description: {
            type: String
        },
        excelencia: {
            type: Boolean
        },
        socialLinks: {
        type: [String], // array de URLs
        default: []
        },
        state: {
            type: Boolean,
            default: true
        }
    
 });

module.exports = model('Graduado', GraduadoSchema);