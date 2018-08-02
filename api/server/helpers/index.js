'use strict';

module.exports = {
  generateErr: (title, status, code, data) => {
    let err = new Error(title);
    err.status = status;
    err.code = code;
    err.data = data;
    return err;
  },
  generateRoom: (data) => {
    return 'room/' + data.type + '/' + data.id;
  }
};
