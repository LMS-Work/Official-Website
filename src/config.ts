interface Config {
  apiBaseUrl: string;
  wsBaseUrl: string;
}

// 使用 window 对象判断是否为开发环境
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';

const config: Config = {
  apiBaseUrl: isDevelopment ? 'http://localhost:5000' : '/api',
  wsBaseUrl: isDevelopment ? 'ws://localhost:5000' : 'wss://your-production-domain.com'
};

export default config;
  