import axios from 'axios';
import config from '../config';

const handleLogin = async (password: string) => {
  try {
    const response = await axios.post(`${config.apiBaseUrl}/login`, { password });
    if (response.data.token) { // 假设后端返回 JWT token
      localStorage.setItem('jwt_token', response.data.token);
      // 处理登录成功后的逻辑
    }
  } catch (error) {
    // 处理登录失败
    console.error('Login failed:', error);
  }
}; 