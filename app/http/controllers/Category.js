import CategoryRepository from '../repositories/Category';
import Response from '../Response';

class CategoryCtrl extends Response{
    constructor(){
        super();
        this.categoryRepo = new CategoryRepository;
    }

    async addCategory(req, res){
        let options={};
        let newCategory = await this.categoryRepo.addCategory(req.body)
        return this.success(res, options)
    }

    async deleteCategory(req, res){

    }

    async updateCategory(req, res){

    }

}
module.exports = CategoryCtrl;