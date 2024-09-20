<template>
<div class="comment-form">
  <textarea v-model="newReply" placeholder="댓글을 입력하세요." @keyup.enter="submitComment"></textarea>
  <button @click="submitComment">등록</button>
</div>
</template>

<script setup>
import { ref } from 'vue';
import { defineEmits } from 'vue';
import axios from 'axios';

const props = defineProps({
  feedId: {
    type: Number,
    required: true
  },
  addComment: {
    type: Function,
    required: true
  }
});

const newReply = ref('');
const emit = defineEmits(['addComment']);

const submitComment = async () => {
  if (newReply.value.trim()) {
    try {
      await axios.post(`${API_BASE_URL}/feeds/${feedId}/addreply`, {
        feedId: props.feedId,
        content: newReply.value,
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
}
textarea {
  width: 100%;
}
button {
  margin-top: 5px;
}
</style>