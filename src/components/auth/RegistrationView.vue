<template>
  <div class="container">
    <br />
    <br />
    <h5>Регистрация</h5>

    <div class="alert alert-danger" v-if="v$.$errors.length > 0">
      <!--      <h5 v-if="v$.auth_data.username.$error">Логин:</h5>-->
      <p v-for="error of v$.auth_data.username.$errors" :key="error.$uid">
        {{ error.$message }}
      </p>
      <!--      <h5 v-if="v$.auth_data.password.$error">Пароль:</h5>-->
      <p v-for="error of v$.auth_data.password.$errors" :key="error.$uid">
        {{ error.$message }}
      </p>
      <!--      <h5 v-if="v$.auth_data.confirmPassword.$error">Пароль (повтор):</h5>-->
      <p
        v-for="error of v$.auth_data.confirmPassword.$errors"
        :key="error.$uid"
      >
        {{ error.$message }}
      </p>
    </div>

    <form @submit.prevent="submitHandler">
      <div class="mb-3">
        <label class="form-label">Логин</label>
        <input
          type="text"
          class="form-control"
          placeholder="name@example.com"
          v-model="auth_data.username"
          @blur="v$.auth_data.username.$touch"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">Пароль</label>
        <input
          type="password"
          class="form-control"
          placeholder="Password"
          v-model="auth_data.password"
          @blur="v$.auth_data.password.$touch"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">Повторите пароль</label>
        <input
          type="password"
          class="form-control"
          placeholder="Password"
          v-model="auth_data.confirmPassword"
          @blur="v$.auth_data.confirmPassword.$touch"
        />
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="exampleCheck1" />
        <label class="form-check-label" for="exampleCheck1"
          >Принимаю условия пользовательского соглашения</label
        >
      </div>
      <button type="submit" class="btn btn-primary" v-if="v$.$invalid" disabled>
        Регистрация
      </button>
      <button type="submit" class="btn btn-primary" v-else>Регистрация</button>
    </form>
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

<style scoped></style>
