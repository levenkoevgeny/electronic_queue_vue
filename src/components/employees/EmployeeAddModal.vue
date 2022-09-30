<template>
  <div
    class="modal fade"
    id="addNewEmployee"
    tabindex="-1"
    aria-labelledby="addNewEmployee"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <form @submit="addNewEmployee">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Новый сотрудник</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Фамилия</label>
              <input
                type="text"
                class="form-control"
                v-model="newEmployeeForm.last_name"
                @blur="v$.newEmployeeForm.last_name.$touch"
                required
              />

              <div
                :class="{
                  invalid: v$.newEmployeeForm.last_name.$error,
                  'visually-hidden': !v$.newEmployeeForm.last_name.$error,
                }"
              >
                Это поле не может быть пустым!
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Имя</label>
              <input
                type="text"
                class="form-control"
                v-model="newEmployeeForm.first_name"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Отчество</label>
              <input
                type="text"
                class="form-control"
                v-model="newEmployeeForm.patronymic"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              ref="modalEmployeeClose"
            >
              Закрыть
            </button>
            <button type="submit" class="btn btn-primary" v-if="!v$.$invalid">
              Добавить
            </button>
            <button type="submit" class="btn btn-primary" disabled v-else>
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { employeeAPI } from "@/api/employeeAPI"
import useVuelidate from "@vuelidate/core"
import { required } from "@vuelidate/validators"

export default {
  name: "EmployeeAddModal",
  data() {
    return {
      newEmployeeForm: {
        last_name: "",
        first_name: "",
        patronymic: "",
      },
    }
  },
  setup() {
    return { v$: useVuelidate() }
  },
  validations() {
    return {
      newEmployeeForm: {
        last_name: { required },
      },
    }
  },
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
      userToken: "auth/getToken",
    }),
  },
  methods: {
    async addNewEmployee(event) {
      event.preventDefault()
      this.$emit("setIsError", false)
      if (!this.v$.$invalid) {
        try {
          const response = await employeeAPI.addNewEmployee(this.userToken, {
            organization: this.userData.id,
            ...this.newEmployeeForm,
          })
          const newEmployee = await response.data
          this.$refs.modalEmployeeClose.click()
          setTimeout(() => {
            this.newEmployeeForm = {
              last_name: "",
              first_name: "",
              patronymic: "",
            }
            this.v$.newEmployeeForm.last_name.$dirty = false
          }, 500)
          this.$emit("addNewEmployee", newEmployee)
        } catch (e) {
          this.$emit("setIsError", true)
        } finally {
        }
      }
    },
  },
}
</script>

<style scoped>
.invalid {
  color: #dc3545;
}
</style>
