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

    //이벤트를 저장할 배열
    events: []


  }),
  actions: {

    // 데이터를 저장해요
    async savePlantCare() {
      const userStore = useUserstore();
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
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const result = await response.json();
          console.log(result.message);  // "Plant care saved" 출력
          console.log(result.data);     // 저장된 데이터 출력

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
          alert('저장 완료! & 달력에 나와야해! 바로! ');

        } else {
          console.error('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Fetch Error:', error);
      }
    },
    // 서버에 저장된 데이터를 가져온다.
    async fetchPlantCareEvents() {
      const userStore = useUserstore();
      const userId = userStore.userId;
      console.log(`Fetching events for user: ${userId}`);

      try {
      
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/garden-diary/plant-care/events?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',

          },
        });
        console.log(`${import.meta.env.VITE_API_BASE_URL}/garden-diary/plant-care/events?userId=${userId}`);
        if(response.ok){
          const result = await response.json();
          
          // 날짜가 있는 것만 가져옴! 
          const formattedEvents = result.data.filter(event => event.selectedDate)
          .map(event => ({
            title: `물주기: ${event.water} <br> 
                    햇빛 : ${event.sunlight} <br> 
                    분갈이: ${event.ventilation} <br>  
                    가지치기: ${event.cover} <br> 
                    영양제: ${event.nutrients}`,
            start: event.selectedDate,
            end:event.selectedDate
          }));
          this.events = formattedEvents;
          
          console.log('피니아 확인중', this.events);
          

          console.log('Fetched events', this.events);
    
        }else{
          console.log('Error fetching events:', response.statusText);
          
        }
      
                                                                                                                                                                               
      } catch(error) {
        console.error('Fetch Error', error);
      }
    }

  }
});
