const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const TableSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    status:{
        type: Boolean,
        required: true
    }
})
module.exports = mongoose.model('Table', TableSchema);