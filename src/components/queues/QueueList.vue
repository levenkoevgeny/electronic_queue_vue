<template>
  <QueueAddModal
    @add-new-queue="(newQueue) => queueList.push(newQueue)"
    @set-is-error="(isErrorVal) => (this.isError = isErrorVal)"
  />
  <div v-if="isError" class="alert alert-danger m-0 p-3" role="alert">
    Что-то пошло не так!
  </div>
  <div v-if="isLoading">
    <Spinner />
  </div>
  <div v-else>
    <AdminNav />
    <div class="container">
      <div class="d-flex flex-row mt-3">
        <div v-if="sortedQueueList.length > 0" style="width: 30%" class="m-2">
          <h5 class="mb-3">Список электронных очередей</h5>
          <button
            type="button"
            class="btn btn-primary mb-3"
            data-bs-toggle="modal"
            data-bs-target="#addNewQueue"
          >
            Добавить очередь
          </button>
          <div v-for="queue in sortedQueueList" :key="queue.id">
            <router-link
              :to="{ name: 'queue_appointments', params: { id: queue.id } }"
              class="fs-5 fw-bold"
              v-if="queue.is_active"
            >
              {{ queue.queue_name }}
            </router-link>
            <router-link
              :to="{ name: 'queue_appointments', params: { id: queue.id } }"
              class="fs-5 fw-bold link-secondary"
              v-else
            >
              {{ queue.queue_name }}
            </router-link>
            <br />
            <div v-if="queue.appointment_count > 0">
              Всего записей - {{ queue.appointment_count }} Свободных -
              {{ queue.get_free_appointment_count }} Занято -
              {{ queue.get_booked_appointment_count }}
            </div>
            <div v-else>Очередь не сформирована</div>
          </div>
        </div>
        <div v-else>
          <h5>Список пуст</h5>
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#addNewQueue"
          >
            Добавить очередь
          </button>
        </div>

        <div style="width: 70%" class="m-2" v-if="sortedQueueList.length > 0">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { queueAPI } from "@/api/queueAPI"
import { mapGetters } from "vuex"
import Spinner from "@/components/common/Spinner"
import QueueAddModal from "@/components/queues/QueueAddModal"
import AdminNav from "@/components/common/AdminNav"

export default {
  name: "QueueList",
  components: { AdminNav, Spinner, QueueAddModal },
  data() {
    return {
      queueList: [],
      isLoading: true,
      isError: false
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
      userToken: "auth/getToken"
    }),
    sortedQueueList() {
      return this.queueList
    }
  }
}
</script>

<style scoped></style>
