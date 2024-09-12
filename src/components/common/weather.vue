<template>
  <!-- weatherData가 존재하고 weatherError가 없을 때만 weather-container를 보여줌 -->
  <div v-if="weatherData && !weatherError" id="app">
    <div class="weather-container">
      <div class="weather-header">
        <select v-model="selectedCity" @change="fetchWeatherData">
          <option v-for="city in cities" :key="city.name" :value="city">{{ city.name }}</option>
        </select>
      </div>

      <div class="weather-box">
        <div class="box-item-list">
          <!-- Thermometer Icon for Temperature -->
          <div class="box-item" :style="{ color: '#FF4500' }">
            <span class="material-icons">thermostat</span> {{ weatherData.T1H }} °C
          </div>
          <!-- Humidity Icon for Humidity -->
          <div class="box-item" :style="{ color: '#1E90FF' }">
            <span class="material-icons">water_drop</span> {{ weatherData.REH }}%
          </div>
          <!-- Weather Icon for Sky Status -->
          <div class="box-item" :style="{ color: getSkyColor }">
            <span class="material-icons">{{ getSkyIcon }}</span> {{ skyStatus }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref, onMounted, computed } from "vue";

import Loading from "./loading.vue";

// 주요 도시 목록과 좌표
const cities = [
  { name: "서울", nx: 60, ny: 127 },
  { name: "부산", nx: 98, ny: 76 },
  { name: "대구", nx: 89, ny: 90 },
  { name: "인천", nx: 55, ny: 124 },
  { name: "광주", nx: 58, ny: 74 },
  { name: "대전", nx: 67, ny: 100 },
  { name: "울산", nx: 102, ny: 84 },
  { name: "제주", nx: 53, ny: 38 }
];

// 상태 값 정의
const weatherData = ref(null); // 날씨 데이터를 저장할 상태
const weatherError = ref(null); // 에러 상태
const selectedCity = ref(cities[0]); // 선택된 도시 (기본값: 서울)

// .env 파일에서 API 키 불러오기
const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

// 동적으로 baseTime을 계산하는 함수
const getCurrentBaseTime = () => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();

  // 30분 단위로 baseTime을 계산
  let baseTime;
  if (minutes >= 45) {
    baseTime = hours.toString().padStart(2, '0') + '30';
  } else if (minutes >= 15) {
    baseTime = hours.toString().padStart(2, '0') + '00';
  } else {
    hours = hours === 0 ? 23 : hours - 1;
    baseTime = hours.toString().padStart(2, '0') + '30';
  }

  const baseDate = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD 형식의 오늘 날짜
  return { baseDate, baseTime };
};

// API 호출을 위한 URL 구성 함수
const getApiUrl = () => {
  const { baseDate, baseTime } = getCurrentBaseTime();
  const { nx, ny } = selectedCity.value; // 선택된 도시의 좌표
  const numOfRows = 100; // 가져올 데이터 수
  const pageNo = 1; // 페이지 번호
  const dataType = "JSON"; // 응답 데이터 형식 (JSON)

  return `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${apiKey}&numOfRows=${numOfRows}&pageNo=${pageNo}&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}&dataType=${dataType}`;
};

// API를 호출하여 날씨 정보를 가져오는 함수
const fetchWeatherData = async () => {
  try {
    const response = await fetch(getApiUrl());
    const data = await response.json();

    if (data.response && data.response.body && data.response.body.items) {
      const weatherItems = data.response.body.items.item;

      // 필요한 데이터를 찾기
      const tempItem = weatherItems.find(item => item.category === "T1H"); // 기온
      const humidityItem = weatherItems.find(item => item.category === "REH"); // 습도
      const skyItem = weatherItems.find(item => item.category === "SKY"); // 하늘 상태

      weatherData.value = {
        T1H: tempItem ? tempItem.fcstValue : "데이터 없음",
        REH: humidityItem ? humidityItem.fcstValue : "데이터 없음",
        SKY: skyItem ? skyItem.fcstValue : "데이터 없음",
      };
    } else {
      weatherError.value = "날씨 데이터 송출 실패";
    }
  } catch (error) {
    console.error(error);
    weatherError.value = "날씨 데이터 송출 실패";
  }
};

// 하늘 상태를 해석하는 함수
const skyStatus = computed(() => {
    if (weatherData.value && weatherData.value.SKY) {
      switch (weatherData.value.SKY) {
        case "1":
          return "맑음";
        case "3":
          return "구름 많음";
        case "4":
          return "흐림";
        default:
          return "알 수 없음";
      }
    }
    return "";
  });

  // 하늘 상태에 맞는 아이콘을 반환하는 함수
  const getSkyIcon = computed(() => {
    if (weatherData.value && weatherData.value.SKY) {
      switch (weatherData.value.SKY) {
        case "1":
          return "wb_sunny"; // 맑음 아이콘
        case "3":
          return "cloud"; // 구름 아이콘
        case "4":
          return "cloud_queue"; // 흐림 아이콘
        default:
          return "help"; // 알 수 없음
      }
    }
    return "";
  });

  // 하늘 상태에 맞는 색상을 반환하는 함수
const getSkyColor = computed(() => {
  if (weatherData.value && weatherData.value.SKY) {
    switch (weatherData.value.SKY) {
      case "1":
        return "#FFD700"; // 맑음 - 황금색
      case "3":
        return "#B0C4DE"; // 구름 많음 - 연한 회색-파란색
      case "4":
        return "#778899"; // 흐림 - 회색
      default:
        return "#D3D3D3"; // 알 수 없음 - 연한 회색
    }
  }
  return "#D3D3D3"; // 기본값
});


// 컴포넌트가 마운트될 때 날씨 데이터를 호출
onMounted(() => {
  fetchWeatherData();
});
</script>
  
  <style scoped>
  /* 기본 텍스트 스타일 */
  h2 {
    font-family: "GothicA1-Light";
    font-size: 16px;
    color: #fff;
  }
  
  /* 셀렉트 박스 스타일 */
  select {
    font-family: "GothicA1-Light";
    font-size: 14px;
    color: #000;
    background-color: #f0f0f0;
    border: none;
    border-radius: 10px;
    padding: 8px 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    appearance: none;
    -webkit-appearance: none; /* Safari, Chrome */
    -moz-appearance: none; /* Firefox */
    cursor: pointer;
    outline: none;
    margin-bottom: 10px;
    width: 100%; /* 전체 너비 차지 */
    transition: background-color 0.3s ease;
  }
  
  select:hover {
    background-color: #e6e6e6; /* 마우스 호버 시 배경색 변화 */
  }
  
  select:focus {
    background-color: #ddd; /* 포커스 시 배경색 변화 */
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2); /* 포커스 시 외곽선 그림자 */
  }
  
  select option {
    background-color: #fff; /* 드롭다운의 배경색 */
    color: #000; /* 드롭다운의 텍스트 색 */
    padding: 8px;
  }
  
  /* 셀렉트 박스의 아래쪽 화살표 스타일 추가 */
  .weather-header {
    position: relative;
  }
  
  .weather-header::after {
    content: "\25BC"; /* 화살표 */
    position: absolute;
    right: 10px;
    top: 45%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #999; /* 화살표 색상 */
  }
  
  .weather-container {
    display: flex;
    flex-direction: column;
    width: 250px;
    border: none;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    padding: 10px;
  }
  
  .weather-box {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
  }
  
  .box-item-list {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 5px;
  }
  
  .box-item {
    font-family: "GothicA1-Light";
    font-size: 14px;
    color: #000;
    display: flex;
    align-items: center;
  }
  
  .material-icons {
    font-size: 16px;
    margin-right: 5px;
  }
  </style>
  