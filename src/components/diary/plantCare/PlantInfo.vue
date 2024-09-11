<template>
    <div class="plant-info">
      <h2>{{ plantName }}</h2>
      <p>종류: {{ species }}</p>
      <p>만난 날: {{ meetDate }}</p>
      <p>D + {{ daysPassed }}</p>
      <p>{{ description }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        plantName: '식물의 별명',
        species: '스투키',
        meetDate: '2022-05-01',
        daysPassed: 1220,
        description: '우리 스투키카운요... (식물 소개)'
      };
    }
  };
  </script>
  
  <style scoped>
  .plant-info {
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 8px;
  }
  </style>
  