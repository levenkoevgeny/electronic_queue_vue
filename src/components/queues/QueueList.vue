<template>
  <p>Queue list</p>
</template>

<script>
export default {
  name: "QueueList",
  data() {
    return {
      queueList: [],
      isLoading: true,
      isError: false,
    }
  },
  async created() {
    try {
      const response = await queueDataAPI.getTestList(
          this.userToken,
          this.userData.id
      )
      this.testList = await response.data
    } catch (e) {
      this.isError = true
    } finally {
      this.isLoading = false
    }
  },

}

</script>

<style scoped>

</style>