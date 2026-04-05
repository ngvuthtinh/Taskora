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
