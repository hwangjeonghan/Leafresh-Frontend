
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


    // 이벤트 클릭 시 호출되는 함수
    eventClick: async function (info) {

      if(confirm('이 기록을 삭제하겠습니까? ')){
        // 서버에서 이벤트를 삭제하고 캘린더에서 제거.
        const evnetDate = info.event.startStr; // 선택한 이벤트의 날짜
        // 서버에 비동기 요청으로 이벤트 삭제
        await plantCareStore.deleteEvent(evnetDate);
        // 삭제 성공 시 캘린더에 이벤트 삭제
        info.event.remove();
 
      }
    },

    // 이벤트 콘텐츠를 HTML로 렌더링
    eventContent: function (arg) {
      const deleteButton = `<button class="event-delete-btn">x</button>`;
      const eventTitle = `<div class="event-title">${arg.event.title}</div>`

      return { html: `${deleteButton}${eventTitle}` }; // 이벤트 제목을 HTML로 렌더링
  }

});

onMounted(()=> {
  plantCareStore.fetchPlantCareEvents();
});


// x 버튼 클릭 처리
const handleDeleteClick = (e) => {
  if (e.target.classList.contains('event-delete-btn')) {
    const eventEl = e.target.closest('.fc-event');  // 이벤트 엘리먼트 찾기
    const eventId = eventEl.getAttribute('data-event-id');  // 이벤트 ID나 날짜 등을 통해 식별

    if (eventId && confirm('정말로 이 이벤트를 삭제하시겠습니까?')) {
      plantCareStore.deleteEvent(eventId);
    }
  }
};

// 전체 문서에서 이벤트 삭제 버튼 클릭 시 처리
document.addEventListener('click', handleDeleteClick);

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

a {
  text-decoration: none;
  color: #000;
}

.fc {
  font-family: 'LeeSeoyun', sans-serif;
  max-width: 800px; /* 원하는 최대 너비로 고정 */
  max-height: 700px; /* 원하는 최대 높이로 고정 */
  margin: 0 auto; /* 중앙 정렬 */
  overflow: auto; /* 내용이 넘칠 경우 스크롤 */
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


/* 요일 셀 스타일 */
.fc-col-header-cell {
  padding: 15px !important; /* 요일 셀 패딩 */
  font-size: 20px !important; /* 요일 폰트 크기 */
  background-color: #F2D9BB; /* 요일 셀 배경색 */
  border: none !important; /* 요일 셀 밑줄 제거 */
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
  background-color: white;
  color: #904F00;
  border: none;
  border-radius: 4px;
  padding: 5px;
  font-size: 12px;
  display: flex;
  justify-content: space-between; /* x 버튼과 텍스트를 양쪽에 배치 */
  align-items: center;
}

.event-title {
  color: #000;
  font-size: 15px !important; /* 폰트 크기를 16px로 설정 */
  font-weight: bold;          /* 글씨를 굵게 설정 */
  line-height: 1.0;           /* 줄 간격을 조정 */
}

.event-delete-btn {
  background: transparent;
  border: none;
  color: black;
  font-size: 14px;
  cursor: pointer;
  margin-left: 80px;

}

.event-delete-btn:hover {
  color: red;
}

.fc-event:hover {
  background-color: #F2D9BB;
  cursor: pointer;
}
</style>
  