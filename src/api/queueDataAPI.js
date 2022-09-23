import axios from "axios"
import { authHeaders } from "@/api/auth_api"

export const queueAPI = {
    async getQueueData(token, queueId) {
        return axios.get(
            `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/queues/${queueId}`,
            authHeaders(token)
        )
    },

    async addNewQueue(token, queueData) {
        return axios.post(
            `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/queues/`,
            queueData,
            authHeaders(token)
        )
    },

    async updateQueueData(token, queueData) {
        return axios.put(
            `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/queues/${queueData.id}/`,
            queueData,
            authHeaders(token)
        )
    },

    async deleteQueue(token, queueId) {
        return axios.delete(
            `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/queues/${queueId}/`,
            authHeaders(token)
        )
    },
}