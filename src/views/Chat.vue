<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2>Chat with {{ chatPartnerName }}</h2>
    </div>
    <div class="chat-messages">
      <div v-for="message in messages" :key="message.id" class="message">
        <div v-if="message.senderId === currentUserId">
          You: {{ message.content }}
        </div>
        <div v-else>{{ chatPartnerName }}: {{ message.content }}</div>
      </div>
    </div>

    <form @submit.prevent="sendMessage">
      <input
        v-model="newMessage"
        type="text"
        placeholder="Type your message..."
        required
      />
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import Stomp from "stompjs";
import SockJS from "sockjs-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const socket = new SockJS(`${API_BASE_URL}/ws`); // WebSocket 연결
const stompClient = Stomp.over(socket); // STOMP 클라이언트

const messages = ref([]); // 메시지 배열
const newMessage = ref(""); // 새 메시지 입력 필드
const chatPartnerName = ref(""); // 채팅 상대 이름
const route = useRoute(); // 현재 라우트 정보
const roomId = ref(route.params.roomId); // 현재 채팅방 ID

const currentUserId = 1; // 현재 로그인한 사용자 ID를 실제로 가져와야 함
const recipientUserId = 2; // 채팅 상대의 사용자 ID를 실제로 가져와야 함

// WebSocket 연결 및 구독 설정
const connect = () => {
  stompClient.connect({}, (frame) => {
    console.log('Connected: ' + frame);

    // roomId가 없는 경우를 처리하기 위해 validRoomId 설정
    const validRoomId = roomId.value ? roomId.value : "defaultRoomId";

    // 메시지 구독 경로에 roomId 사용
    stompClient.subscribe(`/topic/messages/${validRoomId}`, (message) => {
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
    // roomId가 없는 경우 "defaultRoomId"로 설정
    const validRoomId = roomId.value ? roomId.value : "defaultRoomId"; 

    const messageToSend = {
      senderId: currentUserId,    // 보낸 사람 ID
      recipientId: recipientUserId,  // 받는 사람 ID
      content: newMessage.value,  // 메시지 내용
    };

      // 실제 전송되는 데이터를 콘솔에 출력
      console.log("전송되는 메시지:", JSON.stringify(messageToSend));

    // WebSocket을 통해 메시지 전송
    stompClient.send(
      `/app/chat`, // 엔드포인트 수정
      {},
      JSON.stringify(messageToSend)
    );

    // 전송된 메시지를 messages 배열에 추가 (자신이 보낸 메시지에 대한 로컬 반영)
    messages.value.push({
      senderId: currentUserId,
      content: newMessage.value,
    });

    newMessage.value = ""; // 입력 필드 초기화
  }
};

// 컴포넌트가 마운트될 때 WebSocket 연결
onMounted(() => {
  chatPartnerName.value = route.params.chatPartnerName || "채팅 상대 이름"; // URL 파라미터에서 채팅 상대 이름 가져오기
  connect();  // 컴포넌트가 마운트된 후에 connect 호출
});

// 컴포넌트가 언마운트될 때 WebSocket 연결 해제
onUnmounted(() => {
  if (stompClient.connected) {
    stompClient.disconnect();
    console.log("WebSocket disconnected");
  }
});
</script>

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
