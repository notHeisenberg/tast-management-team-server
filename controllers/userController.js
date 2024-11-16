const { getAllUsers, createUser, loginUser, updateUser, deleteUser, searchUser, changeOrSetPassword } = require("../services/userServices");

  
  module.exports = {
    get: getAllUsers,
    post: createUser,
    login: loginUser,
    put: updateUser,
    delete: deleteUser,
    search: searchUser,
    modifyPassword: changeOrSetPassword,
  };
  