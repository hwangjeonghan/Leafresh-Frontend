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

        <PlantInfo />

     

    </div>

  

  </div>


 
  
</div>

</template>

<style scoped>

.contianer {
  display: flex;
  padding: 20px;

}

.checkandcal-container {
  display: flex;
  flex-direction: row;
  width: auto;
}

.cal-box {
  flex: 2;
  margin: 10px;
}

.check-box {
  flex: 1;
  margin: 20px;
  padding-top: 30px;
}




</style>