<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

// API 기본 URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const socket = new SockJS(`${API_BASE_URL}/ws/`); // WebSocket 연결
const stompClient = Stomp.over(socket); // STOMP 클라이언트

const messages = ref([]); // 메시지 배열
const newMessage = ref(''); // 새 메시지 입력 필드
const chatPartnerName = ref(''); // 채팅 상대 이름

const route = useRoute(); // 현재 라우트 정보

// WebSocket 연결 및 구독 설정
const connect = () => {
  stompClient.connect({}, (frame) => {
    console.log('Connected: ' + frame);
    // 메시지 구독
    stompClient.subscribe('/topic/messages', (message) => {
      const msg = JSON.parse(message.body);
      messages.value.push(msg);  // 메시지를 배열에 추가
    });
  }, (error) => {
    console.error('STOMP 프로토콜 오류: ', error);
  });
};

// 메시지 전송 함수
const sendMessage = () => {
  if (newMessage.value.trim()) {
    stompClient.send('/app/chat', {}, JSON.stringify({ content: newMessage.value }));
    newMessage.value = ''; // 입력 필드 초기화
  }
};

// 컴포넌트가 마운트될 때 WebSocket 연결
onMounted(() => {
  connect();
  chatPartnerName.value = route.params.chatPartnerName || '채팅 상대 이름'; // URL 파라미터에서 채팅 상대 이름 가져오기
});

// 컴포넌트가 언마운트될 때 WebSocket 연결 해제
onUnmounted(() => {
  if (stompClient.connected) {
    stompClient.disconnect();
  }
});
</script>

<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2>Chat with {{ chatPartnerName }}</h2>
    </div>
    <div class="chat-messages">
      <div v-for="message in messages" :key="message.id" class="message">
        <strong>{{ message.sender }}:</strong> {{ message.content }}
      </div>
    </div>
    <form @submit.prevent="sendMessage">
      <input v-model="newMessage" type="text" placeholder="Type your message..." required />
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f9f9f9;
}

.chat-header {
  background-color: #007bff;
  color: white;
  padding: 10px;
  text-align: center;
}

.chat-messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  border-bottom: 1px solid #ddd;
}

.message {
  margin-bottom: 10px;
}

form {
  display: flex;
  padding: 10px;
  background-color: white;
  border-top: 1px solid #ddd;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
}

button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
