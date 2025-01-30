import { AxiosError } from "axios";
import api from "./apiConfig";
import { ShortenedLink } from "../pages/Home";


export interface ErrorResponse { message:string; } 

export const login = async ({email,password}:{email:string,password:string}):Promise<{status:number,data:{accessToken?:string;message:string}}> => {
    try {
        const response = await api.post('/login', {email, password});
        if(response.status !== 200) throw new Error('error in login');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message); 
    }
}

export const register = async ({name, email, password}:{name:string,email:string,password:string}):Promise<{status:number,data:{accessToken?:string;message:string}}> => {
    try {
        const response = await api.post('/register', {name, email, password});
        if(response.status !== 200) throw new Error('error in register');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message); 
    }
}

export const getOTP = async (email:string):Promise<{status:number,data:{message:string}}> => {
    try {
        const response = await api.post('/getOTP', { email });
        if(response.status !== 200) throw new Error('error to generate otp');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message); 
    }
}

export const validateOTP = async ({email, otp}:{email:string,otp:string}):Promise<{status:number,data:{message:string}}> => {
    try {
        const response = await api.post('/validateOTP', {email, otp});
        if(response.status !== 200) throw new Error('error in register');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message); 
    }
}

export const shortenURL = async (url:string):Promise<{status:number;data:{newUrl:ShortenedLink};}> => {
    try {
        const response = await api.post('/shortenURL', { url });
        if(response.status !== 200) throw new Error('error in register');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message); 
    }
}

export const getAllShortenURLs = async (page:number):Promise<{status:number,data:{URLs:ShortenedLink[];totalPages:number;currentPage:number}}> => {
    try {
        const itemsPerPage = 10;
        const response = await api.get(`/getAllShortenURLs?page=${page}$limit=${itemsPerPage}`);
        if(response.status !== 200) throw new Error('error find urls');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message); 
    }
}

export const deleteURL = async (id:string):Promise<{status:number,data:{message:string}}> => {
    try {
        const response = await api.delete(`/delete/${id}`);
        if(response.status !== 200) throw new Error('error to delete url');
        return response;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new Error(err?.response?.data?.message); 
    }
}

