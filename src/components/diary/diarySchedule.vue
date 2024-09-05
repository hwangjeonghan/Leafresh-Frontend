<script setup>
import Calender from './calender.vue';
</script>
<template>

    <div class="garden_title">
        나의 정원일정
    </div>
    

        <!-- Line 9 -->
        <div class="line_9"></div>


        <!-- 캘린더 -->

    <div class="calender_container">
        <div class="caleder_todo"> 

           <Calender />



        </div>
    </div>
     


</template>

 
<style scoped>
/* 나의 정원일정 */
.garden_title {
  width: 126px;
  height: 41px;
  left: 432px;
  top: 318px;

  font-family: 'Ghanachocolate', sans-serif; /* 폰트 패밀리 설정 */
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;

  /* 그라데이션 텍스트 색상 설정 */
  background: linear-gradient(90deg, #f7e000, #ffb800); /* 노란색 그라데이션 */
  -webkit-background-clip: text; /* 배경 클립 */
  -webkit-text-fill-color: transparent; /* 텍스트 색상 투명하게 설정 */
}

/* Line 9 */
.line_9 {
  height: 0px;
  left: 432px; /* 원래 left 속성 유지 */
  top: 360px; /* 원래 top 속성 유지 */
  border: 3px solid #F1DDC5; /* 선 색상 및 두께 */
}


.calender_container{
  display: flex;
  justify-content: center; /* 수평 중앙 정렬 */
  align-items: center;     /* 수직 중앙 정렬 */
  margin: 20px;

}


</style>