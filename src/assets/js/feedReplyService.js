const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchReplyLists(feedId, token, comments) {
    try {
        const response = await fetch(`${API_BASE_URL}/feeds/${feedId}/reply`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`서버 응답 오류 : ${errorData.message || "알수없는 오류"}`);
        }
        const reply = await response.json();
        comments.value = reply;
        comments.replyUpdatedAt = reply.map(comment => comment.replyUpdatedAt);
        const today = new Date();

        comments.value.forEach(comment => {
          const replyUpdateDate = new Date(comment.replyUpdatedAt);
          const timeDiff = today - replyUpdateDate;
          const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

          if (dayDiff === 0) {
            // 날짜가 같을 경우 시간, 분으로 세세하게 나눔
            const hourDiff = Math.floor(timeDiff / (1000 * 60 * 60)); // 시간 단위 차이
            const minuteDiff = Math.floor(timeDiff / (1000 * 60)); // 분 단위 차이

            if (hourDiff > 0) {
              comment.displayDate = `${hourDiff}시간 전`;
            } else if (minuteDiff > 0) {
              comment.displayDate = `${minuteDiff}분 전`;
            } else {
              comment.displayDate = "방금 전";
            }
          } else if (dayDiff === 1) {
            comment.displayDate = "어제";
          } else {
            comment.displayDate = `${dayDiff}일 전`;
          }
        });
        
    } catch (error) {
        console.error('오류:', error);
    }
}

// 작성자 고유id번호로 작성자 정보를 가져오는 함수
export async function getUserInfo(userId, token) {
  try {
    console.log('js-api호출됨');
    const response = await fetch(`${API_BASE_URL}/user/userinfo-id?userId=${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      }, 
    })
    const userData = await response.json();
    const userNickname = userData.userNickname;
    const profileImg = userData.imageUrl;
    
    return { userNickname, profileImg };
  } catch(error) {
    console.error("유저정보 조회 실패! : ", error);
  }
}