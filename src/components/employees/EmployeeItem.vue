<template>
  <div
    class="shadow-lg p-3 mb-4 bg-body rounded"
    style="max-width: 60rem; margin-left: auto; margin-right: auto"
  >
    <div class="row">
      <div class="col-md-4">
        <input
          class="form-check-input mx-3"
          type="checkbox"
          v-model="employeeItem.checked_val"
        />
        <img src="" class="card-img-top" alt="..." />
      </div>
      <div class="col-md-8">
        <div class="my-3">
          <input
            type="text"
            class="form-control"
            v-model="employeeItem.last_name"
            @blur="v$.employeeItem.last_name.$touch"
          />
          <div
            :class="{
              invalid: v$.employeeItem.last_name.$error,
              'visually-hidden': !v$.employeeItem.last_name.$error,
            }"
          >
            Это поле не может быть пустым!
          </div>
        </div>

        <div class="mb-3">
          <input
            type="text"
            class="form-control"
            v-model="employeeItem.first_name"
          />
        </div>
        <div class="mb-3">
          <input
            type="text"
            class="form-control"
            v-model="employeeItem.patronymic"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import debounce from "lodash.debounce"
import { mapGetters } from "vuex"
import { employeeAPI } from "@/api/employeeAPI"
import useVuelidate from "@vuelidate/core"
import { required } from "@vuelidate/validators"

export default {
  name: "EmployeeItem",
  setup() {
    return { v$: useVuelidate() }
  },
  validations() {
    return {
      employeeItem: {
        last_name: { required },
      },
    }
  },
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
      if (!this.v$.$invalid) {
        this.$emit("setIsSaving", true)
        try {
          await employeeAPI.updateEmployeeData(
            this.userToken,
            this.employeeItem
          )
        } catch (error) {
          this.$emit("setIsError", true)
        } finally {
          this.$emit("setIsSaving", false)
        }
      }
    }, 500),
  },
  watch: {
    employeeItem: {
      handler(newValue, oldValue) {
        this.updateWordData()
      },
      deep: true,
    },
  },
}
</script>

<style scoped>
.invalid {
  color: #dc3545;
}
</style>
