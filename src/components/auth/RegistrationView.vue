<template>
  <div class="containers">
    <div class="wrpper">
      <div class="Authorization">
        <img src="@/assets/amia_logo_med.png" alt="@/assets/amia_logo_med.png" class="img_logo" />
        <div class="alert-dangers" v-if="v$.$errors.length > 0">
          <!--      <h5 v-if="v$.auth_data.username.$error">Логин:</h5>-->
          <p v-for="error of v$.auth_data.username.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>
          <!--      <h5 v-if="v$.auth_data.password.$error">Пароль:</h5>-->
          <p v-for="error of v$.auth_data.password.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>
          <!--      <h5 v-if="v$.auth_data.confirmPassword.$error">Пароль (повтор):</h5>-->
          <p v-for="error of v$.auth_data.confirmPassword.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>
        </div>
        <form @submit.prevent="submitHandler">
          <div class="after_input" id="person">
            <input type="text" class="form-control" placeholder="name@example.com" v-model="auth_data.username"
              @blur="v$.auth_data.username.$touch" />
          </div>
          <div class="after_input" id="lock">
            <input type="password" class="form-control" placeholder="Password" v-model="auth_data.password"
              @blur="v$.auth_data.password.$touch" />
          </div>
          <div class="after_input" id="lock_repeat">
            <input type="password" class="form-control" placeholder="Repeat Password"
              v-model="auth_data.confirmPassword" @blur="v$.auth_data.confirmPassword.$touch" />
          </div>
          <div class="after_input">
            <input type="checkbox" class="form-check-input" id="exampleCheck1" />
            <label class="form-check-label" for="exampleCheck1">Принимаю условия пользовательского соглашения</label>
          </div>
          <div class="after_input">
            <button type="submit" class="registerbtn" v-if="v$.$invalid" disabled>
              Регистрация
            </button>
            <button type="submit" class="registerbtn" v-else>
              Регистрация
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core"
import { required, helpers, sameAs } from "@vuelidate/validators"
import { mapGetters } from "vuex"
import { authApi } from "@/api/authAPI"

export default {
  name: "RegistrationView",
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      auth_data: {
        username: "",
        password: "",
        confirmPassword: "",
      },
    }
  },
  validations() {
    const passwordRegex = helpers.regex(
      /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/
    )
    const loginRegex = helpers.regex(/^[a-zA-Z\d]*$/)
    const same = sameAs(this.auth_data.password)
    const isUserNameTaken = helpers.withAsync(async (value) => {
      if (value === "") return true
      const response = await authApi.getUserNames(value)
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(response.data.length <= 0), 1000)
      })
    })
    return {
      auth_data: {
        username: {
          required: helpers.withMessage(
            "Поле 'Логин' не может быть пустым",
            required
          ),
          isUnique: helpers.withMessage(
            "Пользователь с таким именем уже присутствует в системе",
            isUserNameTaken
          ),
          loginRegex: helpers.withMessage(
            "Поле 'Логин' допускает только латинские буквы",
            loginRegex
          ),
        },
        password: {
          required: helpers.withMessage(
            "Поле 'Пароль' не может быть пустым",
            required
          ),
          passwordRegex: helpers.withMessage(
            "Пароль не удовлетворяет минимальным требованиям безопасности (пароль должен состоять из не менее 6 символов в которых должны присутствовать строчные, прописные буквы, цифры, спецсимволы)",
            passwordRegex
          ),
        },
        confirmPassword: {
          same: helpers.withMessage("Введенные пароли не совпадают", same),
        },
      },
    }
  },
  computed: {
    ...mapGetters({
      isRegistrationError: "auth/getIsRegistrationError",
    }),
    dataIsValid: function () {
      if (this.v$.$pending) {
        return true
      } else return this.v$.$invalid
    },
  },
  methods: {
    submitHandler(e) {
      if (!this.v$.$invalid) {
        this.$store.dispatch("auth/actionRegistration", { ...this.auth_data })
      }
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

.form-check-input {
  margin: 3px 10px;
}

.Authorization {
  border-radius: 20px;
  background-color: #fff;
  box-shadow: 0 0 10px #333;
  z-index: 1;
  position: relative;
  width: 450px;

  display: flex;
  flex-direction: column;
  justify-content: center;
}

.after_input {
  width: 100%;
  padding: 10px;
  margin: 0px auto 0px auto;
  display: flex;
  justify-content: center;
}

input[type="text"],
input[type="password"] {
  width: 65%;
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

#lock_repeat::before {
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


@media screen and (max-width: 450px) {
  .Authorization {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }

  /* .img_logo {

    height: 150px;
  } */
  .form-check-label {
    font-size: 0.8em;
  }
}
</style>
