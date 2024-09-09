<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router"; // Vue Router import
import { useUserstore } from "@/stores/users.js"; // Pinia 스토어 import

const router = useRouter(); // router 인스턴스 사용 설정
const loginState = useUserstore(); // Pinia 스토어에서 로그인된 유저 정보 가져오기

const myObject = ref([
  {
    id: 1,
    image:
      "https://flexible.img.hani.co.kr/flexible/normal/970/777/imgdb/resize/2019/0926/00501881_20190926.JPG",
  },
  {
    id: 2,
    image:
      "https://png.pngtree.com/png-vector/20231020/ourmid/pngtree-cute-kitty-cat-png-image_10236153.png",
  },
  {
    id: 3,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwL8qf5q4nIGfzpDlZZD11ArA1Ops6EEAWDg&s",
  },
  {
    id: 4,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJHKe0ZZOLjpQjO8TAqTV0Q20hkeoi1HUmJQ&s",
  },
]);

// 피드 추가 페이지로 이동
const goToFeedAdd = () => {
  router.push("/garden-diary/feed-add"); // 피드 추가 페이지로 이동
};

// 피드 상세 페이지로 이동, username을 Pinia에서 가져옴
const goToFeedDetail = (id) => {
  const username = loginState.username; // Pinia에서 로그인된 유저의 username 가져오기
  router.push(`/garden-diary/feed-detail/${username}/${id}`); // username과 id를 함께 전달
};
</script>

<template>
  <div class="p-3 m-0 border-0 bd-example m-0 border-0">
    <ul style="list-style-type: none; padding: 0">
      <li
        v-for="(card, index) in myObject"
        :key="card.id"
        @click="goToFeedDetail(card.id)"
        style="display: inline-block; margin: 10px; padding: 10px; width: 18rem"
      >
        <div class="card" style="width: 100%">
          <a>
            <img
              :src="card.image"
              alt=""
              class="card-img-top"
              style="
                width: 100%;
                height: 100%;
                aspect-ratio: 1;
                object-fit: cover;
              "
            />
          </a>
        </div>
      </li>
    </ul>

    <!-- 피드 추가 버튼 -->
    <div style="text-align: center; margin-top: 20px">
      <button @click="goToFeedAdd" class="btn btn-primary">피드 추가</button>
    </div>
  </div>
</template>
