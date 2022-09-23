<template>
  <h1>Login</h1>
  <div>
    <form @submit="submitHandler">
      <h1>Авторизуйтесь</h1>
      <div>
        <input
          type="text"
          placeholder="name@example.com"
          v-model="auth_data.username"
          required
        />
        <label>Логин</label>
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          v-model="auth_data.password"
          required
        />
        <label>Пароль</label>
      </div>
      <button class="w-100 btn btn-lg btn-primary" type="submit">Вход</button>
      <br />
      <br />
      <a class="" href="/registration">Нет аккаунта?</a>
    </form>
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
