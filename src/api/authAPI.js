import axios from "axios"
import store from "@/store"
import router from "@/router/router"

export function authHeaders(token) {
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
}

export const authApi = {
    async logInGetToken(username, password) {
        const params = new URLSearchParams()
        params.append("username", username)
        params.append("password", password)

        return axios.post(
            `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/token/`,
            params
        )
    },
    async registration(username, password) {
        const params = new URLSearchParams()
        params.append("username", username)
        params.append("password", password)
        return axios.post(
            `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/users/`,
            params
        )
    },
    async getUserData(token) {
        return axios.get(
            `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/users/me/`,
            authHeaders(token)
        )
    }
}