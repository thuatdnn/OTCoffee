const UserModel = require('../models/User');

class UserRepository{
    constructor(){
    };
    async register (body) {
        try {
            let newUser = new UserModel(body);
            await newUser.save()
        }catch (e) {
            console.log(e)
        }
    }

    async getUserByUsername(username) {
        try{
            let user =   await UserModel.findOne({'username': username});
            return user
        }catch(e){
            console.log(e);
        }
    }

    async getUserById(id) {
        try{
            let user =   await UserModel.findById(id);
            return user
        }catch(e){
            console.log(e);
        }
    }
    async resetUser(){
        try{
            await UserModel.remove({});
        }catch(e){
            console.log(e);
        }
    }
}
module.exports = UserRepository;