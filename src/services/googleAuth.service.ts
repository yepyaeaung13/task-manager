import { authApi } from "./auth.api";

export async function  getUserInfo() {
    const response = await authApi.get('/userinfo');
    return response.data;
}