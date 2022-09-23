<template>
  <div v-if="isError" class="alert alert-danger m-0 p-3" role="alert">
    Что-то пошло не так!
  </div>
  <div v-if="isLoading">
    <Spinner />
  </div>
  <div v-else>
    <p>Queue list</p>
    <div v-if="queueList.length > 0">
      <div v-for="queue in queueList" :key="queue.id">
        <router-link
          :to="{ name: 'queue_appointments', params: { id: queue.id } }"
          class="fs-5 fw-bold"
        >
          {{ queue.queue_name }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { queueAPI } from "@/api/queueDataAPI"
import { mapGetters } from "vuex"
import Spinner from "@/components/common/Spinner"

export default {
  name: "QueueList",
  components: { Spinner },
  data() {
    return {
      queueList: [],
      isLoading: true,
      isError: false,
    }
  },
  async created() {
    try {
      const response = await queueAPI.getQueueList(
        this.userToken,
        this.userData.id
      )
      this.queueList = await response.data
      console.log(this.queueList)
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
  },
}
</script>

<style scoped></style>
