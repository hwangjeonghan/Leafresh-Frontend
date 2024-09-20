<template>
<div class="comment-form">
  <form @submit.prevent="submitComment">
    <input v-model="newReply" placeholder="댓글을 입력하세요." />
    <button type="submit">등록</button>
  </form>
</div>
</template>

<script setup>
import { ref } from 'vue';
import { defineEmits } from 'vue';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const props = defineProps({
  feedId: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['addComment']);
const newReply = ref('');


const submitComment = async () => {
  if (newReply.value.trim()) {
    try {
      console.log('폼제출실행');
      await axios.post(`${API_BASE_URL}/feeds/${props.feedId}/addreply`, {
        feedId: props.feedId,
        replyContent: newReply.value,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });
      emit('addComment', newReply.value);
      newReply.value = ''; // 등록 후 내용 초기화
    } catch (error) {
      console.error("댓글 추가 오류:", error);
    }
  }
};
</script>

<style scoped>
.comment-form {
  margin-top: 10px;
  font-family: "GothicA1-Light" !important;
}
</style>