<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2>채팅방</h2>
      <button @click="$emit('close')">X</button> <!-- 모달 닫기 -->
    </div>
    <div class="chat-messages" ref="chatMessages">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="chat-message-wrapper"
        :class="{ 'sent': msg.senderId === userStore.userId, 'received': msg.senderId !== userStore.userId }"
      >
      <div v-if="msg.senderId !== userStore.userId" class="profile-picture">
        <img :src="userStore.imageUrl" alt="프로필 사진" />
      </div>
        <div class="chat-message">
          <strong v-if="msg.senderId !== userStore.userId" class="sender-name">{{ msg.name }}</strong>
          <p>{{ msg.message }}</p>
        </div>
      </div>
    </div>
    <div class="chat-input">
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="메시지를 입력하세요..." />
      <button @click="sendMessage">전송</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useUserstore } from '@/stores/users'; // 사용자 스토어 가져오기
import { Client } from '@stomp/stompjs';

const route = useRoute();
const userStore = useUserstore(); // 사용자 스토어 인스턴스
const messages = ref([]);
const newMessage = ref("");
const client = ref(null);
const chatRoomId = ref(route.params.id);
const chatMessages = ref(null); // 채팅 메시지 컨테이너 참조
const roomId = ref(null); // roomid를 받아옴

const loadMessages = () => {
  const savedMessages = JSON.parse(localStorage.getItem(`messages_${chatRoomId.value}`)) || [];
  messages.value = savedMessages;
}

const saveMessages = () => {
  localStorage.setItem(`messages_${chatRoomId.value}`, JSON.stringify(messages.value));
}

const connection = () => {
  client.value = new Client({
    brokerURL: 'wss://api.leafresh.shop/ws', // WebSocket URL
    onConnect: () => {
      console.log('STOMP 연결 성공');
      client.value.subscribe(`/sub/chatroom/${chatRoomId.value}`, (message) => {
        const newMessage = JSON.parse(message.body);
        messages.value.push(newMessage);
        saveMessages(); // 로컬 저장소에 메시지 저장
        nextTick(() => {
          scrollToBottom(); // 메시지가 추가된 후 스크롤을 맨 아래로
        });
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
  saveMessages(); // 채팅방 나가기 전에 메시지 저장
  client.value.deactivate(); // WebSocket 연결 종료
}

const scrollToBottom = () => {
  if (chatMessages.value) {
    chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
  }
}

onMounted(async () => {
  await userStore.fetchUserProfile(); // 사용자 정보 로드
  loadMessages(); // 현재 채팅방 메시지 불러오기
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
  loadMessages(); // 새 채팅방 메시지 불러오기
  nextTick(() => {
    scrollToBottom(); // 새로운 채팅방으로 이동 후 스크롤을 맨 아래로
  });
});
</script>




<style scoped>
.chat-container {
  width: 100%;
  max-width: 450px;
  height: 80vh;
  margin: auto;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #f0f0f0; /* 연한 회색 배경 */
}

.chat-header {
  background-color: #5E9C06; /* 카카오톡 스타일의 짙은 녹색 */
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
}

.chat-header button {
  background-color: transparent;
  border: none;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  transition: color 0.3s;
}

.chat-header button:hover {
  color: #ddd;
}

.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background-color: #ffffff; /* 메시지 영역의 배경색 하얀색 */
  display: flex;
  flex-direction: column;
}

.chat-message-wrapper {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
}

.chat-message-wrapper.sent {
  justify-content: flex-end;
}

.chat-message-wrapper.received {
  justify-content: flex-start;
}

.profile-picture {
  width: 40px;
  height: 40px;
  margin-right: 8px;
}

.profile-picture img {
  width: 100%;
  height: 100%;
  border-radius: 50%; /* 프로필 사진을 원형으로 만듦 */
}

.chat-message {
  background-color: #f7f7f7; /* 메시지 배경색 */
  border-radius: 12px;
  padding: 12px;
  max-width: 70%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chat-message p {
  margin: 0;
  word-break: break-word;
}

.chat-message.sent {
  background-color: #d1ffd1; /* 송신된 메시지의 배경색 (연한 초록색) */
  color: #000;
}

.chat-message.received .sender-name {
  font-weight: bold;
  margin-bottom: 4px;
  color: #888; /* 발신자 이름의 색상 */
}

.chat-input {
  padding: 12px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  background: #f9f9f9; /* 아주 연한 회색 배경 */
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 24px;
  font-size: 16px;
  background-color: #fff;
}

.chat-input button {
  margin-left: 12px;
  padding: 10px 16px;
  border: none;
  background-color: #5E9C06; /* 전송 버튼 색상 카카오톡 스타일 */
  color: #fff;
  border-radius: 24px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.2s;
}

.chat-input button:hover {
  background-color: #4d7a04; /* 버튼 hover 시 색상 변경 */
  transform: scale(1.05); /* 버튼 확대 효과 */
}

.chat-input button:active {
  transform: scale(1); /* 클릭 시 원래 크기로 복귀 */
}
</style>
