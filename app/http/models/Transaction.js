const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TransactionSchema = new Schema({
    order:[{
        fb:{
            type: Schema.Types.ObjectId,
            ref: 'FB',
            required: true
        },
        quantity:{
            type: Number,
            min: 1,
            required: true
        }
    }],
    staffId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tableId:{
        type: Schema.Types.ObjectId,
        ref: 'Table',
        required: true
    },
    status:{
        type: String,
        required: true,
        enum: ['Received', 'Processing', 'Done']
    }
});
module.exports = mongoose.model('Transaction', TransactionSchema);