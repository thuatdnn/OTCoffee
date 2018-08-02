'use strict';

module.exports = function(Users) {
  Users.disableRemoteMethodByName('updateAll');
  Users.disableRemoteMethodByName('deleteById');
  Users.disableRemoteMethodByName('confirm');
  Users.disableRemoteMethodByName('exists');
  Users.disableRemoteMethodByName('findOne');
  Users.disableRemoteMethodByName('upsertWithWhere');
  Users.disableRemoteMethodByName('createChangeStream');
  Users.disableRemoteMethodByName('prototype.verify');
  Users.disableRemoteMethodByName('prototype.__count__accessTokens');
  Users.disableRemoteMethodByName('prototype.__create__accessTokens');
  Users.disableRemoteMethodByName('prototype.__delete__accessTokens');
  Users.disableRemoteMethodByName('prototype.__destroyById__accessTokens');
  Users.disableRemoteMethodByName('prototype.__findById__accessTokens');
  Users.disableRemoteMethodByName('prototype.__get__accessTokens');
  Users.disableRemoteMethodByName('prototype.__updateById__accessTokens');

  Users.logout = async function(tokenId) {};

  Users.afterRemote('create', async (ctx, user) => {
    const token = await user.createAccessToken();
    ctx.result.accessToken = token.id;
  });
};
