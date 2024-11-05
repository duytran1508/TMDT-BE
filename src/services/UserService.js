const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, confirmPassword, phone } = newUser;

    try {
      const checkUser = await User.findOne({
        email: email
      });
      if (checkUser != null) {
        resolve({
          status: "Oke",
          message: "Email is already"
        });
      }
      const hash = bcrypt.hashSync(password, 10);
      const createdUser = await User.create({
        name,
        email,
        password: hash,
        phone
      });
      if (createdUser) {
        resolve({
          status: "Oke",
          massage: "Success"
          // data: createdUser
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin;
    try {
      const checkUser = await User.findOne({
        email: email
      });
      const isAdmin = checkUser.isAdmin;
      const id = checkUser._id;
      if (!checkUser) {
        resolve({
          status: "ERR",
          message: "User is not defined"
        });
        return;
      }
      const comparePassword = bcrypt.compareSync(password, checkUser.password);
      if (!comparePassword) {
        resolve({
          status: "ERR",
          message: "User or password incorrect"
        });
        return;
      }
      const access_token = await genneralAccessToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin
      });

      const refresh_token = await genneralRefreshToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin
      });

      // console.log("access_token", access_token);
      resolve({
        status: "Oke",
        massage: "Success",
        dataUser: { id, email, password, isAdmin },
        access_token,
        refresh_token
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: id
      });
      if (checkUser === null) {
        resolve({
          status: "Oke",
          message: "User is not defined"
        });
      } else {
        const updatedUser = await User.findByIdAndUpdate(id, data, {
          new: true
        });
        resolve({
          status: "Oke",
          message: "Success",
          data: updatedUser
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteUser = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ _id: id });
      console.log(checkUser);
      if (checkUser === null) {
        return reject({
          status: 404,
          message: "User is not defined"
        });
      }

      await User.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete success"
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyUser = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await User.deleteMany({ _id: ids });
      resolve({
        status: "Oke",
        massage: "delete success"
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUser = await User.find();
      resolve({
        status: "Oke",
        massage: "success",
        data: allUser
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({
        _id: id
      });
      if (user === null) {
        resolve({
          status: "Oke",
          message: "User is not defined"
        });
      }

      resolve({
        status: "Oke",
        massage: "success",
        data: user
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  deleteManyUser,
  getAllUser,
  getDetailsUser
};
