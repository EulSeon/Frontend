import axios from 'axios';

const BASE_URL = 'http:// ??? '; // 나중에 백엔드 주소 가져오기

const defaultApi = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export const defaultInstance = defaultApi;
