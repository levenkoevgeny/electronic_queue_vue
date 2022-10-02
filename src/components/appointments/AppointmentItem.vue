<template>
  <th scope="row">
    {{ getFormattedDateComponent(appointmentItem.appointment_date_time) }}
  </th>
  <td>
    <button
      type="button"
      class="btn btn-link"
      @click="showModalHandler(appointmentItem.id)"
    >
      {{ getFormattedTimeComponent(appointmentItem.appointment_date_time) }}
    </button>
  </td>
  <td>
    {{ appointmentItem.employee.last_name }}
    {{ appointmentItem.employee.first_name[0] }}.
    {{ appointmentItem.employee.patronymic[0] }}.
  </td>
  <td>{{ appointmentItem.appointment_lastname }}</td>
  <td>{{ appointmentItem.appointment_comment }}</td>
</template>

<script>
import { getFormattedDate } from "@/utils"
import { getFormattedTime } from "@/utils"
export default {
  name: "AppointmentItem",
  emits: ["showModal"],
  props: {
    appointmentItem: { type: Object, required: true },
  },
  methods: {
    getFormattedDateComponent(dateTime) {
      return getFormattedDate(dateTime)
    },
    getFormattedTimeComponent(dateTime) {
      return getFormattedTime(dateTime)
    },
    showModalHandler(appointmentId) {
      this.$emit("showModal", appointmentId)
    },
  },
}
</script>

<style scoped></style>
