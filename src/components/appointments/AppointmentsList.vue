<template>
  <h1>List</h1>
  <div v-for="appointment in appointmentList" :key="appointment.id">
    {{ appointment.appointment_date_time }}
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { queueAPI } from "@/api/queueDataAPI"
import { appointmentAPI } from "@/api/appointmentAPI"
import ReconnectingWebSocket from "reconnecting-websocket"

export default {
  name: "AppointmentsList",
  data() {
    return {
      appointmentList: [],
      queue: null,
      isLoading: true,
      checkedWordsForDelete: [],
    }
  },
  async created() {
    await this.initData()
    const rws = new ReconnectingWebSocket(
      `${process.env.VUE_APP_BACKEND_PROTOCOL_WS}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT_WS}/ws/appointments/` +
        this.$route.params.id +
        "/"
    )

    rws.addEventListener("open", () => {})

    rws.addEventListener("message", (e) => {
      const data = JSON.parse(e.data)
      this.appointmentList.push(data.message)
    })

    this.$watch(
      async () => this.$route.params.id,
      async (toParams, previousParams) => {
        if (this.$route.params.id) {
          this.isLoading = true
          await this.initData()
        }
      }
    )
  },
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
      userToken: "auth/getToken",
    }),
  },
  methods: {
    async initData() {
      try {
        const responseQueue = await queueAPI.getQueueData(
          this.userToken,
          this.$route.params.id
        )
        this.queue = await responseQueue.data

        const responseAppointments = await appointmentAPI.getAppointmentList(
          this.userToken,
          this.$route.params.id
        )
        this.appointmentList = await responseAppointments.data
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>

<style scoped></style>
