import axios from 'axios';

// REACT_APP_BackEndUrl = "http://3.38.14.62:8000"
const BASE_URL = process.env.REACT_APP_BackEndUrl;

const defaultApi = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export const defaultInstance = defaultApi;
