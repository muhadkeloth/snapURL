import axios from "axios";


const api = axios.create({
    baseURL:import.meta.env.VITE_ENDPORTFRONT,
    headers: {
        'Content-Type':'application/json',
    }
});


api.interceptors.request.use((config) => {
    const publicRoutes = [
        '/login','/register','/getOTP','/validateOTP',
    ];
    if(config.url && publicRoutes.includes(config.url))return config;
    let token: string|null = null;
    
    token = localStorage.getItem('accessToken');
    const endpoint:string = '/login';

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }else{
        window.location.href = endpoint;        
    }    
    return config;
},(error) => Promise.reject(error)
);



api.interceptors.response.use(
    (response) => response,
    async (error) => {     
        if(error.response?.status == 403){
            localStorage.removeItem('accessToken');
            window.location.href = '/login';                
        }
        return Promise.reject(error);
    }
);

export default api;