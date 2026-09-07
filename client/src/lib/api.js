import axios from 'axios';

const api = axios.create({
  baseURL:'https://sybn.onrender.com/api/v1',
  withCredentials: true,
});

export default api;
