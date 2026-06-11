import { axiosAuth } from '../helper/axiosConfig';
import { paginateObj } from '../helper/utils';

export const getCampaigns = (params) => {
  return axiosAuth.get('/campaigns', { params });
};

export const getCampaignsPaginated = (pageIndex, pageSize, textSearch, newObj = {}) => {
  return axiosAuth.post('/campaigns-pagination', paginateObj(pageIndex || 1, pageSize || 10, textSearch, newObj));
};

export const getCampaignById = (id) => {
  return axiosAuth.get(`/campaigns/${id}`);
};

export const createCampaign = (data) => {
  return axiosAuth.post('/campaigns', data);
};

export const updateCampaign = (id, data) => {
  return axiosAuth.put(`/campaigns/${id}`, data);
};

export const deleteCampaign = (id) => {
  return axiosAuth.delete(`/campaigns/${id}`);
};

export default {
  getCampaigns,
  getCampaignsPaginated,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign
}
