<template>
  <div class="intro-container">
    <header class="header">
      <h1>Leafresh</h1>
      <p>Your Gardening Journey</p>
    </header>

    <!-- 이미지를 중앙 정렬하고 크기 조정 -->
    <div>
      <img 
        src="/images/leafresh_img.png" 
        alt="Leafresh 이미지" 
        class="intro-image"
        @click="showPopup = true"
      >
    </div>

    <!-- 하츄핑이 튀어나오는 팝업 -->
    <div v-if="showPopup" class="popup">
      <img src="https://i.namu.wiki/i/_MD8e3O1UiC2tgaId4_QcE2ElIXfGrszNfVhR_qwp6nKcZ2W1GGtxx9tFnQagn82yP8Dt5iIgL42MKn9batI1NKdl_4f0JaZmL28Pr07dry0sgbMgfNOAN7vWkoOV1ne56a8GOA2qBeiFm0fWYDDrA.webp" alt="하츄핑" class="popup-image">
    </div>

    <!-- 프로젝트 소개 섹션 -->
    <section class="section project-description">
      <h2>프로젝트 소개</h2>
      <p>
        Leafresh는 단순한 원예 도구를 넘어, 당신의 원예 생활을 더 즐겁고 성공적으로 만들어 줄 완벽한 동반자입니다.
      </p>
    </section>

    <!-- 기능 소개 섹션 -->
    <section class="section features">
      <h2>주요 기능</h2>
      <ul>
        <li>
          <h3>1. 체계적인 원예 관리</h3>
          <p>Leafresh는 당신의 원예 활동을 효과적으로 기록하고 관리할 수 있도록 도와줍니다.<br>
            식물의 성장 단계, 물주기, 비료 사용 등 모든 세부 사항을 체계적으로 기록할 수 있어, 더 나은 원예 결과를 얻을 수 있습니다.</p>
        </li>
        <li>
          <h3>2. 커뮤니티의 지식 공유</h3>
          <p>Leafresh의 커뮤니티는 전 세계의 원예 애호가들이 모여 서로의 경험과 지식을 공유하는 공간입니다.<br>
            커뮤니티의 도움을 받아 식물의 문제를 해결하거나 새로운 원예 트렌드를 발견할 수 있습니다.</p>
        </li>
        <li>
          <h3>3. 맞춤형 원예 조언 제공</h3>
          <p>Leafresh는 사용자의 식물 종류와 지역 기후에 따라 맞춤형 원예 조언을 제공합니다.<br>
            또한, 특정 상황에 맞는 알림과 팁을 제공해 원예 초보자들도 쉽게 따라할 수 있습니다.</p>
        </li>
      </ul>
    </section>

    <!-- 팀원 소개 섹션 -->
    <section class="section team">
      <h2>팀원 소개</h2>
      <div class="team-members">
        <div class="member" v-for="member in teamMembers" :key="member.name">
          <h3>{{ member.name }}</h3>
          <img :src="member.githubImage" alt="GitHub 프로필 사진" class="profile-image">
          <ul v-if="member.job && member.job.length" class="job-list">
            <li v-for="(job, index) in member.job" :key="index">{{ job }}</li>
          </ul>
          <a :href="member.githubLink" target="_blank">깃허브 링크</a>
        </div>
      </div>
    </section>

    <!-- 연락처 섹션 -->
    <section class="section contact">
      <h2>문의하기</h2>
      <p>
        프로젝트에 대한 문의사항은 아래 깃허브로 연락주세요:<br>
        <a href="https://github.com/orgs/Leafresh-2024/discussions">깃허브 Discussions</a>
      </p>
    </section>
  </div>
</template>

<script setup>
import { ref,watch } from 'vue';

const teamMembers = [
  {
    name: "강형석",
    githubLink: "https://github.com/ppudding3861",
    githubImage: "https://github.com/ppudding3861.png",
    job: ["백엔드", "프론트엔드", "로그인"]
  },
  {
    name: "주순태",
    githubLink: "https://github.com/stjoo0925",
    githubImage: "https://github.com/stjoo0925.png",
    job: ["데이터베이스", "API"]
  },
  {
    name: "이서현",
    githubLink: "https://github.com/dansun2",
    githubImage: "https://github.com/dansun2.png",
    job: ["UI/UX 디자인"]
  },
  {
    name: "서은진",
    githubLink: "https://github.com/jinnyjinny12",
    githubImage: "https://github.com/jinnyjinny12.png",
    job: ["테스트", "디버깅"]
  },
  {
    name: "황정한",
    githubLink: "https://github.com/hwangjeonghan",
    githubImage: "https://github.com/hwangjeonghan.png",
    job: ["배포", "백엔드"]
  },
  {
    name: "김민주",
    githubLink: "https://github.com/minju132",
    githubImage: "https://github.com/minju132.png",
    job: ["프론트엔드", "문서화"]
  }
];

// 하츄핑 팝업 상태 관리
const showPopup = ref(false);

// 하츄핑 3초 후 자동으로 사라지게 설정
watch(showPopup, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      showPopup.value = false;
    }, 3000); // 3초 후 팝업 사라짐
  }
});
</script>

<style scoped>
/* 전체 배경 */
.intro-container {
  font-family: Arial, sans-serif;
  background-color: #E1C59D; /* 베이지톤 배경 */
  padding: 20px;
}

/* 헤더 스타일 */
.header {
  text-align: center;
  padding: 20px 0;
}

.header h1 {
  font-family: "ghanachoco";
  color: #3B755F;
  font-size: 48px;
  margin-bottom: 10px;
}

.header p {
  font-family: "ghanachoco";
  font-size: 18px;
  color: #fff; /* 연한 녹색 톤 */
}

/* 이미지 중앙 정렬 및 크기 조정 */
.intro-image {
  display: block;
  margin: 0 auto; /* 중앙 정렬 */
  width: 50%; /* 이미지 크기 조정 */
  max-width: 600px;
  height: auto;
}

/* 하츄핑 팝업 스타일 */
.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-image {
  width: 300px; /* 하츄핑 이미지 크기 조절 */
  border-radius: 15px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

/* 섹션 스타일 */
.section {
  margin-top: 40px;
  padding: 20px;
  background-color: #E6ECF2; /* 연한 블루 배경 */
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.section h2 {
  font-family: "GothicA1-Light";
  font-size: 24px;
  color: #80543E; /* 갈색 톤 */
  margin-bottom: 20px;
}

.section h3 {
  font-family: "GothicA1-Light";
  font-size: 18px;
  color: #80543E; /* 갈색 톤 */
  margin-bottom: 10px;
}

.section p,
.section ul {
  font-family: "GothicA1-Light";
  font-size: 16px;
  color: #2C3562; /* 어두운 블루 톤 */
  margin-bottom: 10px;
  line-height: 1.5;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

/* 팀원 소개 스타일 */
.team-members {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
}

.member {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #CF8E4A; /* 오렌지 톤 */
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  width: 30%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.member h3 {
  font-family: "GothicA1-Light";
  margin-bottom: 10px;
  font-size: 20px;
  color: white;
}

.member a {
  font-family: "GothicA1-Light";
  color: white;
  text-decoration: none;
}

.member a:hover {
  color: #E1C59D; /* 베이지톤 */
}

/* 프로필 이미지 원형 스타일 */
.profile-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
  background-color: #fff;
}

/* job 리스트 스타일 */
.job-list {
  list-style-type: none;
  padding: 0;
  margin-top: 10px;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.job-list li {
  font-family: "GothicA1-Light";
  font-size: 14px;
  color: white;
  margin-right: 10px;
  padding: 5px 10px;
  border: none;
  border-radius: 15px;
  background-color: #455F9E; /* 밝은 블루 톤 */
  white-space: nowrap;
}

/* 마지막 항목에 마진이 추가되지 않도록 */
.job-list li:last-child {
  margin-right: 0;
}

/* 연락처 섹션 */
.contact a {
  font-family: "GothicA1-Light";
  color: #3B755F; /* 어두운 블루 톤 */
  text-decoration: none;
}

.contact a:hover {
  text-decoration: underline;
}
</style>
