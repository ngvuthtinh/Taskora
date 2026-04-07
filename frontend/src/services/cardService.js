import axiosClient from "./axiosClient";

export const createNewCardAPI = async (newCardData) => {
    const response = await axiosClient.post(`/cards`, newCardData)
    return response.data.card
}

export const updateCardAPI = async (cardId, updateData) => {
    const response = await axiosClient.put(`/cards/${cardId}`, updateData)
    return response.data.card
}
