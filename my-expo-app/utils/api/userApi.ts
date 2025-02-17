import axios from 'axios';
import { Platform } from 'react-native';
import { removeToken, storeToken } from 'utils/authStorage';

const API = "http://192.168.1.12:3000/"
const isWeb = Platform.OS === 'web';

export const signupUser = async (username: string, email: string, password: string) => {
    try {
        const { data } = await axios.post(
            `${API}api/users/create`, 
            { username, email, password },
            { 
                withCredentials: isWeb,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        return data.data;
    } catch (error) {
        console.error('Signup error:', error);
        throw error;
    }
};

export const loginUser = async (email: string, password: string) => {
    try {
        const { data } = await axios.post(
            `${API}api/users/login`,
            { email, password },
            {
                withCredentials: isWeb,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        
        if (!isWeb && data.token) {
            await storeToken(data.token);
        }
        
        return data.user;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        await axios.post(`${API}api/users/logout`, {}, { withCredentials: isWeb });

        if (!isWeb) {
            await removeToken();
        }
    } catch (error) {
        console.error("Logout error:", error);
    }
};