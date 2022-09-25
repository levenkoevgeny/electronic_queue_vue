import axios from "axios"
import { authHeaders } from "@/api/authAPI"

export const employeeAPI = {
  async getEmployeeList(token) {
    return axios.get(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/employees/`,
      authHeaders(token)
    )
  },
  async getEmployeeData(token, employeeId) {
    return axios.get(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/employees/${employeeId}`,
      authHeaders(token)
    )
  },

  async addNewEmployee(token, employeeData) {
    return axios.post(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/employees/`,
      employeeData,
      authHeaders(token)
    )
  },

  async updateEmployeeData(token, employeeData) {
    return axios.put(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/employees/${employeeData.id}/`,
      employeeData,
      authHeaders(token)
    )
  },

  async deleteEmployee(token, employeeId) {
    return axios.delete(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/employees/${employeeId}/`,
      authHeaders(token)
    )
  },
}
