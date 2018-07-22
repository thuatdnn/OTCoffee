'use strict';
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = 'OTCoffee.!@2018$#';

module.exports = (app) => {
  const User = app.models.User;
  const AccessToken = app.models.AccessToken;
  const helper = require('../helpers');

  User.prototype.createAccessToken = function(ttl, cb) {
    const userSettings = this.constructor.settings;
    const expiresIn = Math.min(ttl || userSettings.ttl, userSettings.maxTTL);
    const accessToken = jwt.sign({id: this.id, role: this.role}, JWT_SECRET_KEY, {expiresIn});
    return  cb ?
            cb(null, Object.assign(this, {accessToken})) :
            {id: accessToken};
  };

  AccessToken.resolve = function(id, cb) {
    if (id) {
      try {
        const data = jwt.verify(id, JWT_SECRET_KEY);
        cb(null, {id, userId: data.id, role: data.role});
      } catch (err) {
        cb(helper.generateErr('Invalid Access Token', 401, 'INVALID_TOKEN'));
      }
    } else {
      cb();
    }
  };
};
