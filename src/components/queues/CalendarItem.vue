<template>
  <button
    type="button"
    class="buttons"
    :class="{
    activeCalendarItem: calendarItem.isActive,
    holiday: calendarItem.day_number === 6,
    today: calendarItem.day_date === new Date().toJSON().slice(0, 10)
  }"
    @click="$emit('getFreeAppointment', calendarItem.day_date)"
    :disabled = calendarItem.is_other_month
  >
    {{ getDayFromData(calendarItem.day_date) }}
  </button>
</template>

<script>
export default {
  name: "CalendarItem",
  props: {calendarItem : { type: Object, required: true }},
  methods: {
    getDayFromData(dayDate) {
      return new Date(dayDate).toLocaleDateString([], { day: "2-digit" })
    },
  }
}
</script>

<style scoped>
.buttons {
  border: 0;
  background-color: #fff;
}

.today {
  background-color: #8ebba7;
  border-radius: 10px;
}

.activeCalendarItem {
  background-color: #dc3545!important;
}
.holiday {
  color: #ff724c;

}

</style>