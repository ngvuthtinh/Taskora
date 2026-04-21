import axiosClient from './axiosClient';

// Update User Profile (Name)
export const updateProfileAPI = async (name) => {
    const response = await axiosClient.put('/users/profile', { name });
    return response.data;
};

// Update User Password
export const updatePasswordAPI = async (currentPassword, newPassword) => {
    const response = await axiosClient.put('/users/password', { currentPassword, newPassword });
    return response.data;
};
