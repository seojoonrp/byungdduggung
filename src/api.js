import axios from 'axios';

const API_BASE_URL = 'https://byungdduggung-b.onrender.com/api';

export const scoreApi = {
  submitScore: async (nickname, department, score) => {
    const response = await axios.post(`${API_BASE_URL}/scores`, {
      nickname,
      department,
      similarity: score
    });
    return response.data;
  },

  getAllScores: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/scores`);
      return response.data;
    } catch (error) {
      console.error('전체 점수 조회 실패:', error);
      return [];
    }
  },

  getDepartmentScores: async (department) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/scores/${department}`);
      return response.data;
    } catch (error) {
      console.error('학과별 점수 조회 실패:', error);
      return [];
    }
  }
};