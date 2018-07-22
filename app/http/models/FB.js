const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const FBSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
        min: 20,
        max: 100,
        required: true
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
    price:{
        type: Number,
        required: true
    },
    available:{
        type: Boolean,
        required: true,
        default: true
    },
    image:{
        type: [String]
    }
});
module.exports = mongoose.model('FB', FBSchema);