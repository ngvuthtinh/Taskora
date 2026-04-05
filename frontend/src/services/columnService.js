import axiosClient from "./axiosClient";

export const createNewColumnAPI = async (newColumnData) => {
    const response = await axiosClient.post(`/columns`, newColumnData)
    return response.data.column
}

