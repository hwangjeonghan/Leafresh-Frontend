<template>
  <div v-if="feed" class="feedDetail-container">
    <div class="container">
      <div class="photo-section">
        <img :src="feed.imageUrl" class="feed-img" />
      </div>
      <div class="content-section">
        <div class="user-header">
          <div class="user-info">
            <img :src="feed.userimg" alt="profile" class="photo" />
            <div>{{ feed.username }}</div>
          </div>
        </div>
        <div class="middle-container">
          <div class="time-container">
            작성일자: {{ new Date(feed.time).toLocaleString() }}
          </div>
        </div>
        <div class="content mb-10">
          <p>{{ feed.content }}</p>
        </div>
        <div class="comments mb-10">
          <div>Comments</div>
          <ul>
            <replyForm :feedId="feed.feedId" @addComment="handleAddReply" />
            <li v-for="(comment, index) in feed.comments" :key="index" class="comments_item">
              <img :src="comment.profileImg" alt="User Profile Image" class="reply_user_image" />
              <p class="comments_nickName">{{ comment.userNickname }}</p>
              <p class="comments_content">{{ comment.replyContent }}</p>
              <p class="comments_date">{{ comment.displayDate }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import replyForm from '../feed/replyForm.vue';

// props로 feed를 받아옴
const props = defineProps({
  feed: {
    type: Object,
    required: true,
  }
});

// feed 데이터를 바로 참조할 수 있도록 설정
const feed = ref(props.feed); // feed 객체를 그대로 참조

// 댓글 추가 이벤트를 받기 위한 emit 정의
const emit = defineEmits(['addComment']);
const handleAddReply = (newReply) => {
  emit('addComment', newReply);
};

</script>

<style scoped>
.feedDetail-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 95%;
  height: 100dvh;
}

.container {
  display: flex;
  flex-direction: row;
  width: 95%;
  height: 800px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  border: 5px solid #a68b6a;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.photo-section {
  flex: 1.8;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.feed-img {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  object-fit: cover;
}

.photo {
  height: 30px;
  border-radius: 50%; /* 원형 이미지로 표시 */
  margin-right: 10px;
}

.content-section {
  flex: 1;
  height: 98%;
  display: flex;
  flex-direction: column;
  padding: 15px;
  overflow: hidden;
  background-color: #fff;
  border-radius: 8px;
  border: none;
}

.user-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
}

.user-info div {
  font-family: "GothicA1-Light";
  font-size: 1em;
  color: #000;
}

.content {
  flex: 3;
  overflow-wrap: break-word; /* 긴 단어나 URL이 박스를 넘어가지 않도록 줄바꿈 */
  word-wrap: break-word; /* IE11 이전 호환 */
  word-break: break-word; /* 긴 단어들이 자동으로 잘리도록 */
  overflow: hidden; /* 넘치는 텍스트 숨기기 */
}

.content p {
  font-family: "GothicA1-Light";
  margin-top: 10px;
  font-size: 0.85em;
  line-height: 1.5;
}

.comments {
  flex: 2;
}

.comments div {
  font-family: "ghanachoco";
  margin-bottom: 10px;
  font-size: 1em;
  color: #76b852; /* fallback for old browsers */
  color: -webkit-linear-gradient(
    to right,
    #8dc26f,
    #76b852
  ); /* Chrome 10-25, Safari 5.1-6 */
  color: linear-gradient(
    to right,
    #8dc26f,
    #76b852
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

.comments ul {
  height: 95%;
  list-style-type: none;
  border: none;
  border-radius: 10px;
  background-color: #f5f5f5;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 5px;
}

.comments li {
  font-family: "GothicA1-Light";
  margin-top: 10px;
  font-size: 0.9em;
}

.comments_item {
  display: flex;
  align-items: center;
  margin: 8px !important;
}

.reply_user_image {
    width: 20px;
    /* 이미지 크기 */
    height: 20px;
    /* 이미지 크기 */
    border-radius: 100%;
    /* 동그라미 모양 */
    object-fit: cover;
    /* 이미지 비율 유지 */
    margin-right: 5px;
    cursor: pointer;
}

.comments_nickName {
  font-size: 0.8em !important;
  font-weight: bold;
  color: #2d8b5d !important;
  margin: 0 0.5em 0 0 !important;
}

.comments_content {
  font-size: 1em !important;
  margin: 0 0.5em 0 0 !important;
}

.comments_date {
  font-size: 0.5em !important;
  margin: 0 !important;
}

.middle-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

.time-container {
  font-family: "GothicA1-Light";
  font-size: 0.8em;
  line-height: 0.8em;
  color: #999;
  width: 100%;
  padding: 5px;
}

.btn-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: right;
  flex: 0.2;
}

.modify-button-section {}

.modify-button {
  background: #76b852; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #8dc26f,
    #76b852
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #8dc26f,
    #76b852
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  color: white;
  padding: 2px 6px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-left: 10px;
}

.material-icons {
  font-size: 21px;
  color: #fff;
}
</style>
