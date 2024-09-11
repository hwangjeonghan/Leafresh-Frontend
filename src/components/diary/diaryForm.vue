<script setup>
import PlantInfo from '@/components/diary/plantCare/PlantInfo.vue';
import PlantCal from '@/components/diary/plantCare/plantCalendar.vue';
import Checklist from '@/components/diary/plantCare/Checklist.vue';



</script>


<template>


<div class = "diary_container" >

  <div class="checkandcal-container">
    

      <div class="cal-box">
      
      <PlantCal />
      </div>

    <div class= "check-box">
        <Checklist />

    </div>

  

  </div>


    <PlantInfo />

  
</div>


    이거는 원예일지를 보여주는 페이지 
    <br>
    1.식물을 등록하면 반려정원에 등록됨 
    <br>
    2. 그 식물의 이미지를 클릭하면 그 식물의 원예일지가 나오는 거야
    <br>
    3. 여기는 그 원예일지 페이지

</template>

<style scoped>

.contianer {
  display: flex;
  padding: 20px;

}

.checkandcal-container {
  display: flex;
  flex-direction: row;
}

.cal-box {
  flex: 2;
  margin: 20px;
  width:  100%;
  height: 50%;
}

.check-box {
  flex: 1;
  margin: 20px;
  padding-top: 30px;
}



</style>