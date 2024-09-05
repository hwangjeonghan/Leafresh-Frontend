<script setup>
import { ref } from 'vue';
import FeedCard from "@/components/feed/feedCard.vue";
import GardenCard from "@/components/diary/diaryCard.vue";
import Profile from "@/components/diary/diaryProfile.vue";
import Schedule from "@/components/diary/diarySchedule.vue";

// 보여줄 컴포넌트 상태 관리
const activeComponent = ref('Feed');

// 각 컴포넌트를 미리 등록
const components = {
  Feed: FeedCard,
  Garden: GardenCard,
  // Adoption: Adoption,
};
</script>

<template>
  <div class="diary_container">
    <div class="profile">
      <Profile />
    </div>
    <div class="schedule">
      <Schedule />
    </div>

    <ul class="diary_card_nav">
      <li class="nav-item">
        <a class="nav-link" :class="{ active: activeComponent === 'Feed' }" @click="activeComponent = 'Feed'">피드</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: activeComponent === 'Garden' }" @click="activeComponent = 'Garden'">반려정원</a>
      </li>
      <!-- <li class="nav-item">
        <a class="nav-link" :class="{ active: activeComponent === 'Adoption' }" @click="activeComponent = 'Adoption'">분양중</a>
      </li> -->
    </ul>

    <!-- 선택된 컴포넌트만 교체 -->
    <div class="Card">
      <component :is="components[activeComponent]" />
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
  margin: 10px 0;
}

.nav-tabs {
  border-bottom: 2px solid #eee;
  width: 100%;
  justify-content: center;
}

.nav-item {
  margin: 0 20px;
}

.nav-link {
  color: #000;
  font-weight: bold;
  font-size: 18px;
  padding-bottom: 10px;
  position: relative;
  text-align: center;
  cursor: pointer;
}

.nav-link.active {
  color: #000;
  border-bottom: 2px solid #000;
}

.nav-link:hover {
  color: #000;
  border-bottom: 2px solid #ccc;
}

.diary_card_nav {
  font-family: "GothicA1-Light";
  font-size: 16px;
  color: #000;
  display: flex;
  flex-direction: row;
}
</style>
