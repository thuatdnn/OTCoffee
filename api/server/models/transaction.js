'use strict';

module.exports = function(Transaction) {
  Transaction.STATUS_REJECTED = -1;
  Transaction.STATUS_PENDING = 0;
  Transaction.STATUS_PROCESSING = 1;
  Transaction.STATUS_DONE = 2;
};
