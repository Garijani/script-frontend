// // import axios from 'axios';

// // // Create an Axios instance
// // const api = axios.create({
// //   baseURL: process.env.REACT_APP_API || 'http://localhost:5000', // Fallback to localhost:5000 if env variable is not set
// //   timeout: 10000, // 10 seconds timeout
// // });

// // // Request interceptor to add the JWT token to headers
// // api.interceptors.request.use(
// //   (config) => {
// //     const token = localStorage.getItem('token');
// //     if (token) {
// //       config.headers['Authorization'] = `Bearer ${token}`;
// //     }
// //     return config;
// //   },
// //   (error) => {
// //     return Promise.reject(error);
// //   }
// // );

// // // Response interceptor to handle errors globally
// // api.interceptors.response.use(
// //   (response) => response,
// //   (error) => {
// //     if (error.response && error.response.status === 401) {
// //       // Handle unauthorized access (e.g., token expired or invalid)
// //       localStorage.removeItem('token'); // Clear the invalid token
// //       window.location.href = '/login'; // Redirect to login page
// //     }
// //     return Promise.reject(error);
// //   }
// // );

// // export default api;

// // frontend/src/api.js
// import axios from 'axios';

// const api = axios.create({
//   baseURL: process.env.REACT_APP_API || 'http://localhost:5000/api',
//   timeout: 10000,
// });

// // Attach JWT from localStorage on every request
// api.interceptors.request.use(
//   config => {
//     const token = localStorage.getItem('token');
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   err => Promise.reject(err)
// );

// // Auto-redirect to /login on 401
// api.interceptors.response.use(
//   resp => resp,
//   err => {
//     if (err.response?.status === 401) {
//       localStorage.removeItem('token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(err);
//   }
// );

// export default api;


// frontend/src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API || 'http://localhost:3001/api',
  timeout: 10000,
});
console.log('API Base URL:', api.defaults.baseURL); // Add this line

// Attach JWT from localStorage on every request
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  err => Promise.reject(err)
);

// Auto-redirect to /login on 401
api.interceptors.response.use(
  resp => resp,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;