<template>
  <div class="container">
    <div v-if="isLoading">
      <Spinner />
    </div>
    <div v-else>
      <h1>{{ queue.queue_name }}</h1>
      <div>
        <div class="mb-3">
          <select class="form-select" v-model="selectedEmployee">
            <option
              v-for="employee in employeeList"
              :key="employee.id"
              :value="employee.id"
            >
              {{ employee.last_name }}
            </option>
          </select>
        </div>
        <br />
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
              ).toLocaleTimeString()
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
  </div>
</template>

<script>
import { queueAPI } from "@/api/queueAPI"
import { appointmentAPI } from "@/api/appointmentAPI"
import { employeeAPI } from "@/api/employeeAPI"
import { mapGetters } from "vuex"
import Spinner from "@/components/common/Spinner"

export default {
  name: "QueueRegistration",
  components: { Spinner },
  data() {
    return {
      calendar: null,
      queue: null,
      isLoading: true,
      isError: false,
      freeAppointmentList: [],
      employeeList: [],
      selectedEmployee: null,
      selectedTime: null,
      appointmentForm: {
        id: "",
        appointment_lastname: "jhg",
        appointment_firstname: "jg",
        appointment_patronymic: "jg",
        appointment_email: "hhh@sdf.by",
        appointment_phone: "khkjh",
        appointment_comment: "",
      },
    }
  },
  methods: {
    async getFreeAppointment(appointmentDate) {
      this.isLoading = true
      this.isError = false
      try {
        const response = await appointmentAPI.getAppointmentList(
          this.userToken,
          this.queue.id,
          this.selectedEmployee,
          false,
          appointmentDate
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
  },
  async created() {
    try {
      const responseCalendar = await queueAPI.getCalendar(this.userToken)
      const restData = await responseCalendar.data["calendar"]

      let calendarArray = []
      restData.forEach((item) => {
        calendarArray.push(JSON.parse(item))
      })
      this.calendar = calendarArray

      const responseQueue = await queueAPI.getQueueList(
        this.userToken,
        this.$route.params.uuid
      )
      if (responseQueue.data.length) {
        this.queue = responseQueue.data[0]
      }

      const responseEmployees = await employeeAPI.getEmployeeList(
        this.userToken
      )
      this.employeeList = await responseEmployees.data
    } catch (e) {
      this.isError = true
    } finally {
      this.isLoading = false
    }
  },

  computed: {
    ...mapGetters({
      userData: "auth/getUser",
      userToken: "auth/getToken",
    }),
  },
}
</script>

<style scoped></style>
