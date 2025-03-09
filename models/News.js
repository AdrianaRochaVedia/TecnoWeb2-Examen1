const { Schema, model } = require('mongoose');

const NewsSchema = Schema({
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

    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    /*views: {
        type: Number,
        default: 0
    },*/
    comments: {
        type: Number,
        default: 0
    },
    tags: {
        type: [String]
    },
    category: {
        type: String
    },
    image: {
        type: String
    },
    state: {
        type: String,
        default: true
    }

});

NewsSchema.method('toJSON', function(){
   const { _v, _id, ...object } =  this.toObject();
   object.id = _id;
   return object;
});

module.exports = model('News', NewsSchema);