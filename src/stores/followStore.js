import { defineStore } from 'pinia';
import axios from 'axios';

export const useFollowStore = defineStore('followStore', {
  state: () => ({
    followers: [],
    following: [],
  }),
  actions: {
    async fetchFollowLists(token) {
      try {
        const followersResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/follow/followers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.followers = followersResponse.data;

        const followingResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/follow/following`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.following = followingResponse.data;
      } catch (error) {
        console.error('팔로워 및 팔로잉 리스트를 가져오는 중 오류 발생:', error);
      }
    },
    async toggleFollow(userNickname, isFollowing, token) {
      try {
        if (isFollowing) {
          await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/follow`, {
            data: { userNickname },
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          await axios.post(`${import.meta.env.VITE_API_BASE_URL}/follow`, {
            userNickname,
          }, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
        await this.fetchFollowLists(token); // 팔로우 리스트 갱신
      } catch (error) {
        console.error('팔로우/언팔로우 중 오류 발생:', error);
      }
    }
  },
});
