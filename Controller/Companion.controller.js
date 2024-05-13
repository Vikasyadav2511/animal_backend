import CompanionModel from "../Model/Companion.model";
import multer from "multer";
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        if(fs.existsSync('uploads/Companion')){
            cb(null,"uploads/Companion")
        }else{
            fs.mkdirSync("uploads/Companion")
            cb(null,"uploads/Companion")
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

export const getCompanions = async(req, res)=>{
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

    // const categoriesData = await CategoryModel.find(filter);
        const CompanionPet = await CompanionModel.find(filter).populate("comp_category")
        //     {
        //         $lookup: {
        //             from: "categories",
        //             localField: "comp_category",
        //             foreignField: "_id",
        //             as: "comp_category"
        //         },
        //     },
        //     { $unwind: "$comp_category" },
        //     { $sort: { '_id': 1}},
        //     { $limit: 500},
        // ]);
        
        if(CompanionPet){
            return res.status(200).json({
                data:CompanionPet,
                message : 'Fetched',
                filepath: 'http://localhost:8002/uploads/Companion'
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


export const addCompanion = (req, res)=>{
    try {
        const addImage = upload.single('image');
        addImage(req, res, function(err) {
            if(err) return res.status(400).json({message: err.message})
            const {title, breed, description ,comp_category,color,age,sex,size,Coatlength,Health,Good,Characteristics,housetrained} = req.body
            
            let img = null;
            if(req.file){
                img = req.file.filename;
            }

            const addPets = new CompanionModel({
                title: title,
                breed: breed,
                description: description,
                comp_category:comp_category,
                image : img,
                age:age,
                color:color,
                sex:sex,
                Characteristics:Characteristics,
                size:size,
                Coatlength:Coatlength,
                Health:Health,
                Good:Good,
                housetrained:housetrained
            })
            addPets.save()

            // console.log(addPets)
            if(addPets){
                return res.status(201).json({
                    data:addPets,
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

export const getCompanion = async (req, res)=>{
    try {

        const CompanionID = req.params.adoption_id;
        const Adopt = await CompanionModel.findOne({_id: CompanionID});

        if(Adopt){
            return res.status(200).json({
                data : Adopt,
                message: 'Fetched',
                filepath: 'http://localhost:8002/uploads/Companion'

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


export const updateCompanion = async (req, res) =>{
    try {
        const updateImg = upload.single('image');
        updateImg(req, res, async function(err){
            if(err) return res.status(400).json({message: err.message})

            const updateID = req.params.update_id;
            const existUpdate = await CompanionModel.findOne({_id: updateID});

            const {title, breed, description ,comp_category,color,age,sex,size,Coatlength,Health,Good,housetrained,Characteristics} = req.body;

            let img = existUpdate.image;
            if(req.file){
                img = req.file.filename;

                if(fs.existsSync('./uploads/Companion/' + existUpdate.image)){
                    fs.unlinkSync('./uploads/Companion/' + existUpdate.image)
                }
            }

            const updateAdoption = await CompanionModel.updateOne({_id: updateID},{
                $set:{
                    title: title,
                    breed: breed,
                    description: description,
                    comp_category:comp_category,
                    image : img,
                    age:age,
                    color:color,
                    sex:sex,
                    Characteristics:Characteristics,
                    size:size,
                    Coatlength:Coatlength,
                    Health:Health,
                    Good:Good,
                    housetrained:housetrained
                }
            })
            if(updateAdoption.acknowledged){
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

export const deleteCompanion = async (req, res)=>{
    try {
        const adoptionID = req.params.adoption_id;
        const existPet = await CompanionModel.findOne({_id: adoptionID});
        const adoptPet = await CompanionModel.deleteOne({_id: adoptionID});

        if(adoptPet.acknowledged){
            
            if(fs.existsSync('./uploads/Companion/' + existPet.image)){
                fs.unlinkSync('./uploads/Companion/' + existPet.image)
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