import axiosClient from "./axiosClient";

export const createNewCardAPI = async (newCardData) => {
    const response = await axiosClient.post(`/cards`, newCardData)
    return response.data.card
}

export const updateCardDetailsAPI = async (cardId, updateData) => {
    const response = await axiosClient.put(`/cards/${cardId}`, updateData)
    return response.data.card
}

export const assignMemberToCardAPI = async (cardId, payload) => {
    const response = await axiosClient.put(`/cards/${cardId}/members`, payload)
    return response.data.card
}

export const deleteCardAPI = async (cardId) => {
    const response = await axiosClient.delete(`/cards/${cardId}`);
    return response.data;
};