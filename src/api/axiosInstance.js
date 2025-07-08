// client/src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://purity-certificate-server.onrender.com/api',
});

export default axiosInstance;
