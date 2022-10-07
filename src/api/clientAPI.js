import axios from "axios"
import { authHeaders } from "@/api/authAPI"

export const clientAPI = {
  async getCalendar(
    year = new Date().getFullYear(),
    month = new Date().getMonth() + 1
  ) {
    return axios.get(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/calendar/?year=${year}&month=${month}`
    )
  },
  async getQueueData(queueId) {
    return axios.get(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/queue-client/${queueId}`
    )
  },
  async getEmployeeList(organization = "") {
    return axios.get(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/employee-client/?organization__id=${organization}`
    )
  },
  async getAppointmentList(
    queue = "",
    employee = "",
    date = "",
    is_booked = ""
  ) {
    return axios.get(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/appointment-client/?queue__id=${queue}&employee__id=${employee}&day_date=${date}&is_booked=${is_booked}`
    )
  },
}
