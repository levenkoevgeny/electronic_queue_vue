<template>
  <div class="mb-3">
    <input type="text" class="form-control" v-model="queueItem.queue_name" />
    <div
      :class="{
        invalid: v$.queueItem.queue_name.$silentErrors.length,
        'visually-hidden': !v$.queueItem.queue_name.$silentErrors.length,
      }"
    >
      Это поле не может быть пустым!
    </div>
  </div>
  <div class="mb-3 form-check">
    <input
      type="checkbox"
      class="form-check-input"
      v-model="queueItem.is_active"
    />
    <label class="form-check-label">Очередь активна</label>
  </div>
</template>

<script>
import { queueAPI } from "@/api/queueAPI"
import useVuelidate from "@vuelidate/core"
import { required } from "@vuelidate/validators"
import debounce from "lodash.debounce"
import { mapGetters } from "vuex"

export default {
  name: "QueueUpdateForm",
  emits: ["setIsError"],
  setup() {
    return { v$: useVuelidate() }
  },
  validations() {
    return {
      queueItem: {
        queue_name: { required },
      },
    }
  },
  data() {
    return {
      isSaving: false,
    }
  },
  props: {
    queueItem: { type: Object, required: true },
  },
  methods: {
    updateQueueData: debounce(async function () {
      if (!this.v$.$invalid) {
        try {
          await queueAPI.updateQueueData(this.userToken, this.queueItem)
        } catch (e) {
          this.$emit("setIsError", true)
        } finally {
        }
      }
    }, 500),
  },
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
      userToken: "auth/getToken",
    }),
  },
  watch: {
    queueItem: {
      handler(newValue, oldValue) {
        this.updateQueueData()
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
