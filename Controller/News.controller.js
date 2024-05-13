import NewsModel from "../Model/News.model";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync("uploads/News")) {
      cb(null, "uploads/News");
    } else {
      fs.mkdirSync("uploads/News");
      cb(null, "uploads/News");
    }
  },
  filename: function (req, file, cb) {
    const uniquesuufix = Date.now();
    const orgName = file.originalname;
    const imagarr = orgName.split(".");
    imagarr.pop();

    const fName = imagarr.join(".");
    const ext = path.extname(orgName);
    cb(null, fName + "-" + uniquesuufix + ext);
  },
});

const upload = multer({ storage: storage });

export const addNews = (req, res) => {
  try {
    const addImage = upload.single("image");
    addImage(req, res, function (err) {
      if (err) return res.status(400).json({ message: err.message });
      const { title, description, header } = req.body;
      let img = null;
      if (req.file) {
        img = req.file.filename;
      }

      const newsCategory = new NewsModel({
        title: title,
        description: description,
        header: header,
        image: img,
      });
      newsCategory.save();
      if (newsCategory) {
        return res.status(201).json({
          data: newsCategory,
          message: "created",
        });
      }

      return res.status(400).json({
        message: "Bad Request",
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getNews = async (req, res) => {
  try {
    const { search } = req.query;

    const generateSearchRgx = (pattern) => new RegExp(`.*${pattern}.*`);

    const searchRgx = generateSearchRgx(search);

    let filter = {};

    if (search) {
      filter = {
        $or: [
          { title: { $regex: searchRgx, $options: "i" } },

          // {course_description:{$regex:searchRgx, $options:"i"}}
        ],
      };
    }

    const categoriesData = await NewsModel.find(filter);
    if (categoriesData) {
      return res.status(200).json({
        data: categoriesData,
        message: "Success",
        filepath: "http://localhost:8002/uploads/News",
      });
    }
    return res.status(400).json({
      message: "Bad Request",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getNew = async (req, res) => {
  try {
    const newsID = req.params.news_id;
    const categoryData = await NewsModel.findOne({ status: 1, _id: newsID });
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

export const updateNews = async (req, res) => {
  try {
    const updateImg = upload.single("image");
    updateImg(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });

      const updateID = req.params.update_id;
      const existUpdate = await NewsModel.findOne({ _id: updateID });

      const { title, description, header, date } = req.body;

      let img = existUpdate.image;
      if (req.file) {
        img = req.file.filename;

        if (fs.existsSync("./uploads/News/" + existUpdate.image)) {
          fs.unlinkSync("./uploads/News/" + existUpdate.image);
        }
      }

      const updateAdoption = await NewsModel.updateOne(
        { _id: updateID },
        {
          $set: {
            title: title,
            description: description,
            header: header,
            date: date,
            image: img,
          },
        }
      );
      if (updateAdoption.acknowledged) {
        return res.status(200).json({
          message: "Updated",
        });
      }
      return res.status(400).json({
        message: "Bad request",
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const newsID = req.params.new_id;
    const existNews = await NewsModel.findOne({ _id: newsID });
    const adoptPet = await NewsModel.deleteOne({ _id: newsID });

    if (adoptPet.acknowledged) {
      if (fs.existsSync("./uploads/News/" + existNews.image)) {
        fs.unlinkSync("./uploads/News/" + existNews.image);
      }

      return res.status(200).json({
        message: "deleted",
      });
    }

    return res.status(400).json({
      message: "Bad request",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
