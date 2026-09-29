import { API_ENDPOINTS } from "@/lib/endpoints";
import api from "@/lib/axios";


export const createAddressService = async (addressData) => {
  const response = await api.post(API_ENDPOINTS.CREATE_ADDRESS, addressData);
  return response.data;
};


export const getAddressesService = async () => {
  const response = await api.get(API_ENDPOINTS.GET_ADDRESSES);
  return response.data;
};


export const getAddressServicebyid = async (addressId) => {
  const response = await api.get(
    API_ENDPOINTS.GET_ADDRESS.replace("{address_id}", addressId)
  );
  return response.data;
};


export const updateAddressService = async (addressId, addressData) => {
  const response = await api.put(
    API_ENDPOINTS.UPDATE_ADDRESS.replace("{address_id}", addressId),
    addressData
  );
  return response.data;
};


export const deleteAddressService = async (addressId) => {
  const response = await api.delete(
    API_ENDPOINTS.DELETE_ADDRESS.replace("{address_id}", addressId)
  );
  return response.data;
};
