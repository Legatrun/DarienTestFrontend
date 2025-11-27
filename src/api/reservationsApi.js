import apiClient from './apiClient';

export const getSpaces = async () => {
  const response = await apiClient.get('/spaces');
  return response.data;
};

export const getReservations = async () => {
  const response = await apiClient.get(`/reservations`);
  return response.data;
};

export const getSpaceById = async (id) => {
  const response = await apiClient.get(`/spaces/${id}`);
  return response.data;
};

export const createReservation = async (reservationData) => {
  const response = await apiClient.post('/reservations', reservationData);
  return response.data;
};

export const deleteReservation = async (id) => {
  const response = await apiClient.delete(`/reservations/${id}`);
  return response.data;
};

export const createPlace = async (placeData) => {
  const response = await apiClient.post('/places', placeData);
  return response.data;
};

export const createSpace = async (spaceData) => {
  const response = await apiClient.post('/spaces', spaceData);
  return response.data;
};
