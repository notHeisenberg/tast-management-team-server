const { getAllUsers, createUser, loginUser, updateUser, deleteUser, searchUser, changeOrSetPassword, getUser } = require("../services/userServices");

  
  module.exports = {
    get: getAllUsers,
    getByEmail: getUser,
    post: createUser,
    login: loginUser,
    put: updateUser,
    delete: deleteUser,
    search: searchUser,
    modifyPassword: changeOrSetPassword,
  };
  