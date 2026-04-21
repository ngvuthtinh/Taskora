import axiosClient from "./axiosClient";

export const fetchBoardDetailsAPI = async (boardId) => {
    const response = await axiosClient.get(`/boards/${boardId}`);
    return response.data.board;
};

export const moveCardAPI = async (updateData) => {
    const response = await axiosClient.put(`/boards/supports/moving-card`, updateData);
    return response.data;
};

export const updateBoardAPI = async (boardId, updateData) => {
    const response = await axiosClient.put(`/boards/${boardId}`, updateData);
    return response.data;
};

export const fetchAllUserBoardsAPI = async () => {
    const response = await axiosClient.get(`/boards/`);
    return response.data.boards;
};

export const createNewBoardAPI = async (boardData) => {
    const response = await axiosClient.post('/boards/', boardData);
    return response.data;
};

export const deleteBoardAPI = async (boardId) => {
    const response = await axiosClient.delete(`/boards/${boardId}`);
    return response.data;
};

export const inviteMemberToBoardAPI = async (boardId, email) => {
    const response = await axiosClient.post(`/boards/${boardId}/members`, { email });
    return response.data;
};

export const removeMemberFromBoardAPI = async (boardId, email) => {
    const response = await axiosClient.delete(`/boards/${boardId}/members`, { data: { email } });
    return response.data;
};

export const updateMemberRoleAPI = async (boardId, userId, action) => {
    const response = await axiosClient.put(`/boards/${boardId}/members/role`, { userId, action });
    return response.data;
};

