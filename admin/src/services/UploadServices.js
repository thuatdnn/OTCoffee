import Request from '../utils/request';

export const upload = async (files) => {
  const data = new global.window.FormData();
  files.map(file => data.append('file', file));
  const uploadResult = await Request.upload(data);
  return uploadResult;
};
