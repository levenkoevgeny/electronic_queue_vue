<template>
  <div class="container">
    <div v-if="isLoading">
      <Spinner />
    </div>
    <div v-else>
      <br />
      <h1>
        Уважаемый {{ appointment.appointment_lastname }}
        {{ appointment.appointment_firstname }}!
      </h1>
      <h3>
        Вы записаны
        {{
          new Date(appointment.appointment_date_time).toLocaleDateString([], {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          })
        }}
        в
        {{
          new Date(appointment.appointment_date_time).toLocaleTimeString([], {
            hour: "numeric",
            minute: "numeric",
          })
        }}
      </h3>
      <p>
        В случае, если при регистрации Вы указывали e-mail, Вы получите
        уведомление на указанный адрес.
      </p>
    </div>
  </div>
</template>

<script>
import { clientAPI } from "@/api/clientAPI"
import Spinner from "@/components/common/Spinner"

export default {
  name: "AppointmentSuccess",
  components: { Spinner },
  data() {
    return {
      appointment: null,
      isLoading: true,
      isError: false,
    }
  },
  async created() {
    try {
      const response = await clientAPI.getAppointmentData(this.$route.params.id)
      this.appointment = await response.data
    } catch (error) {
      this.isError = true
    } finally {
      this.isLoading = false
    }
  },
  methods() {},
}
</script>

<style scoped></style>
