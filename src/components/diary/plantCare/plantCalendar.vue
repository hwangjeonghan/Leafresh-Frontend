
<script setup>
import { reactive, computed, onMounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { usePlantCareStore } from '@/stores/plantCareStore'

// Pinia 어서오고
const plantCareStore = usePlantCareStore();



const calendarOptions = reactive({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  events: computed(()=> plantCareStore.events),

    // 이벤트 콘텐츠를 HTML로 렌더링
    eventContent: function (arg) {
    return { html: arg.event.title };  // 이벤트 제목을 HTML로 렌더링
  }

});

onMounted(()=> {
  plantCareStore.fetchPlantCareEvents();
  console.log('Events after fetch:', plantCareStore.events);
});

</script>

<template>
 <FullCalendar :options="calendarOptions" />
</template>

<style>
</style>
  