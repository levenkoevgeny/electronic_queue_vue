<template>

  <div class="containers">
    <div class="wrpper">
      <div class="Authorization">
        <img src="@/assets/amia_logo_med.png" alt="@/assets/amia_logo_med.png" class="img_logo">
        <form @submit=" submitHandler" id="authorization">
          <div class="alert-dangers " v-if="isLogInError" role="alert">
            <strong> Ошибка авторизации!</strong>
          </div>

          <div id="log">
            <div class="after_input" id="person">
              <input type="text" class="form-control" placeholder="name@example.com" v-model="auth_data.username"
                required />
            </div>
            <div class="after_input" id="lock">
              <input type="password" class="form-control" placeholder="Password" v-model="auth_data.password"
                required />
            </div>
          </div>
          <p class="to_sing_up">Нет акаунта?<a href="/registration" class="sing_up">Регистрация</a></p>
          <button class="registerbtn" type="submit">Авторизация</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "LoginView",
  data() {
    return {
      auth_data: {
        username: "",
        password: "",
      },
    }
  },
  computed: {
    ...mapGetters({
      isLogInError: "auth/getIsLogInError",
    }),
  },
  methods: {
    submitHandler(e) {
      e.preventDefault()
      e.stopPropagation()
      this.$store
        .dispatch("auth/actionLogIn", { ...this.auth_data })
        .then(() => {
          this.$router.replace(this.$route.query.redirect || "/")
        })
    },
  },
}
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
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



.error {
  background-color: #ef3c23;
  color: #000;
  font-size: 19px;
  padding-right: 5px;
  padding-top: 3px;
  margin: auto;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: initial;
}

.error::before {
  content: url(https://img.icons8.com/windows/22/000000/delete-sign.png);
  padding: 5px;

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

.wrpper {
  background: rgb(255, 255, 255, 0.192);
  backdrop-filter: blur(10px);
  height: 100vh;
  width: 900px;

  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
}

.Authorization {
  border-radius: 20px;
  background-color: #fff;
  box-shadow: 0 0 10px #333;
  z-index: 1;
  position: relative;
  width: 400px;
  height: 550px;
  display: flex;
  flex-direction: column;
  justify-content: center;

}

.after_input {
  width: 100%;
  padding: 10px;
  margin: 10px auto 0px auto;
  display: flex;
  justify-content: center;
}


input[type=text],
input[type=password] {
  width: 65%;
  padding: 5px 10px;
  display: block;
  border: 0px;
  border-radius: 0;
  border-bottom: 1px solid #8ebba7;
  border-left: 1px solid #8ebba7;
}

input[type=text]:hover,
input[type=password]:hover {
  padding: 5px 7px;
}


#authorization {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 30px 20px 30px;
  font-size: 30px;
  font-weight: normal;
}

#log_email::before {
  content: url(https://img.icons8.com/sf-ultralight-filled/25/000000/new-post.png);
}

#lock::before {
  content: url(https://img.icons8.com/material-rounded/24/000000/lock--v1.png);
}

#person::before {
  content: url(https://img.icons8.com/material/24/000000/person-male.png);
}

.after_input::before {
  color: #89b4a1;
  padding: 3px;
  font-size: 20px;
  border-bottom: 1px solid #8ebba7;
}

.registerbtn {
  width: 70%;
  margin: 20px auto 5px auto;
  font-size: 20px;
  padding: 10px 0 10px 0;
  border-radius: 15px;
  border: 0px;
  background-color: #8ebba7;

}

.alert-warning-alt {
  border-color: #F3F3EB;
  background: #E9CEAC;
  color: #fff;
}

.to_sing_up {
  margin: 0 auto 0 auto;
  font-size: 15px;
}

.sing_up {
  margin: 10px auto 0 auto;
  text-decoration: none;
  color: #8ebba7;
  font-weight: bold;
  padding: 5px;
}


.img_logo {

  margin: 10px auto 0px auto;
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



@media screen and (max-width:450px) {

  .Authorization {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
}
</style>
