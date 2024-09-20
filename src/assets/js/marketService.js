const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchMarketDetails(marketId, token) {
    try {
        // market detail 데이터 가져옴
        const response = await fetch(`${API_BASE_URL}/market/detail/${marketId}`, {
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
        const marketData = await response.json(); // 응답받은 데이터
        const userEmail = marketData.post.userEmail; // 게시글에 저장된 email 가져오기
        const imagePath = marketData.post.marketImage; // 게시글 url 경로 가져옴
        const marketImage = `${API_BASE_URL}/ftp/image?path=${encodeURIComponent(imagePath)}`;

        if (marketData && marketData.post) {
            const createdDate = new Date(marketData.post.marketCreatedAt); //  게시글 등록일을 가져와서 Date객체로 바꿈
            const today = new Date();
            const timeDiff = today - createdDate; // 밀리초 차이
            const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // 일(day)로 변환

            if (dayDiff === 0) {
                marketData.post.displayDate = "오늘";
            } else if (dayDiff === 1) {
                marketData.post.displayDate = "어제";
            } else {
                marketData.post.displayDate = `${dayDiff}일 전`;
            }
        }
        return marketData;
    } catch (error) {
        console.error("오류:", error);
    }
};

// 분양중과 분양완료 상태만 바꿔서 백엔드에 저장함
export async function updateMarketStatus(id, status, token, marketData) {
    if (!id) {
        console.error("게시글이 존재하지 않습니다. 다시 시도해주세요");
        return;
    }

    const showCompletedAlert = () => alert("이미 분양이 완료된 게시글입니다.");

    if (!status) { // 이미 분양 완료 상태인 경우
        showCompletedAlert();
        return;
    }

    const confirmed = confirm("분양이 완료되셨다면 확인을 눌러주세요. 분양이 완료 될 경우 다시 되돌릴 수 없습니다.");

    if (!confirmed) {
        // 사용자가 취소를 누르면 함수 종료
        return;
    }
    try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/market/update-status/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: !status,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`서버 응답 오류 : ${errorData.message || "알 수 없는 오류"}`);
        }
        const updateMarketData = await response.json(); // 백엔드의 상태 결과값을 가져옴
        
    } catch (error) {
        console.error("오류:", error);
        alert("상태 업데이트 중 오류가 발생했습니다.");
    }
};

export async function deletePost(id, token) {
    if (!id) {
      console.error("삭제할 게시글 ID가 없습니다.");
      return;
    }
  
    const confirmed = confirm("삭제된 게시글은 되돌릴 수 없습니다. 그래도 삭제하시겠습니까?");
  
    if (!confirmed) {
      return;
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/market/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        }, 
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`삭제 오류: ${errorData.message || "알 수 없는 오류"}`);
      }
      return await response.json(); // 응답 데이터 반환
    } catch (error) {
      
    }
};

// 작성자 이메일 기준으로 작성자 정보를 가져오는 함수
export async function getUserInfo(userEmail, token) {
        try {
            const response = await fetch(`${API_BASE_URL}/user/info-market?email=${userEmail}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                  }, 
            })
            const userData = await response.json();
            return userData;
        } catch (error) {
            console.error("오류:", error);
        }
}
