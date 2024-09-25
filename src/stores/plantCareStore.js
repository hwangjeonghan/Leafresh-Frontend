// stores/plantCareStore.js
import { defineStore } from 'pinia';
import { useUserstore } from '@/stores/users';
import { useGardenStore } from '@/stores/gardenStore.js';

export const usePlantCareStore = defineStore('plantCare', {
  state: () => ({
    water: 0,
    sunlight: 0,
    ventilation: false,
    cover: false,
    nutrients: false,
    selectedDate: null,
    events: []  // 이벤트를 저장할 배열
  }),
  actions: {
    // 데이터를 저장
    async savePlantCare() {
      const userStore = useUserstore();
      const userGarden = useGardenStore();

      const token = localStorage.getItem('accessToken'); // 토큰 추가
      const data = {
        water: this.water,
        sunlight: this.sunlight,
        ventilation: this.ventilation,
        cover: this.cover,
        nutrients: this.nutrients,
        selectedDate: this.selectedDate,
        userId: userStore.userId,
        plantId: userGarden.plantId
      };

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/garden-diary/plant-care/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // 토큰 추가
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          await this.fetchPlantCareEvents();
          alert('저장 완료! & 달력에 바로 나오쥬?');
        } else {
          const errorData = await response.json(); // 서버로부터 받은 오류 메시지를 받아옴.
          if(errorData.error) {
            // 백엔드에서 받은 오류 메세지 처리
            alert(errorData.error);
          }else{
            console.error('Error:', response.statusText);
            alert('데이터 저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
            
          }

        }
      } catch (error) {
        console.error('Fetch Error:', error);
        alert('서버와의 통신 중 오류가 발생했습니다.');
      }
    },

    // 서버에 저장된 데이터를 가져오기
    async fetchPlantCareEvents() {
      const userStore = useUserstore();
      const token = localStorage.getItem('accessToken'); // 토큰 추가
      const userId = userStore.userId;
      console.log(`Fetching events for user: ${userId}`);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/garden-diary/plant-care/events?userId=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // 토큰 추가
          },
        });

        if (response.ok) {
          const result = await response.json();

            // 물주기 아이콘 추가
            const waterIcon = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.275 19C12.475 18.9833 12.646 18.904 12.788 18.762C12.93 18.62 13.0007 18.4493 13 18.25C13 18.0167 12.925 17.8293 12.775 17.688C12.625 17.5467 12.4333 17.484 12.2 17.5C11.5167 17.55 10.7917 17.3627 10.025 16.938C9.25833 16.5133 8.775 15.7423 8.575 14.625C8.54167 14.4417 8.45433 14.2917 8.313 14.175C8.17167 14.0583 8.009 14 7.825 14C7.59167 14 7.4 14.0877 7.25 14.263C7.1 14.4383 7.05 14.6423 7.1 14.875C7.38333 16.3917 8.05 17.475 9.1 18.125C10.15 18.775 11.2083 19.0667 12.275 19ZM12 22C9.71667 22 7.81267 21.2167 6.288 19.65C4.76333 18.0833 4.00067 16.1333 4 13.8C4 12.1333 4.66267 10.321 5.988 8.363C7.31333 6.405 9.31733 4.284 12 2C14.6833 4.28333 16.6877 6.40433 18.013 8.363C19.3383 10.3217 20.0007 12.134 20 13.8C20 16.1333 19.2377 18.0833 17.713 19.65C16.1883 21.2167 14.284 22 12 22Z" fill="#3B7FFD"/>
            </svg>`;

            const sunlightIcon = `
              <svg width="15" height="15" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 17.1109C14.3751 17.1109 17.1111 14.3749 17.1111 10.9998C17.1111 7.62471 14.3751 4.88867 11 4.88867C7.62495 4.88867 4.88892 7.62471 4.88892 10.9998C4.88892 14.3749 7.62495 17.1109 11 17.1109Z" fill="#FFA829"/>
              </svg>
            `;

            const ventilationIcon = `
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.1 1.80957L12.27 4.63957C11.5 5.41957 11.5 6.68957 12.27 7.46957L13.68 8.87957L9.13001 13.4296L6.31001 10.5996L4.89001 11.9996C-0.0599859 16.9996 3.50001 20.4996 3.50001 20.4996C3.50001 20.4996 7.00001 23.9996 12 19.0896L13.41 17.6796L10.61 14.8796L15.15 10.3396L16.54 11.7296C17.32 12.4996 18.59 12.4996 19.37 11.7296L22.2 8.89957L15.1 1.80957Z" fill="#F24E1E"/>
              </svg>
            `;

            const coverIcon = `
              <svg width="12" height="12" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.1014 3.669C14.3706 3.28432 14.476 2.80848 14.3945 2.3461C14.3129 1.88372 14.0511 1.47266 13.6665 1.20329L13.3761 1L9.73102 6.20625L6.08523 1L5.79482 1.20329C5.41037 1.47277 5.14867 1.88388 5.06724 2.34625C4.98582 2.80862 5.09134 3.28441 5.36061 3.669L8.43406 8.05854L7.15907 9.87896C6.44298 9.64979 5.66893 9.68113 4.97371 9.96743C4.2785 10.2537 3.70686 10.7766 3.35984 11.4436C3.01281 12.1106 2.91273 12.8787 3.07728 13.6124C3.24183 14.346 3.66042 14.9979 4.25907 15.4528C4.85772 15.9076 5.5979 16.1362 6.34881 16.0982C7.09971 16.0602 7.81299 15.7579 8.3626 15.2448C8.91221 14.7318 9.26276 14.0409 9.35231 13.2944C9.44187 12.5479 9.26465 11.7938 8.85198 11.1653L9.73032 9.91154L10.6086 11.1639C10.1957 11.7921 10.018 12.5461 10.1071 13.2927C10.1962 14.0392 10.5464 14.7302 11.0956 15.2436C11.6449 15.7569 12.358 16.0596 13.1088 16.0981C13.8597 16.1367 14.6 15.9086 15.1989 15.4541C15.7978 14.9996 16.2168 14.3481 16.3819 13.6146C16.547 12.8811 16.4474 12.1129 16.1009 11.4457C15.7544 10.7785 15.1831 10.2552 14.4882 9.9684C13.7932 9.68158 13.0192 9.64965 12.303 9.87825L11.028 8.05854L14.1014 3.669Z" fill="#1C8C0B"/>
              </svg>
            `;
            const nutrientsIcon = `
            <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_335_200)">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M7 4.5C7 3.30653 7.47411 2.16193 8.31802 1.31802C9.16193 0.474106 10.3065 0 11.5 0L15 0V3.5C15 4.69347 14.5259 5.83807 13.682 6.68198C12.8381 7.52589 11.6935 8 10.5 8H8V15H7V11H4.5C3.30653 11 2.16193 10.5259 1.31802 9.68198C0.474106 8.83807 0 7.69347 0 6.5L0 3H3.5C4.914 3 6.175 3.652 7 4.671V4.5ZM8.146 6.146L11.146 3.146L11.854 3.854L8.854 6.854L8.146 6.146ZM6.146 9.854L3.146 6.854L3.854 6.146L6.854 9.146L6.146 9.854Z" fill="#AFA929"/>
              </g>
              <defs>
              <clipPath id="clip0_335_200">
              <rect width="15" height="15" fill="white"/>
              </clipPath>
              </defs>
              </svg>           
            `;
        
                 // 날짜가 있는 것만 가져오기 및 필터링
      const formattedEvents = result.data.filter(event => event.selectedDate)
      .map(event => {
        let title = '';
        if (event.water > 0) {
          title += `${waterIcon} ${event.water} <br>`;
        }
        if (event.sunlight > 0) {
          title += `${sunlightIcon} ${event.sunlight} <br>`;
        }
        if (event.ventilation) {
          title += `${ventilationIcon} ㅇ <br>`;
        }
        if (event.cover) {
          title += `${coverIcon} ㅇ <br>`;
        }
        if (event.nutrients) {
          title += `${nutrientsIcon} ㅇ <br>`;
        }

        return {
          title: title.trim(),
          start: event.selectedDate,
          end: event.selectedDate
        };
      });

    this.events = formattedEvents;

    console.log('Fetched events', this.events);

        } else {
          console.error('Error fetching events:', response.statusText);
          alert('이벤트를 가져오는 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
      } catch (error) {
        console.error('Fetch Error', error);
        alert('서버와의 통신 중 오류가 발생했습니다.');
      }
    },

    async deleteEvent(eventDate) {
      const userStore = useUserstore();
      const token = localStorage.getItem('accessToken');
      const userId = userStore.userId;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/garden-diary/plant-care/delete?userId=${userId}&eventDate=${eventDate}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        if (response.ok) {
          // 성공하면 프론트엔드에서도 삭제
          await this.fetchPlantCareEvents(); 
          alert('이벤트가 성공적으로 삭제되었습니다.');
        } else {
          const errorData = await response.json();
          console.error('Error deleting event:', errorData.error);
          alert('이벤트 삭제 중 오류가 발생했습니다.');
        }
      } catch (error) {
        console.error('Fetch Error', error);
        alert('서버와의 통신 중 오류가 발생했습니다.');
      }
    }


  }
});
