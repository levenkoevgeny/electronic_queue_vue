<template>
  <div class="mb-3">
    <input
      class="form-check-input"
      type="checkbox"
      v-model="employeeItem.checked_val"
    />
    <input type="text" class="form-control" v-model="employeeItem.last_name" />
  </div>
</template>

<script>
import debounce from "lodash.debounce"
import { mapGetters } from "vuex"
import { employeeAPI } from "@/api/employeeAPI"

export default {
  name: "EmployeeItem",
  props: {
    employeeItem: { type: Object, required: true },
  },
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
      userToken: "auth/getToken",
    }),
  },
  methods: {
    updateWordData: debounce(async function () {
      this.$emit("setIsError", false)
      try {
        await employeeAPI.updateEmployeeData(this.userToken, this.employeeItem)
      } catch (error) {
        this.$emit("setIsError", true)
      }
    }, 500),
  },
  watch: {
    "employeeItem.last_name": {
      handler(newValue, oldValue) {
        this.updateWordData()
      },
    },
  },
}
</script>

<style scoped></style>
