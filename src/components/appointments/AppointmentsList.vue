<template>
  <!--  queueRemake modal-->
  <div
    class="modal fade"
    id="queueRemake"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="queueRemake"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            Пересоздание очереди
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <h3>
            Внимание! Пересоздание очереди приведет к удалению уже созданных
            записей!
          </h3>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Закрыть
          </button>
          <button type="button" class="btn btn-primary">Пересоздать</button>
        </div>
      </div>
    </div>
  </div>
  <!--  end queueRemake modal-->

  <!--  appointmentUpdate modal-->
  <div
    class="modal fade"
    id="appointmentUpdate"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="appointmentUpdate"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <form @submit="appointmentUpdateHandler">
          <div class="modal-header">
            <h5 class="modal-title">
              Изменение записи
              {{
                getFormattedDateComponent(
                  currentAppointment.appointment_date_time
                )
              }}
              {{
                getFormattedTimeComponent(
                  currentAppointment.appointment_date_time
                )
              }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label">Фамилия</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="currentAppointment.appointment_lastname"
                    />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label">Имя</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="currentAppointment.appointment_firstname"
                    />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label">Отчество</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="currentAppointment.appointment_patronymic"
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">E-mail</label>
                    <input
                      type="email"
                      class="form-control"
                      v-model="currentAppointment.appointment_email"
                      @blur="v$.currentAppointment.appointment_email.$touch"
                    />
                    <div
                      :class="{
                        invalid: v$.currentAppointment.appointment_email.$error,
                        'visually-hidden':
                          !v$.currentAppointment.appointment_email.$error,
                      }"
                    >
                      Не корректный email!
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Телефон</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="currentAppointment.appointment_phone"
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label">Комментарий к записи</label>
                    <textarea
                      cols="30"
                      rows="2"
                      class="form-control"
                      v-model="currentAppointment.appointment_comment"
                    ></textarea>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="currentAppointment.is_booked"
                    />
                    <label class="form-check-label"> Есть запись</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              ref="closeAppointmentUpdateModal"
            >
              Закрыть
            </button>
            <button type="submit" class="btn btn-primary">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!--  end appointmentUpdate modal-->

  <div>
    <div v-if="isError" class="alert alert-danger m-0 p-3" role="alert">
      Что-то пошло не так!
    </div>
    <div v-if="isLoading">
      <p>Loading...</p>
    </div>
    <div v-else>
      <div>
        <QueueUpdateForm
          :queue-item="queue"
          @set-is-error="(value) => (this.isError = value)"
        />
        <button class="btn btn-danger" @click="deleteQueueHandler(queue.id)">
          Удалить очередь
        </button>
      </div>
      <br />
      <div v-if="queue.appointment_count > 0">
        <br />
        <h5>Ссылка на данную очередь - {{ getQueueLink() }}</h5>
        <br />

        <h5>Фильтр для поиска</h5>

        <div class="row">
          <div class="col-lg-4">
            <div class="mb-3">
              <label class="form-label">Дата записи</label>
              <input
                type="date"
                class="form-control"
                v-model="filterFields.date"
              />
            </div>
          </div>
          <div class="col-lg-4">
            <div class="mb-3">
              <label class="form-label">Сотрудник</label>
              <select class="form-select" v-model="filterFields.employee">
                <option selected value="">Все сотрудники</option>
                <option
                  v-for="employee in employeeList"
                  :key="employee.id"
                  :value="employee.id"
                >
                  {{ employee.last_name }}
                  {{ employee.first_name[0] }}. {{ employee.patronymic[0] }}.
                </option>
              </select>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="mb-3">
              <label class="form-label">Запись</label>
              <select class="form-select" v-model="filterFields.is_booked">
                <option selected value="">Все записи</option>
                <option value="True">Да</option>
                <option value="False">Нет</option>
              </select>
            </div>
          </div>
        </div>
        <h5>Кол-во записей - {{ sortedAppointmentList.length }}</h5>
        <!--        <div v-for="appointment in sortedAppointmentList" :key="appointment.id">-->

        <div v-if="sortedAppointmentList.length > 0">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Дата</th>
                <th scope="col">Время</th>
                <th scope="col">К кому</th>
                <th scope="col">Фамилия</th>
                <th scope="col">Комментарий</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="appointment in sortedAppointmentList"
                :key="appointment.id"
              >
                <AppointmentItem
                  :appointment-item="appointment"
                  @show-modal="showModalForUpdate"
                />
              </tr>
            </tbody>
          </table>
        </div>

        <!--        </div>-->
      </div>
      <div v-else>
        <h1>Очередь не сформирована</h1>
        <form @submit="createQueue" method="POST">
          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Дата начала</label>
                <input
                  type="date"
                  class="form-control"
                  v-model="queueForm.date_start"
                  @blur="v$.queueForm.date_start.$touch"
                  required
                />
                <div
                  :class="{
                    invalid: v$.queueForm.date_start.$error,
                    'visually-hidden': !v$.queueForm.date_start.$error,
                  }"
                >
                  Это поле не может быть пустым!
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Дата окончания</label>
                <input
                  type="date"
                  class="form-control"
                  v-model="queueForm.date_end"
                  @blur="v$.queueForm.date_end.$touch"
                  required
                />
                <div
                  :class="{
                    invalid: v$.queueForm.date_end.$error,
                    'visually-hidden': !v$.queueForm.date_end.$error,
                  }"
                >
                  Это поле не может быть пустым!
                </div>
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
                  v-model="queueForm.day_time_start"
                  @blur="v$.queueForm.day_time_start.$touch"
                  required
                />
                <div
                  :class="{
                    invalid: v$.queueForm.day_time_start.$error,
                    'visually-hidden': !v$.queueForm.day_time_start.$error,
                  }"
                >
                  Это поле не может быть пустым!
                </div>
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
                  v-model="queueForm.day_time_end"
                  @blur="v$.queueForm.day_time_end.$touch"
                  required
                />
                <div
                  :class="{
                    invalid: v$.queueForm.day_time_end.$error,
                    'visually-hidden': !v$.queueForm.day_time_end.$error,
                  }"
                >
                  Это поле не может быть пустым!
                </div>
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
                  step="1"
                  v-model="queueForm.time_interval"
                  @blur="v$.queueForm.time_interval.$touch"
                  required
                />
                <div
                  :class="{
                    invalid: v$.queueForm.time_interval.$error,
                    'visually-hidden': !v$.queueForm.time_interval.$error,
                  }"
                >
                  Это поле не может быть пустым!
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <div class="mb-3">
                <label class="form-label">Сотрудники</label>
                <select
                  class="form-select"
                  v-model="queueForm.employees"
                  @blur="v$.queueForm.employees.$touch"
                  multiple
                  required
                >
                  <option
                    v-for="employee in employeeList"
                    :key="employee.id"
                    :value="employee.id"
                  >
                    {{ employee.last_name }} {{ employee.first_name[0] }}.
                    {{ employee.patronymic[0] }}.
                  </option>
                </select>
                <div
                  :class="{
                    invalid: v$.queueForm.employees.$error,
                    'visually-hidden': !v$.queueForm.employees.$error,
                  }"
                >
                  Это поле не может быть пустым!
                </div>
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
                  v-model="queueForm.checkbox_monday"
                />
                <label class="form-check-label"> Пн </label>
              </div>
              <div class="form-check mx-2">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value="1"
                  v-model="queueForm.checkbox_thursday"
                />
                <label class="form-check-label"> Вт </label>
              </div>
              <div class="form-check mx-2">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value="2"
                  v-model="queueForm.checkbox_wednesday"
                />
                <label class="form-check-label"> Ср </label>
              </div>
              <div class="form-check mx-2">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value="3"
                  v-model="queueForm.checkbox_tuesday"
                />
                <label class="form-check-label"> Чт </label>
              </div>
              <div class="form-check mx-2">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value="4"
                  v-model="queueForm.checkbox_friday"
                />
                <label class="form-check-label"> Пт </label>
              </div>
              <div class="form-check mx-2">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value="5"
                  v-model="queueForm.checkbox_saturday"
                />
                <label class="form-check-label"> Сб </label>
              </div>
              <div class="form-check mx-2">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value="6"
                  v-model="queueForm.checkbox_sunday"
                />
                <label class="form-check-label"> Вс </label>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4"></div>
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            v-if="!v$.queueForm.$invalid"
          >
            Сформировать очередь
          </button>
          <button type="submit" class="btn btn-primary" disabled v-else>
            Сформировать очередь
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { queueAPI } from "@/api/queueAPI"
import { appointmentAPI } from "@/api/appointmentAPI"
import { employeeAPI } from "@/api/employeeAPI"
import AppointmentItem from "@/components/appointments/AppointmentItem"
import QueueUpdateForm from "@/components/queues/QueueUpdateForm"
import Spinner from "@/components/common/Spinner"
import useVuelidate from "@vuelidate/core"
import { required, requiredIf, email } from "@vuelidate/validators"
import { getFormattedDate } from "@/utils"
import { getFormattedTime } from "@/utils"
// import ReconnectingWebSocket from "reconnecting-websocket"

export default {
  name: "AppointmentsList",
  components: { AppointmentItem, QueueUpdateForm, Spinner },
  setup() {
    return { v$: useVuelidate() }
  },
  validations() {
    return {
      queueForm: {
        date_start: { required },
        date_end: { required },
        day_time_start: { required },
        day_time_end: { required },
        time_interval: { required },
        employees: { required },
      },
      currentAppointment: {
        appointment_email: { email },
        // appointment_lastname: requiredIf(true),
      },
    }
  },
  data() {
    return {
      appointmentList: [],
      queue: null,
      employeeList: [],
      currentAppointment: {
        appointment_lastname: "",
        appointment_firstname: "",
        appointment_patronymic: "",
        appointment_email: "",
        appointment_phone: "",
        appointment_comment: "",
        is_booked: false,
      },
      queueForm: {
        date_start: "2022-09-28",
        date_end: "2022-09-28",
        day_time_start: 8,
        day_time_end: 18,
        time_interval: 15,
        checkbox_monday: true,
        checkbox_tuesday: true,
        checkbox_wednesday: true,
        checkbox_thursday: true,
        checkbox_friday: true,
        checkbox_saturday: true,
        checkbox_sunday: true,
        employees: [],
      },
      filterFields: {
        date: "",
        employee: "",
        is_booked: "",
      },
      isLoading: true,
      isError: false,
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
      this.isError = false
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

        const responseEmployees = await employeeAPI.getEmployeeList(
          this.userToken
        )
        this.employeeList = responseEmployees.data
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    async showModalForUpdate(appointmentId) {
      this.isError = false
      try {
        const response = await appointmentAPI.getAppointmentData(
          this.userToken,
          appointmentId
        )
        this.currentAppointment = await response.data
      } catch (e) {
        this.isError = true
      } finally {
      }

      this.v$.currentAppointment.appointment_email.$dirty = false

      let updateModal = this.$refs.appointmentUpdate

      let myModal = new bootstrap.Modal(updateModal, {
        keyboard: false,
      })
      myModal.show()
    },
    async appointmentUpdateHandler(event) {
      event.preventDefault()
      this.isError = false
      this.isLoading = true

      try {
        if (this.currentAppointment.is_booked === false) {
          this.currentAppointment = {
            ...this.currentAppointment,
            appointment_lastname: "",
            appointment_firstname: "",
            appointment_patronymic: "",
            appointment_email: "",
            appointment_phone: "",
            appointment_comment: "",
          }
        }

        const response = await appointmentAPI.updateAppointmentData(
          this.userToken,
          this.currentAppointment
        )
        const updatedAppointment = await response.data

        this.$refs.closeAppointmentUpdateModal.click()

        this.appointmentList = this.appointmentList.map((appointment) => {
          if (appointment.id === updatedAppointment.id) {
            return updatedAppointment
          } else return appointment
        })
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    async createQueue(event) {
      this.isLoading = true
      event.preventDefault()
      this.isError = false

      if (!this.v$.queueForm.$invalid) {
        try {
          const responseQueue = await queueAPI.createQueue(this.userToken, {
            ...this.queueForm,
            queue_id: this.queue.id,
          })
          // this.appointmentList = await responseQueue.data
          await this.initData()
        } catch (e) {
          this.isError = true
        } finally {
          this.isLoading = false
        }
      }
    },
    async makeFilter() {
      this.isLoading = true
      this.isError = false
      try {
        const responseAppointments = await appointmentAPI.getAppointmentList(
          this.userToken,
          this.queue.id,
          this.filterFields.employee,
          this.filterFields.date,
          this.filterFields.is_booked
        )
        this.appointmentList = await responseAppointments.data
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    async deleteQueueHandler(queueId) {
      this.isLoading = true
      try {
        await queueAPI.deleteQueue(this.userToken, queueId)
        await this.$router.push({ name: "queues" })
        this.$router.go()
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    getFormattedDateComponent(dateTime) {
      return getFormattedDate(dateTime)
    },
    getFormattedTimeComponent(dateTime) {
      return getFormattedTime(dateTime)
    },
    getQueueLink() {
      return `${process.env.VUE_APP_CLIENT_PROTOCOL}://${process.env.VUE_APP_CLIENT_HOST}:${process.env.VUE_APP_CLIENT_PORT}/queue-registration/${this.queue.id}`
    },
  },
  watch: {
    filterFields: {
      handler(newValue, oldValue) {
        this.makeFilter()
      },
      deep: true,
    },
  },
}
</script>

<style scoped>
.invalid {
  color: #dc3545;
}
td,
tr {
  text-align: center;
}
</style>
