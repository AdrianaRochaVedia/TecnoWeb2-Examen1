const { Schema, model } = require('mongoose');

const FaqsSchema = Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    start: {
        type: Date,
        required: true
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },


    image: {
        type: String
    },
    state: {
        type: String,
        default: true
    },


});

FaqsSchema.method('toJSON', function(){
   const { _v, _id, ...object } =  this.toObject();
   object.id = _id;
   return object;
});

module.exports = model('Faqs', FaqsSchema);