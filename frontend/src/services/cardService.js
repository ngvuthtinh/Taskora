import axiosClient from "./axiosClient";

export const createNewCardAPI = async (newCardData) => {
    const response = await axiosClient.post(`/cards`, newCardData)
    return response.data.card
}

