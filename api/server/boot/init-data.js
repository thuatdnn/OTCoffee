'use strict';

module.exports = async (app) => {
  const Users = app.models.Users;

  // INIT ADMIN ACCOUNTS
  try {
    const admins = [{
      username: "admin",
      password: "admin",
      name: "Administrator",
      role: "admin"
    }];

    admins.map(async (account) => {
      await Users.findOne({where: {username: account.username}}) || await Users.create(account);
    })
  }catch(e){}
};
