<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router"; // useRoute 추가
import Swal from "sweetalert2"; // SweetAlert2 라이브러리 임포트

const userName = ref("");
const userNickname = ref("");
const userPhoneNumber = ref("");
const userMailAdress = ref("");
const userPassword = ref("");
const confirmPassword = ref("");
const profileImage = ref(null);

const nameError = ref("");
const nicknameError = ref("");
const phoneNumberError = ref("");
const emailError = ref("");
const passwordError = ref("");
const confirmPasswordError = ref("");

const router = useRouter();
const route = useRoute(); // 현재 라우트 정보 가져오기
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 약관 동의 여부 확인
const termsAgreed = ref(false);
onMounted(() => {
  termsAgreed.value = route.query.termsAgreed === "true"; // 쿼리에서 약관 동의 여부 가져오기
  if (!termsAgreed.value) {
    alert("약관에 동의해야 회원가입을 진행할 수 있습니다.");
    router.push("/terms"); // 동의하지 않은 경우 동의 페이지로 리다이렉트
  }
});

// Sweetalert2 토스트 설정 함수
const showToast = (message, icon = "warning") => {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: icon,
    title: message,
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    background: "#fff",
    color: "#333",
    customClass: {
      title: "custom-swal-title", // 제목의 커스텀 클래스를 지정
    },
  });
};

// 닉네임 중복 확인 함수
const checkNicknameDuplicate = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/auth/checkNickname?nickname=${userNickname.value}`
    );
    return response.data.exists; // 닉네임이 존재하는지 여부 반환
  } catch (error) {
    console.error("닉네임 중복 확인 오류:", error);
    showToast("닉네임 중복 확인에 실패했습니다.", "error");
    return false; // 오류가 발생한 경우 중복으로 처리
  }
};

// 유효성 검사 및 첫 번째 오류만 표시
const validateInputs = async () => {
  if (!userName.value) {
    showToast("이름을 입력하세요.");
    return false; // 첫 번째 오류 발견 시 바로 중단
  } else if (userName.value.length > 6) {
    showToast("이름은 최대 6자까지 입력할 수 있습니다.");
    nameError.value = "이름은 최대 6자까지 입력할 수 있습니다.";
    return false; // 첫 번째 오류 발견 시 바로 중단
  } else {
    nameError.value = "";
  }

  if (!userNickname.value) {
    showToast("닉네임을 입력하세요.");
    return false; // 첫 번째 오류 발견 시 바로 중단
  } else if (userNickname.value.length > 15) {
    showToast("닉네임은 최대 15자까지 입력할 수 있습니다.");
    nicknameError.value = "닉네임은 최대 15자까지 입력할 수 있습니다.";
    return false; // 첫 번째 오류 발견 시 바로 중단
  } else {
    const isNicknameDuplicate = await checkNicknameDuplicate(); // 닉네임 중복 검사
    if (isNicknameDuplicate) {
      showToast("이미 사용 중인 닉네임입니다.");
      nicknameError.value = "이미 사용 중인 닉네임입니다.";
      return false;
    }
    nicknameError.value = "";
  }

  const phoneNumberPattern = /^[0-9]{10,11}$/;
  if (!userPhoneNumber.value) {
    showToast("전화번호를 입력하세요.");
    return false; // 첫 번째 오류 발견 시 바로 중단
  } else if (!phoneNumberPattern.test(userPhoneNumber.value)) {
    showToast("유효한 전화번호를 입력하세요.");
    phoneNumberError.value = "유효한 전화번호를 입력하세요.";
    return false; // 첫 번째 오류 발견 시 바로 중단
  } else {
    phoneNumberError.value = "";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!userMailAdress.value) {
    showToast("이메일을 입력하세요.");
    return false; // 첫 번째 오류 발견 시 바로 중단
  } else if (!emailPattern.test(userMailAdress.value)) {
    showToast("유효한 이메일 주소를 입력하세요.");
    emailError.value = "유효한 이메일 주소를 입력하세요.";
    return false; // 첫 번째 오류 발견 시 바로 중단
  } else {
    emailError.value = "";
  }

  if (!userPassword.value) {
    showToast("비밀번호를 입력하세요.");
    return false; // 첫 번째 오류 발견 시 바로 중단
  } else if (userPassword.value.length < 6 || userPassword.value.length > 20) {
    showToast("비밀번호는 6자 이상, 20자 이하로 입력해야 합니다.");
    passwordError.value = "비밀번호는 6자 이상, 20자 이하로 입력해야 합니다.";
    return false; // 첫 번째 오류 발견 시 바로 중단
  } else {
    passwordError.value = "";
  }

  if (!confirmPassword.value) {
    showToast("비밀번호 확인을 입력하세요.");
    return false; // 첫 번째 오류 발견 시 바로 중단
  } else if (userPassword.value !== confirmPassword.value) {
    showToast("비밀번호가 일치하지 않습니다.");
    confirmPasswordError.value = "비밀번호가 일치하지 않습니다.";
    return false; // 첫 번째 오류 발견 시 바로 중단
  } else {
    confirmPasswordError.value = "";
  }

  return true; // 모든 유효성 검사를 통과하면 true 반환
};

const handleImageUpload = (event) => {
  profileImage.value = event.target.files[0];
};

const handleSubmit = async () => {
  if (!(await validateInputs())) {
    return;
  }

  try {
    let uploadedImagePath = "";

    if (profileImage.value) {
      const formData = new FormData();
      formData.append("file", profileImage.value);

      const imageUploadResponse = await axios.post(
        `${API_BASE_URL}/ftp/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      uploadedImagePath = imageUploadResponse.data.uploadedFilePath.trim();
    }

    const userInfo = {
      name: userName.value,
      nickname: userNickname.value,
      phoneNumber: userPhoneNumber.value,
      email: userMailAdress.value,
      password: userPassword.value,
      imageUrl: uploadedImagePath,
      termsAgreement: termsAgreed.value, // 약관 동의 여부를 함께 전송
    };

    const response = await axios.post(`${API_BASE_URL}/auth/signup`, userInfo, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    showToast("회원가입이 성공적으로 완료되었습니다.", "success");
    router.push("/login");
  } catch (error) {
    if (
      error.response &&
      error.response.data &&
      error.response.data.message === "중복된 이메일 입니다"
    ) {
      showToast("중복된 이메일 입니다", "error");
    } else {
      console.error("회원가입 오류:", error);
      showToast("회원가입에 실패했습니다.", "error");
    }
  }
};
</script>
