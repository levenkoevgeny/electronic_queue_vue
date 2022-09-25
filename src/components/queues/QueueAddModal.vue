<template>
  <div
    class="modal fade"
    id="addNewQueue"
    tabindex="-1"
    aria-labelledby="addNewQueue"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <form @submit="addNewQueue">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Новая очередь</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Название очереди</label>
              <input
                type="text"
                class="form-control"
                v-model="newQueueForm.queue_name"
                required
              />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              ref="modalClose"
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
import { queueAPI } from "@/api/queueDataAPI"

export default {
  name: "QueueAddModal",
  data() {
    return {
      newQueueForm: {
        queue_name: "",
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
    async addNewQueue(event) {
      event.preventDefault()
      this.$emit("setIsError", false)
      try {
        const response = await queueAPI.addNewQueue(this.userToken, {
          organization: this.userData.id,
          ...this.newQueueForm,
        })
        const newQueue = await response.data
        this.newQueueForm = {
          queue_name: "",
        }
        this.$refs.modalClose.click()
        this.$emit("addNewQueue", newQueue)
      } catch (e) {
        this.$emit("setIsError", true)
      } finally {
      }
    },
  },
}
</script>

<style scoped></style>
