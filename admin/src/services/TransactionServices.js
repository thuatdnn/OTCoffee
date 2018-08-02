import Request from '../utils/request';
import {
  ENDPOINT_TRANSACTIONS,
  ENDPOINT_CATEGORIES,
} from '../constants';

export const getCategories = async () => {
  const filter = {
    where: {
      softDelete: false,
    },
    include: {
      relation: 'products',
      scope: {
        where: {
          softDelete: false
        }
      }
    }, 
    transaction: 'createdAt ASC' 
  };
  const result = await Request.get(ENDPOINT_CATEGORIES, { filter }, true);
  return result;
};

export const getTransactions = async () => {
  const filter = {
    where: {
      softDelete: false,
    },
    include: [{
      relation: 'orders',
      scope: {
        include: 'product'
      }
    },{
      relation: 'staff'
    }], 
    transaction: 'createdAt ASC' 
  };
  const result = await Request.get(ENDPOINT_TRANSACTIONS, { filter }, true);
  return result;
};

export const getTransaction = async (transactionId) => {
  const filter = {
    include: 'orders',
  };
  const result = await Request.get(`${ENDPOINT_TRANSACTIONS}/${transactionId}`, { filter });
  return result;
};

export const updateTransaction = async (transactionId, data) => {
  const result = await Request.put(`${ENDPOINT_TRANSACTIONS}/${transactionId}`, data, true);
  return result;
};

export const addTransaction = async (data) => {
  const result = await Request.post(ENDPOINT_TRANSACTIONS, data, true);
  return result;
};

export const linkOrder = async (transactionId, data) => {
  const result = await Request.post(`${ENDPOINT_TRANSACTIONS}/${transactionId}/orders/`, data, true);
  return result;
};

export const deleteTransaction = async (data) => {
  const result = await Request.put(`${ENDPOINT_TRANSACTIONS}/${data.id}`, Object.assign({}, data, { softDelete: true }));
  return result;
};