import CategoryModel from "../Model/Category.model";


export const addCategory = (req,res)=>{
    try {
        const {title, description} = req.body
        const save_category = new CategoryModel({
            title:title,
            description:description
        });

        save_category.save();

        if(save_category){
            return res.status(201).json({
                data:save_category,
                message:"created"
            });
        }

        return res.status(400).json({
            message: "Bad Request"
        })
        
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
        
    }
}


export const getCategories = async (req, res) => {
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

        // const getCat = await CategoryModel.find(filter)
      const categoriesData = await CategoryModel.find(filter);
      if (categoriesData) {
        return res.status(200).json({
          data: categoriesData,
          message: "Success",
        });
      }
      return res.status(400).json({
        message:"Bad Request"
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
};

export const getCategory = async (req, res) => {
    try {
      const categoryID = req.params.category_id;
      const categoryData = await CategoryModel.findOne({ status: 1,_id:categoryID });
      if (categoryData) {
        return res.status(200).json({
          data: categoryData,
          message: "Success",
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
};


export const updateCategory = async(req,res)=>{
  try {
      const categoryID = req.params.category_id;
      const {title, description} = req.body;
      const update_category = await CategoryModel.updateOne({_id:categoryID},{
          $set:{
              title:title,
              description:description,
          }
         
      })

      if(update_category){
          return res.status(200).json({
              message:"Updated"
          })
      }

      return res.status(400).json({
          message:"Bad Request"
      })
      
  } catch (error) {
      return res.status(500).json({
          message:error.message
      })
  }
} 

export const softDeleteCat = async (req,res)=>{
  try {
      const category_id = req.params.category_id;

      const softCatdatadelete = await CategoryModel.updateOne({_id:category_id},{
          $set:{status:0}
      })
      if(softCatdatadelete.acknowledged){
          return res.status(200).json({
              message:"delted sucessfully"
          })
      }
  } catch (error) {
      return res.status(500).json({
          message: error.message,
        });
  }
};

export const deleteCategory = async(req,res)=>{
  try {

      const categoryID = req.params.category_id;

      const del_category = await CategoryModel.deleteOne({_id: categoryID});

      if(del_category){
          return res.status(200).json({
              message: "Deleted"
          })
      }

      return res.status(400).json({
          message:"Bad Request"
      })
      
      
  } catch (error) {
      return res.status(500).json({
          message:error.message
      })
      
  }
}


