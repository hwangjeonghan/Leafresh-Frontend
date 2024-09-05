<script setup>
import Profile from "@/components/diary/diaryProfile.vue";
import Schedule from "@/components/diary/diarySchedule.vue";
import FeedCard from "@/components/feed/feedCard.vue"
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
      <FeedCard/>
      <Card />
    </div>
    
  </div>
</template>

<style scoped>

.diary_container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}

.profile,
.schedule,
.card {
  margin: 10px 0; /* 자식 요소들 사이에 여백 추가 */
}


</style>
