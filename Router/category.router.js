import express from 'express'
import { addCategory, deleteCategory, getCategories, getCategory, softDeleteCat, updateCategory } from '../Controller/Category.controller';

const router= express.Router();

router.get("/get-categories",getCategories);

router.post("/add-category",addCategory);

router.get("/get-category/:category_id",getCategory);

router.put('/update-categories/:category_id',updateCategory);

router.delete('/cat-softdelete/:category_id',softDeleteCat);  

router.delete('/Delete-category/:category_id',deleteCategory);  


export default router;
