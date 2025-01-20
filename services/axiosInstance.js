import axios from 'axios';
import { getToken } from '../utils/auth';

const axiosInstance = axios.create({
    baseURL: 'http://192.168.1.36:8000', // Django sunucu URL'nizi buraya koyun
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
); 

export default axiosInstance;
