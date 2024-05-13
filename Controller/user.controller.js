import userModel from "../Model/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authmiddleware from "../middleware/auth.middleware";

export const getUsers = async (req, res) => {
  try {

    const { search } = req.query;

        const generateSearchRgx = (pattern) => new RegExp(`.*${pattern}.*`);

        const searchRgx = generateSearchRgx(search);

        let filter = {}

        if (search) {
            filter = {
                $or: [
                    { firstName: { $regex: searchRgx, $options: "i" } },
                    { lastName: { $regex: searchRgx, $options: "i" } },
                    { email: { $regex: searchRgx, $options: "i" } },

                    // {course_description:{$regex:searchRgx, $options:"i"}}
                ]
            }
        }
    const getUserData = await userModel.find();

    if (getUserData) {
      return res.status(200).json({
        data: getUserData,
        message: "Successfully fetched.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const addUser = (req, res) => {
  try {
    const { email, firstName, lastName, password, contact } = req.body;

    const saveUser = new userModel({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      contact: contact,
    });

    saveUser.save();

    if (saveUser) {
      return res.status(201).json({
        data: saveUser,
        message: "succesfully data inserted ",
      });
    }
  } catch (error) {
    return res.satus(500).json({
      message: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const userID = req.params.user_id;
    const getUserData = await userModel.findOne({ _id: userID });
    if (getUserData) {
      return res.status(200).json({
        data: getUserData,
        message: "Successfully fetched single user data.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userID = req.params.user_id;
    const { email, firstName, lastName, password, contact } = req.body;

    const updated = await userModel.updateOne(
      { _id: userID },
      {
        $set: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          contact: contact,
        },
      }
    );
    if (updated.acknowledged) {
      return res.status(200).json({
        message: "Updated.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userID = req.params.user_id;

    const deleted = await userModel.deleteOne({ _id: userID });
    if (deleted.acknowledged) {
      return res.status(200).json({
        message: "deleted.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, contact } = req.body;

    const existUser = await userModel.findOne({ email: email });

    if (existUser) {
      return res.status(200).json({
        message: "user already exist.",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const saveUser = new userModel({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      contact: contact,
    });
    saveUser.save();

    if (saveUser) {
      return res.status(200).json({
        message: "succesfully signup",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existUser = await userModel.findOne({ email: email });

    if (!existUser) {
      return res.status(200).json({
        message: "user doesn't exist",
      });
    }

    const checkpassword = bcrypt.compareSync(password, existUser.password);

    if (!checkpassword) {
      return res.status(400).json({
        message: "Invalid credential",
      });
    }
    const token = jwt.sign(
      {
        id: existUser._id,
        email: existUser.email,
      },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("userdata", existUser);

    return res.status(200).json({
      data: existUser,
      token: token,
      message: "login success",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
