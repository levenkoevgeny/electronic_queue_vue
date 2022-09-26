<template>
  {{ getFormattedDate(appointmentItem.appointment_date_time) }}
  {{ getFormattedTime(appointmentItem.appointment_date_time) }}
  <button
    type="button"
    class="btn btn-link"
    @click="showModalHandler(appointmentItem.id)"
  >
    Редактировать
  </button>
</template>

<script>
export default {
  name: "AppointmentItem",
  emits: ["showModal"],
  props: {
    appointmentItem: { type: Object, required: true },
  },
  methods: {
    getFormattedDate(dateTime) {
      return new Date(dateTime).toLocaleDateString()
    },
    getFormattedTime(dateTime) {
      return new Date(dateTime).toLocaleTimeString()
    },
    showModalHandler(appointmentId) {
      this.$emit("showModal", appointmentId)
    },
  },
}
</script>

<style scoped></style>
