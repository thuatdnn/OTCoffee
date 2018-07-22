import TableModel from '../models/Table'

class TableRepository {
    constructor(){

    }

    async addTable(){
        try {
            let newTable = new TableModel(body);
            const result = await newTable.save();
            return result;
        }catch (e){
            console.log(e);
        }
    }
    async updateTable(id, body){
        try{
            let table  = await TableModel.findByIdAndUpdate(id, body)
            return table
        }catch(e){
            console.log(e);
        }
    }
    async deleteTable(id, body){
        try{
            let table  = await TableModel.findByIdAndRemove(id, body)
            return table
        }catch(e){
            console.log(e);
        }
    }

    async getTableList(limit, page){
        try{
            let table  = await TableModel.find({}).limit(limit).skip(page*limit);
            return table
        }catch(e){
            console.log(e);
        }
    }
    async resetTable(){
        try{
            await TableModel.remove({});
        }catch(e){
            console.log(e);
        }
    }
}

module.exports = TableRepository;