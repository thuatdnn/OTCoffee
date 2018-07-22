import TransactionModel from '../models/Transaction'

class TransactionRepository {
    constructor(){

    }

    async addTransaction(){
        try {
            let newTransaction = new TransactionModel(body);
            const result = await newTransaction.save();
            return result;
        }catch (e){
            console.log(e);
        }
    }
    async getTransactionById(id) {
        try{
            let transaction =   await TransactionModel.findById(id);
            return transaction
        }catch(e){
            console.log(e);
        }
    }
    async updateTransaction(id, body){
        try{
            let transaction  = await TransactionModel.findByIdAndUpdate(id, body)
            return transaction
        }catch(e){
            console.log(e);
        }
    }
    async deleteTransaction(id, body){
        try{
            let transaction  = await TransactionModel.findByIdAndRemove(id, body);
            return transaction
        }catch(e){
            console.log(e);
        }
    }

    async getTransactionList(limit, page){
        try{
            let transaction  = await TransactionModel.find({}).limit(limit).skip(page*limit);
            return transaction
        }catch(e){
            console.log(e);
        }
    }
    async resetTransaction(){
        try{
            await TransactionModel.remove({});
        }catch(e){
            console.log(e);
        }
    }
}

module.exports = TransactionRepository;