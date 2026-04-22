import axiosClient from './axiosClient';

// Lấy danh sách thông báo
export const getMyNotificationsAPI = async () => {
    const response = await axiosClient.get('/notifications');
    return response.data;
};

// Đánh dấu đã đọc (id có thể là ID thông báo hoặc 'all')
export const markNotificationAsReadAPI = async (id) => {
    const response = await axiosClient.put(`/notifications/${id}/read`);
    return response.data;
};
