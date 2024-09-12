// stores/gardenStore.js
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
        if (response.data) {
          this.plants = response.data;
        }
      } catch (error) {
        console.error('식물 목록을 가져오는 중 오류가 발생했습니다:', error);
      }
    },
  },
});
