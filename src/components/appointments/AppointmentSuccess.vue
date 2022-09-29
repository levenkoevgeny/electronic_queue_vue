<template>
  <div class="container"></div>
</template>

<script>
import { appointmentAPI } from "@/api/appointmentAPI"

export default {
  name: "AppointmentSuccess",
  data() {
    return {
      appointment: null,
      isLoading: true,
      isError: false,
    }
  },
  created() {},
  methods() {},
}
</script>

<style scoped></style>
