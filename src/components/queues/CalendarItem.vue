<template>
  <button type="button" class="buttons" :class="{
    activeCalendarItem: calendarItem.isActive,
    holiday: calendarItem.day_number === 6,
    today: calendarItem.day_date === new Date().toJSON().slice(0, 10)
  }" @click="$emit('getFreeAppointment', calendarItem.day_date)" :disabled=calendarItem.is_other_month>
    {{ getDayFromData(calendarItem.day_date) }}
  </button>
</template>

<script>
export default {
  name: "CalendarItem",
  props: { calendarItem: { type: Object, required: true } },
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
  background-color: #fa9275 !important;
  border-radius: 10px;
}

.holiday {
  color: #ff724c;

}

.buttons:hover:not(.holiday, :disabled) {
  background-color: #f2ddcc;
  border-radius: 10px;
  color: #333;
  /* не подсвечиваются выходные и дни других месяцев */
}
</style>