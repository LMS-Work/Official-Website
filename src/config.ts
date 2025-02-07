interface Config {
  apiBaseUrl: string;
  wsBaseUrl: string;
}

// 使用 window 对象判断是否为开发环境
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';

const config: Config = {
  apiBaseUrl: isDevelopment ? 'http://127.0.0.1:5000' : '/api',
  wsBaseUrl: isDevelopment ? 'ws://127.0.0.1:5000' : 'wss://127.0.0.1'
};

export default config;
  