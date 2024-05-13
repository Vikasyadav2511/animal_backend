import shopProductModel from "../Model/shopProduct.model";
import multer from "multer";
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        if(fs.existsSync('uploads/shopproduct')){
            cb(null,"uploads/shopproduct")
        }else{
            fs.mkdirSync("uploads/shopproduct")
            cb(null,"uploads/shopproduct")
        }
    },
    filename: function(req,file,cb){
        const uniquesuufix = Date.now();
        const orgName = file.originalname;
        const imagarr = orgName.split('.');
        imagarr.pop();

        const fName = imagarr.join('.');
        const ext = path.extname(orgName);
        cb(null,fName + "-" + uniquesuufix + ext);
    }
});

const upload = multer({ storage: storage });

export const getShopproducts = async(req, res)=>{
    try {

        const { search } = req.query;

        const generateSearchRgx = (pattern) => new RegExp(`.*${pattern}.*`);

        const searchRgx = generateSearchRgx(search);

        let filter = {}

        if (search) {
            filter = {
                $or: [
                    { title: { $regex: searchRgx, $options: "i" } },

                    // {course_description:{$regex:searchRgx, $options:"i"}}
                ]
            }
        }
        const shopProduct = await shopProductModel.find(filter).populate('category')
        // ([
        //     {
        //         $lookup: {
        //             from: "categories",
        //             localField: "category",
        //             foreignField: "_id",
        //             as: "category"
        //         },
        //     },
        //     { $unwind: "$category" },
        //     { $sort: { '_id': 1}},
        //     { $limit: 10},
        // ]);
        
        if(shopProduct){
            return res.status(200).json({
                data:shopProduct,
                message : 'Fetched',
                filepath: 'http://localhost:8002/uploads/shopproduct'
            })
        }
        return res.status(400).json({
            message: 'Bad request'
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
        
    }
}

export const getshopproduct = async (req, res)=>{
    try {

        const ShopproductID = req.params.shop_id;
        const shop = await shopProductModel.findOne({_id: ShopproductID});

        if(shop){
            return res.status(200).json({
                data : shop,
                message: 'Fetched',
                filepath: 'http://localhost:8002/uploads/shopproduct'

            })
        }

        return res.status(400).json({
            message: 'Bad request'
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

  export const addShopproduct = (req, res)=>{
    try {
        const addImage = upload.single('image');
        addImage(req, res, function(err) {
            if(err) return res.status(400).json({message: err.message})
            const {title, description, category,price,shop_cart, shop_name} = req.body
            
            let img = null;
            if(req.file){
            img = req.file.filename;
            }
            console.log(img)
            const addShop = new shopProductModel({
                title: title,
                description: description,
                image : img,
                 category:category, 
                 price:price,
                 shop_cart:shop_cart,
                 shop_name:shop_name
            })
            addShop.save()

            if(addShop){
                return res.status(201).json({
                    data:addShop,
                    message: 'Created'
                })
            }
            return res.status(400).json({
                message: 'Bad request'
            })

        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const updateShopProduct = async (req, res) =>{
    try {
        const updateImg = upload.single('image');
        updateImg(req, res, async function(err){
            if(err) return res.status(400).json({message: err.message})

            const updateID = req.params.update_id;
            const existUpdate = await shopProductModel.findOne({_id: updateID});

            const {title, description, category,price,shop_cart, shop_name} = req.body;

            let img = existUpdate.image;
            if(req.file){
                img = req.file.filename;

                if(fs.existsSync('./uploads/shopproducts/' + existUpdate.image)){
                    fs.unlinkSync('./uploads/shopproducts/' + existUpdate.image)
                }
            }

            const UpdateShop = await shopProductModel.updateOne({_id: updateID},{
                $set:{
                    title: title,
                    description: description,
                    image : img,
                     category:category, 
                     price:price,
                     shop_cart:shop_cart,
                     shop_name:shop_name
                }
            })
            if(UpdateShop.acknowledged){
                return res.status(200).json({
                    message: 'Updated'
                })
            } 
            return res.status(400).json({
                message: 'Bad request'
            })  
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message
        })
        
    }
}

export const delete_Shopproduct = async (req, res)=>{
    try {
        const shopID = req.params.shop_id;
        const existPet = await shopProductModel.findOne({_id: shopID});
        const adoptPet = await shopProductModel.deleteOne({_id: shopID});

        if(adoptPet.acknowledged){
            
            if(fs.existsSync('./uploads/shopproduct/' + existPet.image)){
                fs.unlinkSync('./uploads/shopproduct/' + existPet.image)
            }

            return res.status(200).json({
                message: 'deleted'
            })
        }

        return res.status(400).json({
            message: 'Bad request'
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
        
    }
}