import axios from "axios"
import { authHeaders } from "@/api/authAPI"

export const appointmentAPI = {
  async getAppointmentList(
    token,
    queue = "",
    employee = "",
    is_booked = "",
    day_date = ""
  ) {
    return axios.get(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/appointments/?queue__id=${queue}&employee__id=${employee}&is_booked=${is_booked}&day_date=${day_date}`,
      authHeaders(token)
    )
  },
  async getAppointmentData(token, appointmentId) {
    return axios.get(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/appointments/${appointmentId}`,
      authHeaders(token)
    )
  },

  async addNewAppointment(token, appointmentData) {
    return axios.post(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/appointments/`,
      appointmentData,
      authHeaders(token)
    )
  },

  async updateAppointmentData(token, appointmentData) {
    return axios.put(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/appointments/${appointmentData.id}/`,
      appointmentData,
      authHeaders(token)
    )
  },

  async partialUpdateAppointmentData(token, appointmentData) {
    return axios.patch(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/appointments/${appointmentData.id}/`,
      appointmentData,
      authHeaders(token)
    )
  },

  async deleteAppointment(token, appointmentId) {
    return axios.delete(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/appointments/${appointmentId}/`,
      authHeaders(token)
    )
  },
}
