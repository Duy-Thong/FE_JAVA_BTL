import axios from 'axios';

const axiosInstance = axios.create({
    // nếu backend run ở local thì nữa em replace cái baseUrl này thành url tới enpoint api
    baseURL: 'http://localhost:8080/api',
    timeout: 30000, // 30s
    headers: { 'Content-Type': 'application/json' },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    },
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response.data;
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error such as Refresh Token, ...
        return Promise.reject(error);
    },
);

export { axiosInstance };
