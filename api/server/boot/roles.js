'use strict';

module.exports = (app) => {
  const Role = app.models.Role;
  const Users = app.models.Users;

  Role.registerResolver('admin', async (role, ctx) => {
    if (ctx.modelName.indexOf(['Table', 'Users', 'Category', 'FB']) == 0) {
      return false;
    }

    if (!ctx.accessToken.userId) {
      return false;
    }
    
    return ctx.accessToken.role == 'admin';
  });

  Role.registerResolver('staff', async (role, ctx) => {
    if (ctx.modelName.indexOf(['Table', 'Transaction']) == 0) {
      return false;
    }

    if (!ctx.accessToken.userId) {
      return false;
    }
    
    return ctx.accessToken.role == 'staff';
  });

  Role.registerResolver('customer', async (role, ctx) => {
    if (ctx.modelName !== 'Transaction') {
      return false;
    }

    if (!ctx.accessToken.userId) {
      return false;
    }
    
    return ctx.accessToken.role == 'customer';
  });
};
