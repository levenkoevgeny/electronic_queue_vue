<template>
  <div class="containers">
    <div v-if="isLoading">
      <Spinner />
    </div>
    <div v-else class="Authorization">
      <br />
      <div class="name_user">
        <h1>
          Уважаемый <br>{{ appointment.appointment_lastname }}
          {{ appointment.appointment_firstname }}!
        </h1>
      </div>
      <div class="name_user">
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
      </div>
      <div class="text_user">
        <p>
          В случае, если при регистрации Вы указывали e-mail, Вы получите
          уведомление на указанный адрес.
        </p>
      </div>
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
  methods() { },
}
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.text_user {
  margin: 0 0 30px 0;
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

.name_user {
  margin: 0 0 30px 0;
}



.Authorization {
  border-radius: 20px;
  text-align: center;
  background-color: #fff;
  box-shadow: 0 0 10px #333;
  z-index: 1;
  position: relative;
  width: 450px;
  display: flex;
  flex-direction: column;
  justify-content: center;
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


@media screen and (max-width: 450px) {

  .Authorization {
    width: 80vw;
  }

}
</style>
