<template>
  <div class="container">
    <div v-if="isError" class="alert alert-danger m-0 p-3" role="alert">
      Что-то пошло не так!
    </div>
    <div v-if="isLoading">
      <Spinner />
    </div>
    <div v-else>
      <div v-if="queue.is_active">
        <h1>{{ queue.queue_name }}</h1>
        <div>
          <div class="my-3">{{ getCurrentMonthName }} {{ getCurrentYear }}</div>
          <div>
            <button @click="monthDecrement">Prev</button>
            <button @click="setCurrentDate">Current</button>
            <button @click="monthIncrement">Next</button>
          </div>

          <button
            type="button"
            class="btn btn-light m-2"
            v-for="calendarItem in calendar"
            :key="calendarItem.id"
            @click="getFreeAppointment(calendarItem.day_date)"
          >
            {{ calendarItem.day_date }} {{ calendarItem.day_name }}
          </button>
          <br />
          <br />

          <div>
            <div class="mb-3">
              <select class="form-select" v-model="selectedEmployee">
                <option selected value="">Выберите сотрудника</option>
                <option
                  v-for="employee in employeeList"
                  :key="employee.id"
                  :value="employee.id"
                >
                  {{ employee.last_name }}
                </option>
              </select>
            </div>
          </div>

          <br />
          <div v-if="freeAppointmentList.length">
            <button
              type="button"
              class="btn btn-light m-2"
              v-for="freeAppointment in freeAppointmentList"
              :key="freeAppointment.id"
              @click="setAppointment(freeAppointment.id)"
            >
              {{
                new Date(
                  freeAppointment.appointment_date_time
                ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              }}
            </button>
            <br />
            <br />
            <form @submit="appointmentFormSubmitHandler">
              <div class="mb-3">
                <label class="form-label">Фамилия</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="appointmentForm.appointment_lastname"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Имя</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="appointmentForm.appointment_firstname"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Отчество</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="appointmentForm.appointment_patronymic"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">E-mail</label>
                <input
                  type="email"
                  class="form-control"
                  v-model="appointmentForm.appointment_email"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Телефон</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="appointmentForm.appointment_phone"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Комментарий к записи</label>

                <textarea
                  cols="30"
                  rows="3"
                  class="form-control"
                  v-model="appointmentForm.appointment_comment"
                ></textarea>
              </div>
              <button type="submit" class="btn btn-primary">Записаться</button>
            </form>
          </div>
        </div>
      </div>
      <div v-else><h3>Очередь не активна</h3></div>
    </div>
  </div>
</template>

<script>
import { clientAPI } from "@/api/clientAPI"
import Spinner from "@/components/common/Spinner"

export default {
  name: "QueueRegistration",
  components: { Spinner },
  data() {
    return {
      calendar: null,
      currentDate: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
      },
      queue: null,
      isLoading: true,
      isError: false,
      freeAppointmentList: [],
      employeeList: [],
      selectedEmployee: null,
      selectedTime: null,
      appointmentForm: {
        id: "",
        appointment_lastname: "Фамилия",
        appointment_firstname: "Имя",
        appointment_patronymic: "Отчество",
        appointment_email: "test@amia.by",
        appointment_phone: "+375-29-111-11-11",
        appointment_comment: "",
      },
    }
  },
  methods: {
    async getFreeAppointment(appointmentDate) {
      this.isLoading = true
      this.isError = false
      try {
        const response = await clientAPI.getAppointmentList(
          this.queue.id,
          this.selectedEmployee,
          appointmentDate,
          false
        )
        this.freeAppointmentList = await response.data
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    async appointmentFormSubmitHandler(event) {
      event.preventDefault()
      this.isError = false
      this.isLoading = true
      try {
        const responseUpdate =
          await appointmentAPI.partialUpdateAppointmentData(this.userToken, {
            ...this.appointmentForm,
            is_booked: true,
          })
        const updatedAppointment = await responseUpdate.data
        this.$router.replace({
          name: "queue-registration-success",
          params: { id: updatedAppointment.id },
        })
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    setAppointment(appointmentId) {
      this.appointmentForm.id = appointmentId
    },
    monthIncrement() {
      this.currentDate.month++
      if (this.currentDate.month > 12) {
        this.currentDate.year++
        this.currentDate.month = 1
      }
      this.updateCalendar()
    },
    monthDecrement() {
      this.currentDate.month--
      if (this.currentDate.month < 1) {
        this.currentDate.year--
        this.currentDate.month = 12
      }
      this.updateCalendar()
    },
    setCurrentDate() {
      this.currentDate.year = new Date().getFullYear()
      this.currentDate.month = new Date().getMonth() + 1
      this.updateCalendar()
    },
    async updateCalendar() {
      this.isLoading = true
      this.isError = false
      this.freeAppointmentList = []
      try {
        const responseCalendar = await clientAPI.getCalendar(
          this.currentDate.year,
          this.currentDate.month
        )
        const restData = await responseCalendar.data["calendar"]
        this.calendar = JSON.parse(restData)
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
  },
  async created() {
    try {
      const responseCalendar = await clientAPI.getCalendar()
      const restData = await responseCalendar.data["calendar"]
      this.calendar = JSON.parse(restData)

      const responseQueue = await clientAPI.getQueueData(
        this.$route.params.uuid
      )
      this.queue = responseQueue.data

      const responseEmployees = await clientAPI.getEmployeeList()
      this.employeeList = await responseEmployees.data
    } catch (e) {
      this.isError = true
    } finally {
      this.isLoading = false
    }
  },

  computed: {
    getCurrentMonthName() {
      const monthNames = [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь",
      ]
      return monthNames[this.currentDate.month - 1]
    },
    getCurrentYear() {
      return this.currentDate.year
    },
  },
}
</script>

<style scoped></style>
