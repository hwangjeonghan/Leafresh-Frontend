<script setup>
import { ref, computed, onMounted } from 'vue';

const date = ref(new Date());

const yearMonth = computed(() => {
  return `${date.value.getFullYear()}년 ${date.value.getMonth() + 1}월`;
});

const formattedDates = ref([]);

const renderCalendar = () => {
  const viewYear = date.value.getFullYear();
  const viewMonth = date.value.getMonth();

  const prevLast = new Date(viewYear, viewMonth, 0);
  const thisLast = new Date(viewYear, viewMonth + 1, 0);

  const PLDate = prevLast.getDate();
  const PLDay = prevLast.getDay();

  const TLDate = thisLast.getDate();
  const TLDay = thisLast.getDay();

  const prevDates = [];
  const thisDates = [...Array(TLDate + 1).keys()].slice(1);
  const nextDates = [];

  if (PLDay !== 6) {
    for (let i = 0; i <= PLDay; i++) {
      prevDates.unshift(PLDate - i);
    }
  }
  for (let i = 1; i < 7 - TLDay; i++) {
    nextDates.push(i);
  }

  const dates = prevDates.concat(thisDates, nextDates);

  const firstDateIndex = dates.indexOf(1);
  const lastDateIndex = dates.lastIndexOf(TLDate);

  formattedDates.value = dates.map((day, i) => {
    const isThisMonth = i >= firstDateIndex && i <= lastDateIndex;
    const isToday =
      isThisMonth &&
      date.value.getFullYear() === new Date().getFullYear() &&
      date.value.getMonth() === new Date().getMonth() &&
      day === new Date().getDate();
    return {
      day,
      class: isThisMonth ? 'this' : 'other',
      isToday,
    };
  });
};

const prevMonth = () => {
  date.value.setMonth(date.value.getMonth() - 1);
  renderCalendar();
};

const nextMonth = () => {
  date.value.setMonth(date.value.getMonth() + 1);
  renderCalendar();
};

const goToday = () => {
  date.value = new Date();
  renderCalendar();
};

onMounted(renderCalendar);
</script>


<template>
  <section class="cal">
    <div class="header">
      <button class="nav-btn go-prev" @click="prevMonth">&lt;</button>
      <div class="year-month">{{ yearMonth }}</div>
      <button class="nav-btn go-next" @click="nextMonth">&gt;</button>
      <button class="nav-btn go-today" @click="goToday">Today</button>
    </div>
    <div class="main">
      <div class="days">
        <div class="day">SUN</div>
        <div class="day">MON</div>
        <div class="day">TUE</div>
        <div class="day">WED</div>
        <div class="day">THU</div>
        <div class="day">FRI</div>
        <div class="day">SAT</div>
      </div>
      <div class="dates">
        <div
          v-for="(date, index) in formattedDates"
          :key="index"
          class="date"
          :class="{ today: date.isToday }"
        >
          <span :class="date.class">{{ date.day }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cal {
  background: linear-gradient(180deg, #FFFFFF 0%, #F1F1F1 100%);
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.main {
  background: #FFF;
  border-radius: 10px;
  padding: 10px;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: bold;
  padding-bottom: 10px;
}

.dates {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
}

.date {
  padding: 10px;
  border-radius: 5px;
}

.date.today {
  background-color: #FFDD57;
}

.date.this {
  color: #000;
}

.date.other {
  color: #CCC;
}
</style>