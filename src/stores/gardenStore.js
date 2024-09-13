import { defineStore } from 'pinia';
import axios from 'axios';

export const useGardenStore = defineStore('garden', {
  state: () => ({
    plants: [], // 식물 목록을 저장할 배열
  }),
  actions: {
    async fetchPlants() {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/plants`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // API 응답 데이터 구조 확인
        console.log('API 응답 데이터:', response.data);

        // 데이터가 올바르게 설정되었는지 확인
        if (Array.isArray(response.data)) {
          this.plants = response.data;
        } else {
          console.error('잘못된 데이터 구조:', response.data);
        }
      } catch (error) {
        console.error('식물 목록을 가져오는 중 오류가 발생했습니다:', error);
      }
    },
  },
});
