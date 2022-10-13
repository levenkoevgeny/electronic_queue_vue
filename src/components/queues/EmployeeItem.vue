<template>
  <div class="mb-3">
    <div class="card" :class="{activeEmployee: employee.isActive}" @click="$emit('setSelectedEmployee', employee.id)">
      <img v-if="employee.photo" :src="getPhotoURL(employee.photo)" alt="photo" style="padding: 0" />
      <img src="@/assets/214-2143742_individuals-whatsapp-profile-picture-icon.png" alt="photo" v-else />
      <div class="column">
        <h5>{{ employee.last_name }}</h5>
        <h5>{{ employee.first_name }}</h5>
        <h5>{{ employee.patronymic }}</h5>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EmployeeItem",
  props: {
    employee: { type: Object, required: true }
  },
  methods: {
    getPhotoURL(url) {
      return `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}${url}`
    }
  }
}
</script>

<style scoped>
.card {
  background-color: #fff;
  border-radius: 20px;
  display: flex;
  flex-direction: row;
  justify-content: baseline;
  padding: 10px 20px 10px 20px;
  margin: 10px 5px;
}

.card img {
  width: 100px;
  height: 100px;
  background-color: rgb(197, 193, 193);
  border-radius: 50%;
  padding: 10px;
}

.column {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  background-position: left;
  background-repeat: no-repeat;
  background-size: 20%;
}

.activeEmployee {
  background-color: #e74d5c;
}
</style>