'use strict';

module.exports = function(Transaction) {
  Transaction.STATUS_REJECTED = -1;
  Transaction.STATUS_PENDING = 0;
  Transaction.STATUS_PROCESSING = 1;
  Transaction.STATUS_DONE = 2;

  Transaction.afterRemote('find', async (ctx, data) => {
    const Users = Transaction.app.models.Users;
    for(let x in ctx.result) {
      const transaction = ctx.result[x];
      try {
        const { staffId, customerId } = transaction.__data;
        const staff = staffId ? await Users.findById(staffId) : null;
        const customer = customerId ? await Users.findById(customerId) : null;
        transaction.__data.staff = staff;
        transaction.__data.customer = customer;
      } catch (e) {
        console.log(e);
      }
    }
  });

  Transaction.prototype.updateStatus = async function(status) {
    try {
      return await this.updateAttributes({ status });
    } catch (e) {
      throw helper.generateErr('Cannot update status of this transaction.', 400, 'UPDATE_TRANSACTION_STATUS_ERROR');
    }
  }
};
