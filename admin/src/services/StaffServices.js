import Request from '../utils/request';
import {
  ENDPOINT_USERS,
} from '../constants';

export const getStaffs = async () => {
  const filter = {
    where: {
      role: 'staff',
      softDelete: false
    },
    order: 'createdAt ASC' 
  };
  const result = await Request.get(ENDPOINT_USERS, { filter });
  return result;
};

export const updateStaff = async (data) => {
  const result = await Request.patch(`${ENDPOINT_USERS}/${data.id}`, data);
  return result;
};

export const addStaff = async (data) => {
  const result = await Request.post(ENDPOINT_USERS, data);
  return result;
};

export const deleteStaff = async (staff) => {
  const result = await Request.put(`${ENDPOINT_USERS}/${staff.id}`, Object.assign({}, staff, { softDelete: true }));
  return result;
};