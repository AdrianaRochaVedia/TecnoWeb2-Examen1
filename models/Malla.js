const { Schema, model } = require('mongoose');

const MallaSchema = Schema({
    materia: {
        type: String,
        required: true
    },
    creditos: {
        type: String,
        required: true
    },
    competenciasAsig: {
        type: String
    },
    competenciasGen: {
        type: String
    },
    description: {
        type: String
    },
    video: {
        type: String
    }

});

MallaSchema.method('toJSON', function(){
   const { _v, _id, ...object } =  this.toObject();
   object.id = _id;
   return object;
});

module.exports = model('Faqs', MallaSchema);