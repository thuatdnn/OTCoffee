import CategoryModel from '../models/Category'

class CategoryRepository {
    constructor(){

    }

    async addCategory(){
        try {
            let newCategory = new CategoryModel(body);
            const result = await newCategory.save();
            return result;
        }catch (e){
            console.log(e);
        }
    }
    async updateCategory(id, body){
        try{
            let category  = await CategoryModel.findByIdAndUpdate(id, body)
            return category
        }catch(e){
            console.log(e);
        }
    }
    async deleteCategory(id, body){
        try{
            let category  = await CategoryModel.findByIdAndRemove(id, body)
            return category
        }catch(e){
            console.log(e);
        }
    }

    async getCategoryList(limit, page){
        try{
            let category  = await CategoryModel.find({}).limit(limit).skip(page*limit);
            return category
        }catch(e){
            console.log(e);
        }
    }
    async resetCategory(){
        try{
            await CategoryModel.remove({});
        }catch(e){
            console.log(e);
        }
    }
}

module.exports = CategoryRepository;