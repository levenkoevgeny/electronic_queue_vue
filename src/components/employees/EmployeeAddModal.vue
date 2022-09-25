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
                required
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
            <button type="submit" class="btn btn-primary">Добавить</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { employeeAPI } from "@/api/employeeAPI"

export default {
  name: "EmployeeAddModal",
  data() {
    return {
      newEmployeeForm: {
        last_name: "",
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
      try {
        const response = await employeeAPI.addNewEmployee(this.userToken, {
          organization: this.userData.id,
          ...this.newEmployeeForm,
        })
        const newEmployee = await response.data
        this.newEmployeeForm = {
          last_name: "",
        }
        this.$refs.modalEmployeeClose.click()
        this.$emit("addNewEmployee", newEmployee)
      } catch (e) {
        this.$emit("setIsError", true)
      } finally {
      }
    },
  },
}
</script>

<style scoped></style>
