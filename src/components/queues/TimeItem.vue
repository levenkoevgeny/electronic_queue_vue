<template>
  <button type="button"
          class="btn_time"
          :class="{ isActiveTime: freeAppointment.isActive}"
          @click="$emit('setAppointment', freeAppointment)">
    {{
      new Date(
        freeAppointment.appointment_date_time
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    }}
  </button>
</template>

<script>
export default {
  name: "TimeItem",
  props: { freeAppointment: { type: Object, required: true } }
}
</script>

<style scoped>
.btn_time {
  border-radius: 10px;
  border: 1px solid #000;
  padding: 5px;
  margin: 5px;
  background-color: #fff;
}

.isActiveTime {
  background-color: #B63E5A
}
</style>