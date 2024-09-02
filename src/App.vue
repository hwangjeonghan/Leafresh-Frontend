<script setup>
import DefaultHeader from "@/components/common/defaultHeader.vue";
import DefaultSection from "./components/common/defaultSection.vue";
</script>

<template>
  <div class="app-container">
    <div class="sidebar">
      <DefaultHeader />
    </div>
    <div class="content">
      <DefaultSection />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
}
.sidebar {
  width: 320px;
}
.content {
  flex: 1;
}
</style>
