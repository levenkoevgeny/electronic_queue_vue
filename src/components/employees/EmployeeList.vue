<template>
  <EmployeeAddModal
    @add-new-employee="(employee) => this.employeeList.push(employee)"
    @set-is-error="(errorValue) => (this.isError = errorValue)"
  />

  <div v-if="isError" class="alert alert-danger m-0 p-3" role="alert">
    Что-то пошло не так!
  </div>
  <div v-if="isLoading">
    <Spinner />
  </div>

  <div v-else class="container">
    <div class="my-3">
      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#addNewEmployee"
      >
        Добавить сотрудника
      </button>
    </div>
    <button
      @click="deleteCheckedWordsHandler"
      class="btn btn-danger"
      v-if="checkedForDeleteCount > 0"
    >
      Удалить выбранные ({{ checkedForDeleteCount }})
    </button>
    <div v-for="employee in sortedEmployeeList" :key="employee.id">
      <EmployeeItem :employee-item="employee" />
    </div>
  </div>
</template>

<script>
import EmployeeAddModal from "@/components/employees/EmployeeAddModal"
import EmployeeItem from "@/components/employees/EmployeeItem"
import Spinner from "@/components/common/Spinner"
import { mapGetters } from "vuex"
import { employeeAPI } from "@/api/employeeAPI"

export default {
  name: "EmployeeList",
  components: { EmployeeItem, Spinner, EmployeeAddModal },
  data() {
    return {
      employeeList: [],
      isLoading: true,
      isError: false,
    }
  },
  async created() {
    try {
      const response = await employeeAPI.getEmployeeList(this.userToken)
      this.employeeList = await response.data
      this.employeeList = this.employeeList.map((employee) => ({
        ...employee,
        checked_val: false,
      }))
    } catch (e) {
      this.isError = true
    } finally {
      this.isLoading = false
    }
  },
  methods: {
    deleteCheckedWordsHandler() {
      this.isLoading = true
      let requestIds = []
      let responseIds = []

      this.employeeList.map((employee) => {
        if (employee.checked_val) {
          requestIds.push(employee.id)
        }
        return
      })
      let requests = requestIds.map((id) =>
        employeeAPI.deleteEmployee(this.userToken, id)
      )
      Promise.all(requests)
        .then((responses) => {
          responses.forEach((response) => {
            responseIds.push(response.data.id)
          })
        })
        .then(() => {
          this.employeeList = this.employeeList.filter(
            (employee) => !responseIds.includes(employee.id)
          )
        })
        .finally(() => {
          this.isLoading = false
        })
    },
  },
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
      userToken: "auth/getToken",
    }),
    checkedForDeleteCount() {
      let counter = 0
      this.employeeList.map((employee) => {
        if (employee.checked_val) {
          counter++
        }
      })
      return counter
    },
    sortedEmployeeList() {
      return this.employeeList
    },
  },
}
</script>

<style scoped></style>
