import axios from 'axios';

const api = axios.create({
  // baseURL:'https://sybn.onrender.com/api/v1',
  baseURL:'http://localhost:5000/api/v1',
  withCredentials: true,
});

export default api;
