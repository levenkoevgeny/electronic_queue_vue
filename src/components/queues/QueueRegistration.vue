<template>
  <div class="modal fade" id="appointmentFormModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content" style="border-radius: 20px">
        <form @submit.prevent="appointmentFormSubmitHandler">
          <div class="modal-header">
            <h5 v-if="selectedAppointment" class="modal-title">
              Форма записи на
              {{
              new Date(
              selectedAppointment.appointment_date_time
              ).toLocaleTimeString([], { hour: "numeric", minute: "numeric" })
              }}
              {{
              new Date(selectedAppointment.appointment_date_time)
              .toISOString()
              .split("T")[0]
              }}
            </h5>
            <h5 v-else class="modal-title">Форма записи</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
              ref="modalAppointmentClientClose"></button>
          </div>
          <div class="modal-body">
            <div class="after_input" id="person">
              <input type="text" class="form-control" placeholder="Фамилия"
                v-model="appointmentForm.appointment_lastname" @blur="v$.appointmentForm.appointment_lastname.$touch"
                required />
              <div :class="{
                invalid: v$.appointmentForm.appointment_lastname.$error,
                'visually-hidden':
                  !v$.appointmentForm.appointment_lastname.$error,
              }">
                Это поле не может быть пустым!
              </div>
            </div>
            <div class="after_input" id="person">
              <input type="text" class="form-control" placeholder="Имя" v-model="appointmentForm.appointment_firstname"
                @blur="v$.appointmentForm.appointment_firstname.$touch" required />
              <div :class="{
                invalid: v$.appointmentForm.appointment_firstname.$error,
                'visually-hidden':
                  !v$.appointmentForm.appointment_firstname.$error,
              }">
                Это поле не может быть пустым!
              </div>
            </div>
            <div class="after_input" id="person">
              <input type="text" class="form-control" placeholder="Отчество"
                v-model="appointmentForm.appointment_patronymic" />
            </div>
            <div class="after_input" id="log_email">
              <input type="text" class="form-control" placeholder="E-mail" v-model="appointmentForm.appointment_email"
                @blur="v$.appointmentForm.appointment_email.$touch" />
              <div :class="{
                invalid: v$.appointmentForm.appointment_email.$error,
                'visually-hidden':
                  !v$.appointmentForm.appointment_email.$error,
              }">
                Некорректный e-mail!
              </div>
            </div>
            <div class="after_input" id="phone">
              <input type="text" class="form-control" placeholder="Телефон"
                v-model="appointmentForm.appointment_phone" />
            </div>
            <div class="after_textarea">
              <textarea cols="10" rows="3" class="form-control" placeholder="Комментарий к записи"
                v-model="appointmentForm.appointment_comment"></textarea>
            </div>
            <div v-if="isError" class="alert-dangers" role="alert">
              Что-то пошло не так!
            </div>
            <div v-if="isAlreadyBooked" class="alert-dangers" role="alert">
              Запись уже занята!
            </div>

          </div>
          <div class="modal-footer">
            <button v-if="v$.appointmentForm.$invalid" type="submit" class="registerbtn" disabled>
              Записаться
            </button>
            <button v-else type="submit" class="registerbtn">Записаться</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="containers">
    <div class="wrpper">
      <div v-if="isLoading">
        <Spinner />
      </div>
      <div v-else>
        <div v-if="queue.is_active">
          <div class="row">
            <div class="name_form">
              <h1>{{ queue.queue_name }}</h1>
            </div>

            <div class="worker_card ">
              <p v-if="!selectedEmployee" class="h_text">Выберите сотрудника</p>
              <div v-for="employee in employeeList" :key="employee.id" :value="employee.id">
                <EmployeeItem :employee="employee" @set-selected-employee="setSelectedEmployee" />
              </div>
            </div>
            <div v-if="selectedEmployee" class="calendar_div">
              <p v-if="!selectedDate" class="h_text">Выберите дату</p>
              <div class="calendar">
                <div id="header_cal">
                  <span class="left_btn" @click="monthDecrement" id="prev"><img
                      src="https://img.icons8.com/external-becris-lineal-becris/30/000000/external-left-arrow-mintab-for-ios-becris-lineal-becris.png" /></span>
                  <span class="mounth-year" id="label">{{ getCurrentMonthName }} {{ getCurrentYear }}</span>
                  <span class="right_btn" @click="monthIncrement" id="next">
                    <img
                      src="https://img.icons8.com/external-becris-lineal-becris/30/000000/external-next-mintab-for-ios-becris-lineal-becris.png" />
                  </span>
                </div>

                <table id="days_cal">
                  <tr>
                    <td>Пн</td>
                    <td>Вт</td>
                    <td>Ср</td>
                    <td>Чт</td>
                    <td>Пт</td>
                    <td>Сб</td>
                    <td>Вс</td>
                  </tr>
                </table>
                <div id="id_day">
                  <div v-for="calendarItem in calendar" :key="calendarItem.id" id="days">
                    <CalendarItem :calendar-item="calendarItem" @get-free-appointment="getFreeAppointment" />
                  </div>
                </div>
                <div v-if="freeAppointmentList.length" id="cal">
                  <div v-for="freeAppointment in freeAppointmentList" :key="freeAppointment.id">
                    <TimeItem :free-appointment="freeAppointment" @set-appointment="setAppointment" />
                  </div>
                </div>
              </div>
            </div>

            <button v-if="v$.selectedAppointment.$invalid" type="button" class="registerbtn" data-bs-toggle="modal"
              data-bs-target="#appointmentFormModal" disabled>
              Записаться
            </button>

            <button v-else type="button" class="registerbtn" data-bs-toggle="modal"
              data-bs-target="#appointmentFormModal">
              Записаться
            </button>
          </div>
        </div>
        <div class="alert-dangers " v-else>
          <h3>Очередь не активна</h3>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { clientAPI } from "@/api/clientAPI"
import Spinner from "@/components/common/Spinner"
import EmployeeItem from "@/components/queues/EmployeeItem"
import CalendarItem from "@/components/queues/CalendarItem"
import TimeItem from "@/components/queues/TimeItem"
import useVuelidate from "@vuelidate/core"
import { required, email } from "@vuelidate/validators"

export default {
  name: "QueueRegistration",
  setup() {
    return { v$: useVuelidate() }
  },
  validations() {
    return {
      selectedAppointment: { required },
      appointmentForm: {
        appointment_lastname: { required },
        appointment_firstname: { required },
        appointment_email: { email }
      }
    }
  },
  components: { TimeItem, Spinner, EmployeeItem, CalendarItem },
  data() {
    return {
      calendar: null,
      currentDate: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
      },
      queue: null,
      freeAppointmentList: [],
      employeeList: [],
      selectedEmployee: null,
      selectedDate: null,
      selectedAppointment: null,
      appointmentForm: {
        id: "",
        appointment_lastname: "",
        appointment_firstname: "",
        appointment_patronymic: "",
        appointment_email: "",
        appointment_phone: "",
        appointment_comment: "",
        fromClient: true
      },
      isLoading: true,
      isError: false,
      isAlreadyBooked: false
    }
  },
  methods: {
    async getFreeAppointment(appointmentDate) {
      this.calendar.forEach(item => {
        item.isActive = false
        if (item.day_date === appointmentDate) {
          item.isActive = true
        }
      })


      this.selectedDate = appointmentDate
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
        const responseUpdate = await clientAPI.partialUpdateAppointmentData({
          ...this.selectedAppointment,
          appointment_lastname: this.appointmentForm.appointment_lastname,
          appointment_firstname: this.appointmentForm.appointment_firstname,
          appointment_patronymic: this.appointmentForm.appointment_patronymic,
          appointment_email: this.appointmentForm.appointment_email,
          appointment_phone: this.appointmentForm.appointment_phone,
          appointment_comment: this.appointmentForm.appointment_comment,
          is_booked: true
        })
        const updatedAppointment = await responseUpdate.data

        this.$refs.modalAppointmentClientClose.click()
        this.clearAppointmentForm()
        this.$router.replace({
          name: "queue-registration-success",
          params: { id: updatedAppointment.id }
        })
      } catch (e) {
        const responseDataJSON = JSON.parse(e.response.data)
        if (responseDataJSON.is_already_booked) {
          this.isAlreadyBooked = true
        } else {
          this.isError = true
        }
      } finally {
        this.isLoading = false
      }
    },
    setSelectedEmployee(employeeId) {
      this.selectedEmployee = employeeId
      this.freeAppointmentList = []
      this.employeeList.forEach(item => {
        item.isActive = false
        if (item.id === employeeId) {
          item.isActive = true
        }
      })
    },
    setAppointment(appointment) {

      this.freeAppointmentList.forEach(item => {
        item.isActive = false
        if (item.id === appointment.id) {
          item.isActive = true
        }
      })

      this.isAlreadyBooked = false
      this.appointmentForm.id = appointment.id
      this.selectedAppointment = appointment
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
        this.calendar = this.calendar.map(calendarItem => {
          return { ...calendarItem, isActive: false }
        })
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    getPhotoURL(url) {
      return `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}${url}`
    },
    clearAppointmentForm() {
      this.appointmentForm = {
        id: "",
        appointment_lastname: "",
        appointment_firstname: "",
        appointment_patronymic: "",
        appointment_email: "",
        appointment_phone: "",
        appointment_comment: "",
        fromClient: true
      }
    }
  },
  async created() {
    try {
      const responseCalendar = await clientAPI.getCalendar()
      const restData = await responseCalendar.data["calendar"]
      this.calendar = JSON.parse(restData)
      this.calendar = this.calendar.map(calendarItem => {
        return { ...calendarItem, isActive: false }
      })
      const responseQueue = await clientAPI.getQueueData(
        this.$route.params.uuid
      )
      this.queue = responseQueue.data

      const responseEmployees = await clientAPI.getEmployeeList(
        this.queue.organization
      )
      this.employeeList = await responseEmployees.data
      this.employeeList = this.employeeList.map(employee => {
        return { ...employee, isActive: false }
      })

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
        "Декабрь"
      ]
      return monthNames[this.currentDate.month - 1]
    },
    getCurrentYear() {
      return this.currentDate.year
    }
  }
}
</script>

<style scoped>
/* ---------------------------------------стили для кнопок ------------------------------------------------------- */

.calendar #days_cal .data td:hover:not(.nil, .holiday) {
  background-color: #f2ddcc;
  border-radius: 10px;
  color: #333;
  /* не подсвечиваются выходные и дни других месяцев */
}



#days {
  display: flex;
  justify-content: center;

}


/*  -------------------------------------------------------------------------------- */

.name_form {
  display: flex;
  justify-content: center;
  color: #fff;
  padding-bottom: 20px;
}

.registerbtn {
  width: 70%;
  margin: 20px auto 20px auto;
  font-size: 20px;
  padding: 10px 0 10px 0;
  border-radius: 15px;
  border: 0px;
  background-color: #8ebba7;

}

.alert-dangers {
  border-color: #B63E5A;
  background: #E26868;
  color: #fff;
  margin: 0 40px;
  border-radius: 10px;
  font-weight: 300;
  font-size: 20px;
  text-align: center;
}

#cal {
  margin: 5px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
}

.containers {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(60deg, #16213e, #61a4bc, #fe7e6d, #e94560);
  background-size: 500%;
  animation: gradientAnimation 35s ease infinite;
}

.error {
  background-color: #ef3c23;
  color: #000;
  font-size: 19px;
  padding-right: 5px;
  padding-top: 3px;
  margin: auto;
  display: flex;
  width: 50%;
  justify-content: center;
  align-items: initial;
}

.error::before {
  content: url(https://img.icons8.com/windows/22/000000/delete-sign.png);
  padding: 5px;
}

.close::before {
  content: url(https://img.icons8.com/windows/22/000000/delete-sign.png);
  padding: 5px;
}

#h2 {
  text-align: center;
  margin-top: 20px;
  margin-left: auto;
}

.column {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  background-position: left;
  background-repeat: no-repeat;
  background-size: 20%;
}

.close {
  margin: 20px 0 5px auto;
}

.rows {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.wrpper {
  background: rgb(255, 255, 255, 0.192);
  backdrop-filter: blur(10px);
  height: 100vh;
  width: 900px;
  border: 1px solid rgb(43, 43, 43, 0.568);
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
}

.calendar {
  border-radius: 20px;
  background-color: #fff;
  box-shadow: 0 0 10px #333;
  z-index: 1;
  width: 100%;
  position: relative;
  margin-bottom: 20px;
}

.entry_form {
  margin: 35px;
  width: 95%;
  border-radius: 20px;
  background-color: #fff;
  box-shadow: 0 0 10px #333;
  z-index: 1;
  position: absolute;
}

.after_input {
  width: 70%;
  padding: 10px;
  margin: 10px auto 0px auto;
  display: flex;
  justify-content: center;
}

.after_textarea {
  width: 65%;
  padding: 10px;
  margin: 10px auto 0px auto;
  display: flex;
  justify-content: center;
}

input[type="text"],
input[type="password"] {
  width: 80%;
  padding: 5px 10px;
  display: block;
  border: 0px;
  border-radius: 0;
  border-bottom: 1px solid #8ebba7;
  border-left: 1px solid #8ebba7;
}

input[type="text"]:hover,
input[type="password"]:hover {
  padding: 5px 7px;
}

.after_input::before {
  color: #89b4a1;
  padding: 3px;
  font-size: 20px;
  border-bottom: 1px solid #8ebba7;
}


#log_email::before {
  content: url(https://img.icons8.com/sf-ultralight-filled/25/000000/new-post.png);
}

#person::before {
  content: url(https://img.icons8.com/material/24/000000/person-male.png);
}

#phone::before {
  content: url(https://img.icons8.com/ios-filled/24/000000/phone.png);
}

.mounth-year {
  padding: 0 70px;
  font-size: 20px;
}

.calendar_div {
  margin-top: 10px;
  width: 47%;
}

#header_cal {
  display: flex;
  justify-content: center;
  padding: 10px 30px 0 30px;
}

#days_cal {
  width: 100%;
}

#days_cal td {
  color: #2b2b2b;
  width: 50px;
  height: 50px;
  line-height: 30px;
  text-align: center;
}

/* ----------card------------- */
.worker_card {
  display: flex;
  width: 47%;
  flex-direction: column;
  justify-content: flex-start;
  max-height: 70%;
  margin-left: 10px;
  overflow: auto;
}

.worker_card::-webkit-scrollbar {
  display: none;
}

.cards {
  background-color: #fff;
  border-radius: 20px;
  display: flex;
  width: 47%;
  flex-direction: row;
  justify-content: baseline;
  padding: 10px 20px 10px 20px;
  margin: 10px 5px;
}

.btns {
  text-decoration: none;
  color: #000;
  font-weight: 600;
  background-color: #8ebba7;
  text-align: center;
  border-radius: 10px;
  padding: 3px;
}

.stretched-link::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  content: "";
}

.cards img {
  width: 100px;
  height: 100px;
  background-color: rgb(197, 193, 193);
  border-radius: 50%;
  padding: 10px;
}

/* ---------end_card--------------- */

#id_day {
  display: grid;
  gap: normal;
  grid-template-columns: repeat(7, 1fr);
  padding-bottom: 30px;
  justify-content: center;


}

.h_text {
  color: #fff;
  font-size: 20px;
  font-weight: bolder;
  margin: 10px 20px;
  text-align: center;

}

.item_d {
  grid-area: 1;
}

body {
  margin: 0;
  background-color: #ddd;
  font-family: futura-pt, Avenir, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0 50%;
  }

  30% {
    background-position: 30% 50%;
  }

  50% {
    background-position: 70% 50%;
  }

  70% {
    background-position: 30% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

@media screen and (max-width: 750px) {
  .wrpper {
    width: 80%;
    align-items: flex-start;
    height: 100%;
  }

  .containers {
    height: 160vh;
    align-items: flex-start;
  }

  .calendar {
    width: 100%;
    align-items: center;
    justify-content: center;

  }

  .worker_card {
    max-height: 70vh;
    justify-content: flex-start;
    margin-bottom: 30px;
    margin-left: 0;
    width: 100%;
  }

  .calendar_div {
    width: 100%;
  }

  .mounth-year {
    padding: 0 10px;
  }

  #next {
    transform: scale(0.5, 0.5);
  }

  #prev {
    transform: scale(0.5, 0.5);
  }

  #id_day {
    display: grid;
    gap: normal;
    grid-template-columns: repeat(7, 1fr);
  }

  .buttons {
    border: 0;

    width: 43px;
    height: 43px;
    line-height: 30px;
    text-align: center;
  }
}
</style>
