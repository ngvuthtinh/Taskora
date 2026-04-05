import axiosClient from "./axiosClient";

export const fetchBoardDetailsAPI = async (boardId) => {
    const response = await axiosClient.get(`/boards/${boardId}`)
    return response.data.board
}

