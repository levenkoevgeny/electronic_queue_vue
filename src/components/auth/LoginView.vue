<template>
  <div v-if="isLogInError" class="alert alert-danger m-0 p-3" role="alert">
    Ошибка авторизации!
  </div>
  <div class="container">
    <h1>Login</h1>
    <div>
      <form @submit="submitHandler">
        <h1>Авторизуйтесь</h1>
        <div>
          <div class="mb-3">
            <label class="form-label">Логин</label>
            <input
              type="text"
              class="form-control"
              placeholder="name@example.com"
              v-model="auth_data.username"
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Пароль</label>
            <input
              type="password"
              class="form-control"
              placeholder="Password"
              v-model="auth_data.password"
              required
            />
          </div>
        </div>
        <button class="w-100 btn btn-lg btn-primary" type="submit">Вход</button>
        <br />
        <br />
        <a class="" href="/registration">Нет аккаунта?</a>
      </form>
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

<style scoped></style>
