<script setup>
import Profile from "@/components/diary/diaryProfile.vue";
import Schedule from "@/components/diary/diarySchedule.vue";
import Card from "@/components/diary/diaryCard.vue";


</script>


<template>
  <div class="diary_container">


    
  <div class="profile">
    <Profile />
  </div>

  <div class="schedule">

    <Schedule />

  </div>
  

  <div class="Card">
    <Card />
  </div>
   

  </div>
</template>

<style scoped>
.diary_container {
  width: 100%;
  height: 100%;
  background-color: #f2d9bb;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}


</style>
