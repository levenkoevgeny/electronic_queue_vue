import axios from "axios"
import { authHeaders } from "@/api/authAPI"

export const organizationAPI = {
  async OrganizationList(token) {
    return axios.get(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/employees/`,
      authHeaders(token)
    )
  },
  async getOrganizationData(token, organizationId) {
    return axios.get(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/employees/${organizationId}`,
      authHeaders(token)
    )
  },

  async addNewOrganization(token, organizationData) {
    return axios.post(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/employees/`,
      organizationData,
      authHeaders(token)
    )
  },

  async updateOrganizationData(token, organizationData) {
    return axios.put(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/employees/${organizationData.id}/`,
      organizationData,
      authHeaders(token)
    )
  },

  async deleteOrganization(token, organizationId) {
    return axios.delete(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/employees/${organizationId}/`,
      authHeaders(token)
    )
  },
}
