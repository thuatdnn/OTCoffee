'use strict';

module.exports = (app) => {
  const Transaction = app.models.Transaction;

  Transaction.observe('after save', async (ctx) => {
    if (ctx.isNewInstance) {
      try {
        app.IOEmitter
          .to('new-transaction')
          .emit('new-transaction', ctx.instance);
      } catch (error) {
        // do nothing
      }
    }
  });
  Transaction.afterRemote('prototype.updateStatus', async ctx => {
    if (ctx.instance.customerId) {
      try {
        app.IOEmitter
          .to(ctx.instance.customerId + '/track-transaction')
          .emit(ctx.instance.customerId + '/track-transaction', ctx.instance);
      } catch (error) {
        // do nothing
      }
    }
  })

};
