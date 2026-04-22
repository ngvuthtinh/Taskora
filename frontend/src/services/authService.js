import axiosClient from "./axiosClient";

export const loginAPI = async (email, password) => {
    const response = await axiosClient.post('/auth/login', {
        email,
        password
    })
    return response.data
}

export const registerAPI = async (name, email, password) => {
    const response = await axiosClient.post('/auth/register', {
        name,
        email,
        password
    })
    return response.data
}
export const googleLoginAPI = async (credential) => {
    const response = await axiosClient.post('/auth/google-login', {
        credential
    })
    return response.data
}
