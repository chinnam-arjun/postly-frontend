import axiosInstance from '../utils/AxiosInstance';

export const searchAPI = async ({ query, type }) => {
  const response = await axiosInstance.get('/search', {
    params: { q: query, type, limit: 10 },
  });
  return response.data.results || [];
};
