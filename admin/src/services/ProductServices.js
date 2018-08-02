import Request from '../utils/request';
import {
  ENDPOINT_PRODUCTS,
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
    order: 'createdAt ASC' 
  };
  const result = await Request.get(ENDPOINT_CATEGORIES, { filter });
  return result;
};

export const updateCategory = async (data) => {
  const result = await Request.put(`${ENDPOINT_CATEGORIES}/${data.id}`, data);
  return result;
};

export const addCategory = async (data) => {
  const result = await Request.post(ENDPOINT_CATEGORIES, data);
  return result;
};

export const deleteCategory = async (category) => {
  const result = await Request.put(`${ENDPOINT_CATEGORIES}/${category.id}`, Object.assign({}, category, { softDelete: true }));
  return result;
};

export const getProducts = async (categoryId) => {
  const filter = { order: 'createdAt ASC' };
  const result = await Request.get(ENDPOINT_PRODUCTS(categoryId), { filter });
  return result;
};

export const getProduct = async (categoryId, productId) => {
  const filter = {
    include: 'category',
  };
  const result = await Request.get(`${ENDPOINT_PRODUCTS(categoryId)}/${productId}`, { filter });
  return result;
};

export const updateProduct = async (categoryId, data) => {
  const result = await Request.put(`${ENDPOINT_PRODUCTS(categoryId)}/${data.id}`, data);
  return result;
};

export const addProduct = async (categoryId, data) => {
  const result = await Request.post(ENDPOINT_PRODUCTS(categoryId), data);
  return result;
};

export const deleteProduct = async (categoryId, product) => {
  const result = await Request.put(`${ENDPOINT_PRODUCTS(categoryId)}/${product.id}`, Object.assign({}, product, { softDelete: true }));
  return result;
};