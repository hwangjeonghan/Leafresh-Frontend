
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
@font-face {
  font-family: 'LeeSeoyun';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2202-2@1.0/LeeSeoyun.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

.fc {
  font-family: 'LeeSeoyun', sans-serif;
}

/* 캘린더 헤더 영역 스타일 */
.fc-header-toolbar {
  background-color: #904F00; /* 헤더 영역 배경색 */
  color: white;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
}

.fc-toolbar-title {
  font-size: 18px;
  font-weight: bold;
}

/* 월 이동 버튼과 Today 버튼 스타일 */
.fc-button, .fc-button-primary {
  background-color: white !important; /* 버튼 배경색 */
  color: #904F00 !important; /* 버튼 텍스트 색상 */
  border: none !important; /* 테두리 제거 */
  padding: 8px 12px !important; /* 버튼 패딩 */
  border-radius: 5px !important; /* 둥근 모서리 */
  font-size: 14px !important; /* 텍스트 크기 */
  cursor: pointer !important; /* 마우스 포인터 설정 */
  transition: background-color 0.3s ease, transform 0.2s ease !important; /* 애니메이션 효과 */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1) !important; /* 기본 쉐도우 효과 */
}

.fc-button:hover, .fc-button-primary:hover {
  background-color:  #F2D9BB !important; /* 호버 시 배경색 */
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2) !important; /* 호버 시 쉐도우 효과 */
}

.fc-button:active, .fc-button-primary:active {
  background-color: #3e8e41 !important; /* 클릭 시 배경색 */
  transform: scale(0.98) !important; /* 클릭 시 살짝 축소되는 효과 */
}

/* 이전/다음 버튼을 동그랗게 만들기 */
.fc-prev-button, .fc-next-button {
  background-color: white !important; /* 버튼 배경색 */
  color: #904F00 !important; /* 버튼 텍스트 색상 */
  width: 40px !important;
  height: 40px !important;
  border-radius: 50% !important; /* 동그랗게 만들기 */
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1) !important;
  
}

.fc-prev-button:hover, .fc-next-button:hover {
  background-color: #F2D9BB !important; /* 호버 시 배경색 */
}

.fc-prev-button:active, .fc-next-button:active {
  background-color: #3e8e41 !important; /* 클릭 시 배경색 */
  transform: scale(0.95) !important; /* 클릭 시 약간 줄어듦 */
}

/* 이전과 다음 버튼 사이 간격 */
.fc-prev-button {
  margin-right: 10px !important; /* 두 버튼 사이에 간격 추가 */
}


/* 날짜 셀 스타일 */
.fc-daygrid-day {
  border: 1px solid #e0e0e0;
}

.fc-daygrid-day-number {
  color: #904F00;
  font-size: 14px;
  padding: 5px;
}

/* 이벤트 스타일 */
.fc-event {
  background-color: #1C8C0B;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px;
  font-size: 12px;
}

.fc-event:hover {
  background-color: #904F00;
  cursor: pointer;
}
</style>
  