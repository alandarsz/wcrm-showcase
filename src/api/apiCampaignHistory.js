import { axiosAuth } from '../helper/axiosConfig';

export const getHistoryByCampaign = (campaignId) => {
  return axiosAuth.get(`/history-campaigns/${campaignId}`);
};

export const createHistory = (campaignId, data) => {
  return axiosAuth.post(`/history-campaigns/${campaignId}`, data);
};

export const getHistoryById = (historyId) => {
  return axiosAuth.get(`/campaign-history/${historyId}`);
};

export const updateHistory = (historyId, data) => {
  return axiosAuth.put(`/campaign-history/${historyId}`, data);
};

export const deleteHistory = (historyId) => {
  return axiosAuth.delete(`/campaign-history/${historyId}`);
};
