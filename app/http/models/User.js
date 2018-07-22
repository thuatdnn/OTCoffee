'user strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const UserSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        default: "Customer"
    },
    point:{
        type: Number,
        default: 0
    },
    avatar:{
        type: String
    }
},{
    versionKey: false // You should be aware of the outcome after set to false
});

//Pre-hook, hash password
UserSchema.pre('save', async function (next){
    //'this' refers to the current document about to be saved
    let user = this;
    user.password = await bcrypt.hash(this.password, 10);
    next();
});
UserSchema.methods.isValidPassword = async function(password){
    const user =this;
    const compare = await bcrypt.compare(password, user.password);
    return compare;
};

module.exports = mongoose.model('User', UserSchema);