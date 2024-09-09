<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2>채팅방</h2>
      <button @click="closeChat">X</button>
    </div>
    <div class="chat-messages">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="chat-message"
        :class="{ 'sent': msg.senderId === userStore.userId, 'received': msg.senderId !== userStore.userId }"
      >
        <strong>{{ msg.name }}:</strong> {{ msg.message }}
      </div>
    </div>
    <div class="chat-input">
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="메시지를 입력하세요..." />
      <button @click="sendMessage">전송</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useUserstore } from '@/stores/users'; // 사용자 스토어 가져오기
import { Client } from '@stomp/stompjs';

const route = useRoute();
const userStore = useUserstore(); // 사용자 스토어 인스턴스
const messages = ref([]);
const newMessage = ref("");
const client = ref(null);
const chatRoomId = ref(route.params.id);

const connection = () => {
  client.value = new Client({
    brokerURL: 'ws://localhost:8080/ws', // WebSocket URL
    onConnect: () => {
      console.log('STOMP 연결 성공');
      client.value.subscribe(`/sub/chatroom/${chatRoomId.value}`, (message) => {
        messages.value.push(JSON.parse(message.body));
      });
    },
    onStompError: (frame) => {
      console.error('STOMP 오류:', frame.headers['message']);
    }
  });

  client.value.activate();
}

const sendMessage = () => {
  console.log('User ID:', userStore.userId.value);
  console.log('User Name:', userStore.userName.value);

  if (newMessage.value) {
    const messagePayload = {
      id: userStore.userId,
      name: userStore.userName,
      message: newMessage.value,
      chatRoomId: chatRoomId.value,
      senderId: userStore.userId
    };
    console.log("전송할 메시지: ", messagePayload);
    client.value.publish({
      destination: '/pub/message',
      body: JSON.stringify(messagePayload)
    });
    newMessage.value = "";
  } else {
    console.log("메시지를 입력해주세요.");
  }
}

const closeChat = () => {
  client.value.deactivate(); // WebSocket 연결 종료
}

onMounted(async () => {
  await userStore.fetchUserProfile(); // 사용자 정보 로드
  connection();
});

onUnmounted(() => {
  if (client.value) {
    client.value.deactivate();
  }
});

watch(() => route.params.id, (newId) => {
  chatRoomId.value = newId;
  console.log('Updated chat room ID:', chatRoomId.value);
  // WebSocket 재연결 필요 시 처리
});
</script>

<style scoped>
.chat-container {
  width: 100%;
  max-width: 600px;
  margin: auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.chat-header {
  background-color: #f1f1f1;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
}

.chat-messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.chat-message {
  margin-bottom: 10px;
  padding: 5px 10px;
  border-radius: 5px;
  max-width: 80%;
}

.chat-message.sent {
  align-self: flex-end;
  background-color: #d1e7dd;
  text-align: right;
}

.chat-message.received {
  align-self: flex-start;
  background-color: #f8d7da;
  text-align: left;
}

.chat-input {
  padding: 10px;
  border-top: 1px solid #ddd;
  display: flex;
}

.chat-input input {
  flex: 1;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.chat-input button {
  margin-left: 10px;
  padding: 5px 10px;
  border: none;
  background-color: #007bff;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.chat-input button:hover {
  background-color: #0056b3;
}

.chat-header button {
  background-color: transparent;
  border: none;
  font-size: 16px;
  cursor: pointer;
}
</style>
