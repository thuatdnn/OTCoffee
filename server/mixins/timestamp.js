'use strict';

module.exports = (Model) => {
  Model.defineProperty('createdAt', {type: Date, defaultFn: 'now'});
  Model.defineProperty('updatedAt', {type: Date, defaultFn: 'now'});
  Model.observe('before save', (ctx, next) => {
    ctx.instance ? ctx.instance.updatedAt = new Date() : ctx.data.updatedAt = new Date();
    next();
  });
};
