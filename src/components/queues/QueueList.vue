<template>
  <QueueAddModal
    @add-new-queue="(newQueue) => queueList.push(newQueue)"
    @set-is-error="(isErrorVal) => (this.isError = isErrorVal)"
  />
  <br />
  <div v-if="isError" class="alert alert-danger m-0 p-3" role="alert">
    Что-то пошло не так!
  </div>
  <div v-if="isLoading">
    <Spinner />
  </div>
  <div v-else class="container">
    <div class="d-flex flex-row">
      <div v-if="queueList.length > 0" style="width: 30%" class="m-2">
        <h5>Список электронных очередей</h5>
        <button
          type="button"
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#addNewQueue"
        >
          Добавить очередь
        </button>
        <div v-for="queue in sortedQueueList" :key="queue.id">
          <router-link
            :to="{ name: 'queue_appointments', params: { id: queue.id } }"
            class="fs-5 fw-bold"
          >
            {{ queue.queue_name }}
          </router-link>
          <br />

          Всего записей - 100 Свободных - 90 Занято - 10
        </div>
      </div>
      <div style="width: 70%" class="m-2">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { queueAPI } from "@/api/queueDataAPI"
import { mapGetters } from "vuex"
import Spinner from "@/components/common/Spinner"
import QueueAddModal from "@/components/queues/QueueAddModal"

export default {
  name: "QueueList",
  components: { Spinner, QueueAddModal },
  data() {
    return {
      queueList: [],
      isLoading: true,
      isError: false,
    }
  },
  async created() {
    try {
      const response = await queueAPI.getQueueList(this.userToken)
      this.queueList = await response.data
    } catch (e) {
      this.isError = true
    } finally {
      this.isLoading = false
    }
  },
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
      userToken: "auth/getToken",
    }),
    sortedQueueList() {
      return this.queueList
    },
  },
}
</script>

<style scoped></style>
