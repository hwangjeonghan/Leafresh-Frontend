const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchReplyLists(feedId, token, comments) {
    console.log('feedId받아온거 ',feedId);
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
    } catch (error) {
        console.error('오류:', error);
    }
}