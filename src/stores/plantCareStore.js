// stores/plantCareStore.js
import { defineStore } from 'pinia';
import { useUserstore } from '@/stores/users';

export const usePlantCareStore = defineStore('plantCare', {
  state: () => ({
    water: 1,
    sunlight: 1,
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
      const token = localStorage.getItem('accessToken'); // 토큰 추가
      const data = {
        water: this.water,
        sunlight: this.sunlight,
        ventilation: this.ventilation,
        cover: this.cover,
        nutrients: this.nutrients,
        selectedDate: this.selectedDate,
        userId: userStore.userId,
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
          const result = await response.json();
          console.log(result.message);
          console.log(result.data);

          const newEvent = {
            title: `
              물주기: ${result.data.water} <br> 
              햇빛: ${result.data.sunlight} <br> 
              분갈이: ${result.data.ventilation} <br>  
              가지치기: ${result.data.cover} <br> 
              영양제: ${result.data.nutrients}
            `,
            start: result.data.selectedDate,
            end: result.data.selectedDate
          };

          // events 배열에 새로 저장된 이벤트를 추가
          this.events.push(newEvent);
          console.log('New event added:', newEvent);
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

          // 날짜가 있는 것만 가져오기
          const formattedEvents = result.data.filter(event => event.selectedDate)
            .map(event => ({
              title: `물주기: ${event.water} <br> 
                      햇빛: ${event.sunlight} <br> 
                      분갈이: ${event.ventilation} <br>  
                      가지치기: ${event.cover} <br> 
                      영양제: ${event.nutrients}`,
              start: event.selectedDate,
              end: event.selectedDate
            }));
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
          this.events = this.events.filter(event => event.start !== eventDate);
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
