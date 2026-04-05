import axiosClient from "./axiosClient";

export const createNewColumnAPI = async (newColumnData) => {
    const response = await axiosClient.post(`/columns`, newColumnData)
    return response.data.column
}

export const updateColumnAPI = async (columnId, updateData) => {
    const response = await axiosClient.put(`/columns/${columnId}`, updateData)
    return response.data.column
}

