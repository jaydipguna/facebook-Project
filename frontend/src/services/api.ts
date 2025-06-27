import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api',  
  // timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',  
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log("token",token);
    
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;  
    }
    return config;  
  },
  (error) => {
    return Promise.reject(error);  
  }
);

api.interceptors.response.use(
  (response) => {
    return response.data;  
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.error('Unauthorized access. Please login again.');
      } else if (error.response.status === 500) {
        console.error('Server error. Please try again later.');
      } else {
        console.error('Error:', error.response.data);
      }
    } else if (error.request) {
      console.error('No response received. Please check your connection.');
    } else {
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error); 
  }
);

export default api;
