import Request from '../utils/request';
import {
  ENDPOINT_TABLES,
} from '../constants';

export const getTables = async () => {
  const filter = {
    where: {
      softDelete: false,
    },
    order: 'createdAt ASC' 
  };
  const result = await Request.get(ENDPOINT_TABLES, { filter });
  return result;
};

export const updateTable = async (data) => {
  const result = await Request.put(`${ENDPOINT_TABLES}/${data.id}`, data);
  return result;
};

export const addTable = async (data) => {
  const result = await Request.post(ENDPOINT_TABLES, data);
  return result;
};

export const deleteTable = async (table) => {
  const result = await Request.put(`${ENDPOINT_TABLES}/${table.id}`, Object.assign({}, table, { softDelete: true }));
  return result;
};