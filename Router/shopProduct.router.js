import express from 'express';
import { addShopproduct, delete_Shopproduct, getShopproducts, getshopproduct, updateShopProduct } from '../Controller/shopProduct.controller';

const router = express.Router();

router.get('/get-Shop-products',getShopproducts);

router.get('/get-shop_product/:shop_id',getshopproduct);

router.post('/add_product',addShopproduct);

router.put('/update_ShopProduct/:update_id',updateShopProduct);

router.delete('/delete_Shopproduct/:shop_id',delete_Shopproduct);

export default router;