import axios from 'axios';
import { getToken } from '../utils/auth';

const axiosInstance = axios.create({
    baseURL: 'http://192.168.1.46:8000/api/', // sunucu url, wifide calisirken Wireless LAN adapter Wi-Fi: ipv4 kismi olacak. degisirse degistirmeyi unutma
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
