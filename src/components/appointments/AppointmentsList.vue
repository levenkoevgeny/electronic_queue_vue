<template>
  <div>
    <div v-if="isLoading">
      <p>Loading...</p>
    </div>
    <div v-else>
      <div v-if="appointmentList.length > 0">
        <div v-for="appointment in sortedAppointmentList" :key="appointment.id">
          {{ getFormattedDate(appointment.appointment_date_time) }}
          {{ getFormattedTime(appointment.appointment_date_time) }}
        </div>
      </div>
      <div v-else>
        <h1>Очередь не сформирована</h1>
        <form>
          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Дата начала</label>
                <input type="date" class="form-control" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Дата окончания</label>
                <input type="date" class="form-control" />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4">
              <div class="mb-3">
                <label class="form-label">Начало рабочего дня</label>
                <input
                  type="number"
                  class="form-control"
                  min="0"
                  max="24"
                  step="1"
                />
              </div>
            </div>
            <div class="col-md-4">
              <div class="mb-3">
                <label class="form-label">Окончание рабочего дня</label>
                <input
                  type="number"
                  class="form-control"
                  min="0"
                  max="24"
                  step="1"
                />
              </div>
            </div>
            <div class="col-md-4">
              <div class="mb-3">
                <label class="form-label">Интервал времени</label>
                <input
                  type="number"
                  class="form-control"
                  min="1"
                  max="1440"
                  step="5"
                />
              </div>
            </div>
          </div>

          <div class="row">
            <p class="m-0">Рабочие дни</p>
            <div class="col-12 d-flex flex-row mb-2">
              <div class="form-check mx-2">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value="0"
                  checked
                />
                <label class="form-check-label"> Пн </label>
              </div>
              <div class="form-check mx-2">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value="1"
                  checked
                />
                <label class="form-check-label"> Вт </label>
              </div>
              <div class="form-check mx-2">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value="2"
                  checked
                />
                <label class="form-check-label"> Ср </label>
              </div>
              <div class="form-check mx-2">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value="3"
                  checked
                />
                <label class="form-check-label"> Чт </label>
              </div>
              <div class="form-check mx-2">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value="4"
                  checked
                />
                <label class="form-check-label"> Пт </label>
              </div>
              <div class="form-check mx-2">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value="5"
                  checked
                />
                <label class="form-check-label"> Сб </label>
              </div>
              <div class="form-check mx-2">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value="6"
                  checked
                />
                <label class="form-check-label"> Вс </label>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4"></div>
          </div>
          <button type="submit" class="btn btn-primary">
            Сформировать очередь
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { queueAPI } from "@/api/queueDataAPI"
import { appointmentAPI } from "@/api/appointmentAPI"
// import ReconnectingWebSocket from "reconnecting-websocket"

export default {
  name: "AppointmentsList",
  data() {
    return {
      appointmentList: [],
      queue: null,
      isLoading: true,
    }
  },
  async created() {
    await this.initData()
    // const rws = new ReconnectingWebSocket(
    //   `${process.env.VUE_APP_BACKEND_PROTOCOL_WS}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT_WS}/ws/appointments/` +
    //     this.$route.params.id +
    //     "/"
    // )
    //
    // rws.addEventListener("open", () => {})
    //
    // rws.addEventListener("message", (e) => {
    //   const data = JSON.parse(e.data)
    //   this.appointmentList.push(data.message)
    // })

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
    sortedAppointmentList() {
      return this.appointmentList
    },
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
    getFormattedDate(dateTime) {
      return new Date(dateTime).toLocaleDateString()
    },
    getFormattedTime(dateTime) {
      return new Date(dateTime).toLocaleTimeString()
    },
  },
}
</script>

<style scoped></style>
