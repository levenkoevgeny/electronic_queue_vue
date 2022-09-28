<template>Queue registration</template>

<script>
import { queueAPI } from "@/api/queueAPI"
import { mapGetters } from "vuex"
export default {
  name: "QueueRegistration",
  data() {
    return {
      calendar: null,
      isLoading: true,
      isError: false,
    }
  },
  methods: {},
  async created() {
    try {
      const response = await queueAPI.getCalendar(this.userToken)
      this.calendar = await response.data
    } catch (e) {
    } finally {
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
