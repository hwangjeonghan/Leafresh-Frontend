<template>
<div class="market_detail_box">
  <div class="market_detail_header">
    <div class="market_text_box">
      <div class="market_category_box">{{ market.post.marketCategory }}</div>
      <div class="market_title_box">{{ market.post.marketTitle }}</div>
    </div>
    <div class="market_post_info_box">
      <div :class="market.post.marketStatus ? 'market_status_box_true' : 'market_status_box_false'"
        @click="handleStatusUpdate">
        <p>{{ market.post.marketStatus ? "분양중" : "분양 완료" }}</p>
      </div>
      <div class="market_created_box">
        <p class="market_created_at" style="text-align: right">{{ market.post.displayDate }}</p>
      </div>
    </div>
  </div>
  <img class="market_image_box" :src="marketImage" alt="Market Image" />
  <div class="market_content_box">{{ market.post.marketContent }}</div>
  <div class="market_btn_box">
    <div v-if="isUser">
      <button class="market_btn_edit" @click="editPost(market.post.marketId)">수정하기</button>
      <button class="market_btn_delete" @click="deletePost(market.post.marketId)">삭제하기</button>
    </div>
    <button class="market_btn_list" @click="allPostList">글목록</button>
  </div>
</div>
</template>

<style scoped>
</style>
  
<script setup>
import { computed } from 'vue';
import "@/assets/css/marketDetail.css";
  
const props = defineProps({
  market: Object,
  marketImage: String,
  isUser: Boolean,
  handleStatusUpdate: Function,
  editPost: Function,
  deletePost: Function,
  allPostList: Function,
});
</script>
