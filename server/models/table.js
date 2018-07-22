'use strict';

module.exports = (Table) => {
  const helper = require('../helpers');
  Table.prototype.updateStatus = async function(status) {
    try {
      return await this.updateAttributes({ status });
    } catch (e) {
      throw helper.generateErr('Cannot update status os this table.', 400, 'UPDATE_TABLE_STATUS_ERROR');
    }
  }
};
