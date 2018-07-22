import FBModel from '../models/FB'

class FBRepository {
    constructor(){

    }

    async addFB(){
        try {
            let newFB = new FBModel(body);
            const result = await newFB.save();
            return result;
        }catch (e){
            console.log(e);
        }
    }
    async getFBById(id) {
        try{
            let fb =   await FBModel.findById(id);
            return fb
        }catch(e){
            console.log(e);
        }
    }
    async updateFB(id, body){
        try{
            let fb  = await FBModel.findByIdAndUpdate(id, body)
            return fb
        }catch(e){
            console.log(e);
        }
    }
    async deleteFB(id, body){
        try{
            let fb  = await FBModel.findByIdAndRemove(id, body);
            return fb
        }catch(e){
            console.log(e);
        }
    }

    async getFBList(limit, page){
        try{
            let fb  = await FBModel.find({}).limit(limit).skip(page*limit);
            return fb
        }catch(e){
            console.log(e);
        }
    }
    async resetFB(){
        try{
            await FBModel.remove({});
        }catch(e){
            console.log(e);
        }
    }
}

module.exports = FBRepository;