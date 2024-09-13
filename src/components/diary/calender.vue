<script setup>
import { ref, onMounted } from 'vue';

//date를 ref 를 만들어서 화면에 표시할 수 있도록 함. 
//new Date 는 사용자의 시스템에 설정된 현재 날짜와 시간을 기반으로 표기
const date = ref(new Date()); 

// 화살표에 따라서 날짜들이 바껴야 하니까
const formattedDates = ref([]);
const yearMonth = ref([]);

const renderYearMonth = ()=>{
  return `${date.value.getFullYear()}년 ${date.value.getMonth() + 1}월`;
}


const renderCalendar = () => {
  const viewYear = date.value.getFullYear();
  const viewMonth = date.value.getMonth();
  const prevLast = new Date(viewYear, viewMonth, 0);
  const thisLast = new Date(viewYear, viewMonth + 1, 0);

  yearMonth.value = renderYearMonth();

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

    // 오늘 날짜인지 확인하는 로직.
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


onMounted(renderCalendar);

</script>

<template>
  <section class="calender_container">
    <div class="calender_header">
        
        <div clas="heaer_column1">
          <div class="button_space"></div>
          <div class="button-container">
            <button class="nav-btn go-prev" @click="prevMonth">&lt;</button>
            <button class="nav-btn go-next" @click="nextMonth">&gt;</button>
          </div>
        </div>

        <div class="heaer_column2">
          <div class="year-month_space" ></div>
   
          <div class="year-month">{{ yearMonth }}</div>
        
        </div>
  
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
    </div>
      
      

    <!-- 날짜클릭 이벤트 추가 -->

      <div class="dates">
        <div
          v-for="(date, index) in formattedDates"
          :key="index"
          :class="['date', date.class, { today: date.isToday }]"
          
          @click="emitDateClick(date.day)"
        > 
          <!-- <span>{{ date.day }}</span> -->

          <span :class="{ other: date.class === 'other' }">{{ date.day }}</span>


        </div>
      </div>
   
  </section>


</template>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');

.calender_container {
  background: rgba(242, 217, 187, 0.8); /* #F2D9BB 색상에 투명도 80% 적용 */
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
  padding: 30px;
  display: flex;
  flex-direction: column;
}


.calender_header{
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 5px;
  flex-direction: column;

}

.header_column1 {
  flex: 1;
}
.header_column2 {
  flex: 1;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  align-items: center; /* 버튼을 수직 중앙 정렬 */
  gap: 10px; /* 버튼 간의 간격 */
}

.nav-btn {
  width: 20px; /* 버튼 너비 */
  height: 20px; /* 버튼 높이 */
  background-color: #F7F8FC; /* 버튼 배경색 */
  color: rgba(242, 217, 187, 0.8); 
  border: none;
  border-radius: 50%; /* 원형 버튼 */
  font-size: 20px; /* 텍스트 크기 */
  display: flex; /* 텍스트를 중앙 정렬하기 위해 flex 사용 */
  justify-content: center;
  align-items: center;
  cursor: pointer; /* 클릭 시 포인터 커서 */
  transition: background-color 0.3s, transform 0.2s; /* 부드러운 호버 효과 */
}

.nav-btn:hover {
  background-color: #904F00; /* 호버 시 배경색 변화 */
  transform: scale(1.1); /* 호버 시 버튼 확대 */
}

.nav-btn:focus {
  outline: none; /* 포커스 시 기본 윤곽선 제거 */
}



.button_space, .year-month_space {
  flex: 1;
}


.year-month {
  align-self: flex-start;
  font-family: 'Lato', sans-serif;
  font-size: 1.0em;
  margin-left: 20px;
  margin-bottom: 10px;
  color: #000;
 
}


.main {
border-radius: 10px;
margin-left: 10px;
}

.days {
  display: grid;
  font-family: 'Nunito', sans-serif;
  color: #904F00;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: bold;
  padding-bottom: 10px;
} 


.dates {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-family: 'Nunito', sans-serif;

}

.date span {
    display: inline-block;
    width: 30px;  /* 모든 날짜의 크기를 동일하게 설정 */
    height: 30px; /* 모든 날짜의 크기를 동일하게 설정 */
    line-height: 30px; /* 텍스트를 중앙에 수직으로 배치 */
    text-align: center; /* 텍스트를 중앙에 수평으로 배치 */
    border-radius: 50%; /* 원형 모양을 위한 설정 */
    padding: 10px;
    border-radius: 5px;
}


.date.today span {
    color: white;
    background-color: #1C8C0B;
    border: 2px solid #1C8C0B;
    border-radius: 50%;
    padding: 3px 7px 7px 5px; /* 상, 우, 하, 좌 */
    margin-top: 5px;
    display: inline-block;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 25px;
}



/* 해당월이 아닌 날짜들을 다른 색으로 처리 */
span.other{
  color: #B0B3B7;
}

</style>

