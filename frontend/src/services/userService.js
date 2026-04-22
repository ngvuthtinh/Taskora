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

// Update User Avatar
export const updateAvatarAPI = async (formData) => {
    const response = await axiosClient.put('/users/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};
